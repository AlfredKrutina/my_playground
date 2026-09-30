const DEBUG = new URLSearchParams(location.search).has("debug");

const lessonSelect = document.getElementById("lessonSelect");
const textContainer = document.getElementById("textContainer");
const typingArea = document.getElementById("typingArea");
const typingInput = document.getElementById("typingInput");
const overlay = document.getElementById("overlay");
const wpmDisplay = document.getElementById("wpm");
const accDisplay = document.getElementById("accuracy");
const progDisplay = document.getElementById("progress");
const progressFill = document.getElementById("progressFill");
const progressTrack = document.getElementById("progressTrack");
const resetBtn = document.getElementById("resetBtn");
const nextBtn = document.getElementById("nextBtn");
const metaBook = document.getElementById("metaBook");
const metaTitle = document.getElementById("metaTitle");
const metaLength = document.getElementById("metaLength");
const liveStatus = document.getElementById("liveStatus");
const debugPanel = document.getElementById("debugPanel");

let currentText = "";
let currentIndex = 0;
let statuses = [];
let totalKeystrokes = 0;
let mistakes = 0;
let startTime = null;
let interval = null;
let isFinished = false;
let keydownHandledChar = null;
let backspaceFromKeydown = false;

function debugLog(eventName, detail) {
    if (!DEBUG) return;
    const payload = {
        event: eventName,
        index: currentIndex,
        expected: currentText[currentIndex] ?? null,
        keystrokes: totalKeystrokes,
        mistakes,
        finished: isFinished,
        ...detail
    };
    console.debug("[staging]", payload);
    debugPanel.textContent = JSON.stringify(payload, null, 2);
}

BOOKS.forEach((book) => {
    const group = document.createElement("optgroup");
    group.label = book.label;
    LESSONS.forEach((lesson, index) => {
        if (lesson.book !== book.id) return;
        const option = document.createElement("option");
        option.value = String(index);
        option.textContent = lesson.title;
        group.appendChild(option);
    });
    lessonSelect.appendChild(group);
});

function bookLabel(bookId) {
    const book = BOOKS.find((item) => item.id === bookId);
    return book ? book.label : "";
}

function initLesson(index) {
    const lesson = LESSONS[Number(index)];
    if (!lesson) return;

    currentText = lesson.text;
    currentIndex = 0;
    statuses = Array(currentText.length).fill(null);
    totalKeystrokes = 0;
    mistakes = 0;
    startTime = null;
    isFinished = false;
    keydownHandledChar = null;
    clearInterval(interval);
    interval = null;
    typingInput.value = "";

    lessonSelect.value = String(index);
    nextBtn.disabled = Number(index) >= LESSONS.length - 1;
    metaBook.textContent = bookLabel(lesson.book);
    metaTitle.textContent = lesson.title;
    metaLength.textContent = lesson.text.length + " znaků";
    showStartOverlay();
    updateStats();
    renderText();
    liveStatus.textContent = "Lekce připravena. " + bookLabel(lesson.book) + ". " + lesson.title;
    debugLog("init", { title: lesson.title, length: currentText.length });
}

function renderText() {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < currentText.length; i++) {
        const span = document.createElement("span");
        const character = currentText[i];
        span.textContent = character;
        span.className = "char";
        if (character === " ") span.classList.add("space");
        if (statuses[i] === "correct") span.classList.add("correct");
        if (statuses[i] === "incorrect") span.classList.add("incorrect");
        if (i === currentIndex && !isFinished) span.classList.add("current");
        fragment.appendChild(span);
    }

    textContainer.replaceChildren(fragment);

    const current = textContainer.querySelector(".current");
    if (current) {
        current.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
}

function updateStats() {
    const progress = currentText.length === 0 ? 0 : (currentIndex / currentText.length) * 100;
    const progressValue = Math.floor(progress);
    progDisplay.textContent = String(progressValue);
    progressFill.style.width = progress + "%";
    progressTrack.setAttribute("aria-valuenow", String(progressValue));

    const accuracy = totalKeystrokes === 0
        ? 100
        : ((totalKeystrokes - mistakes) / totalKeystrokes) * 100;
    accDisplay.textContent = accuracy.toFixed(1);

    const correctCount = statuses.reduce((count, status) => count + (status === "correct" ? 1 : 0), 0);
    let wpm = 0;
    if (startTime && correctCount > 0) {
        const minutes = (Date.now() - startTime) / 60000;
        wpm = minutes > 0 ? Math.floor((correctCount / 5) / minutes) : 0;
    }
    wpmDisplay.textContent = String(wpm);
    return { wpm, accuracy };
}

function ensureTimer() {
    if (startTime) return;
    startTime = Date.now();
    interval = setInterval(updateStats, 1000);
    debugLog("timer-start");
}

function finishLesson() {
    if (isFinished) return;
    isFinished = true;
    clearInterval(interval);
    interval = null;
    const stats = updateStats();
    const summary = "Hotovo. " + stats.wpm + " slov za minutu, přesnost " + stats.accuracy.toFixed(1) + " procent. Enter opakuje lekci, další lekce pokračuje dál.";
    overlay.textContent = "Hotovo. " + stats.wpm + " slov za minutu, přesnost " + stats.accuracy.toFixed(1) + " %. Enter opakuje lekci, tlačítko Další lekce pokračuje.";
    overlay.classList.remove("hidden");
    overlay.classList.add("overlay-done");
    typingArea.classList.remove("is-active");
    liveStatus.textContent = summary;
    renderText();
    debugLog("finish", stats);
}

function typeChar(character) {
    if (isFinished || currentIndex >= currentText.length) return;
    ensureTimer();
    totalKeystrokes += 1;

    if (character === currentText[currentIndex]) {
        statuses[currentIndex] = "correct";
    } else {
        statuses[currentIndex] = "incorrect";
        mistakes += 1;
    }

    currentIndex += 1;
    debugLog("type", { character });

    if (currentIndex >= currentText.length) {
        finishLesson();
        return;
    }

    updateStats();
    renderText();
}

function typeString(value) {
    for (const character of value) {
        typeChar(character);
        if (isFinished) break;
    }
}

function backspace() {
    if (isFinished || currentIndex === 0) return;
    ensureTimer();
    currentIndex -= 1;
    statuses[currentIndex] = null;
    debugLog("backspace");
    updateStats();
    renderText();
}

function showStartOverlay() {
    overlay.textContent = "Klikněte sem nebo stiskněte Enter a začněte psát";
    overlay.classList.remove("hidden", "overlay-done");
    typingArea.classList.remove("is-active");
}

function focusTyping() {
    typingInput.focus();
    if (!isFinished && document.activeElement === typingInput) {
        overlay.classList.add("hidden");
        typingArea.classList.add("is-active");
    }
}

typingInput.addEventListener("keydown", (event) => {
    if (event.key === " ") event.preventDefault();
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (isFinished) return;

    if (event.key === "Backspace") {
        event.preventDefault();
        backspaceFromKeydown = true;
        backspace();
        setTimeout(() => {
            backspaceFromKeydown = false;
        }, 0);
        return;
    }

    if (event.key === "Dead" || event.key === "Process" || event.isComposing) return;
    if (event.key.length !== 1) return;

    event.preventDefault();
    keydownHandledChar = event.key;
    typeChar(event.key);
});

typingInput.addEventListener("beforeinput", (event) => {
    if (event.inputType !== "deleteContentBackward") return;
    event.preventDefault();
    if (backspaceFromKeydown || isFinished) return;
    backspace();
});

typingInput.addEventListener("input", () => {
    const value = typingInput.value;
    typingInput.value = "";
    if (!value || isFinished) return;
    if (keydownHandledChar && value === keydownHandledChar) {
        keydownHandledChar = null;
        return;
    }
    keydownHandledChar = null;
    typeString(value);
});

typingInput.addEventListener("focus", () => {
    if (isFinished) return;
    overlay.classList.add("hidden");
    typingArea.classList.add("is-active");
});

typingInput.addEventListener("blur", () => {
    if (!isFinished) showStartOverlay();
});

overlay.addEventListener("click", () => {
    if (isFinished) {
        initLesson(lessonSelect.value);
    }
    focusTyping();
});

typingArea.addEventListener("click", (event) => {
    if (event.target === overlay) return;
    focusTyping();
});

lessonSelect.addEventListener("change", (event) => {
    initLesson(event.target.value);
    focusTyping();
});

resetBtn.addEventListener("click", () => {
    initLesson(lessonSelect.value);
    focusTyping();
});

nextBtn.addEventListener("click", () => {
    const nextIndex = Number(lessonSelect.value) + 1;
    if (nextIndex >= LESSONS.length) return;
    initLesson(nextIndex);
    focusTyping();
});

if (DEBUG) {
    debugPanel.classList.remove("hidden");
    debugLog("debug-on");
}

initLesson(0);
