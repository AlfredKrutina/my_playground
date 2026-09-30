const DEBUG = new URLSearchParams(location.search).has("debug");
const ADVANCE_MS = 1200;
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const dark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(dark));
    themeToggle.setAttribute("aria-label", dark ? "Přepnout na světlý režim" : "Přepnout na tmavý režim");
}

applyTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
});

if (!localStorage.getItem("theme")) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
        if (localStorage.getItem("theme")) return;
        applyTheme(event.matches ? "dark" : "light");
    });
}

const authorSelect = document.getElementById("authorSelect");
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
const skipBtn = document.getElementById("skipBtn");
const metaBook = document.getElementById("metaBook");
const metaTitle = document.getElementById("metaTitle");
const metaLength = document.getElementById("metaLength");
const chapterList = document.getElementById("chapterList");
const liveStatus = document.getElementById("liveStatus");
const debugPanel = document.getElementById("debugPanel");

let authorIndex = 0;
let chapterIndex = 0;
let currentText = "";
let currentIndex = 0;
let statuses = [];
let totalKeystrokes = 0;
let mistakes = 0;
let startTime = null;
let interval = null;
let phase = "ready";
let keydownHandledChar = null;
let backspaceFromKeydown = false;
let advanceTimer = null;
let pendingNext = null;

function debugLog(eventName, detail) {
    if (!DEBUG) return;
    const payload = {
        event: eventName,
        author: BOOKS[authorIndex] && BOOKS[authorIndex].id,
        chapter: chapterIndex,
        phase,
        index: currentIndex,
        expected: currentText[currentIndex] ?? null,
        keystrokes: totalKeystrokes,
        mistakes,
        ...detail
    };
    console.debug("[staging]", payload);
    debugPanel.textContent = JSON.stringify(payload, null, 2);
}

function lessonsFor(bookId) {
    return LESSONS.filter((lesson) => lesson.book === bookId);
}

function currentLesson() {
    return lessonsFor(BOOKS[authorIndex].id)[chapterIndex];
}

function nextPosition() {
    const chapters = lessonsFor(BOOKS[authorIndex].id);
    if (chapterIndex + 1 < chapters.length) {
        return { authorIndex, chapterIndex: chapterIndex + 1, authorChanged: false };
    }
    if (authorIndex + 1 < BOOKS.length) {
        return { authorIndex: authorIndex + 1, chapterIndex: 0, authorChanged: true };
    }
    return null;
}

BOOKS.forEach((book, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = book.label;
    authorSelect.appendChild(option);
});

function cancelAdvance() {
    clearTimeout(advanceTimer);
    advanceTimer = null;
    pendingNext = null;
}

function renderChapters() {
    const chapters = lessonsFor(BOOKS[authorIndex].id);
    chapterList.replaceChildren();
    chapters.forEach((lesson, index) => {
        const item = document.createElement("li");
        item.textContent = String(index + 1);
        item.title = lesson.title;
        if (index < chapterIndex) item.classList.add("is-done");
        if (index === chapterIndex && phase !== "done") item.classList.add("is-current");
        if (index === chapterIndex && phase === "done") item.classList.add("is-done");
        chapterList.appendChild(item);
    });
}

function loadChapter(nextAuthor, nextChapter, mode) {
    cancelAdvance();
    authorIndex = nextAuthor;
    chapterIndex = nextChapter;
    const lesson = currentLesson();

    currentText = lesson.text;
    currentIndex = 0;
    statuses = Array(currentText.length).fill(null);
    totalKeystrokes = 0;
    mistakes = 0;
    startTime = null;
    keydownHandledChar = null;
    clearInterval(interval);
    interval = null;
    typingInput.value = "";
    phase = mode === "continue" ? "typing" : "ready";

    authorSelect.value = String(authorIndex);
    skipBtn.disabled = !nextPosition();
    metaBook.textContent = BOOKS[authorIndex].label;
    metaTitle.textContent = "Kapitola " + (chapterIndex + 1) + "/" + lessonsFor(BOOKS[authorIndex].id).length + " · " + lesson.title;
    metaLength.textContent = lesson.text.length + " znaků";
    renderChapters();
    updateStats();
    renderText();
    liveStatus.textContent = "Kapitola připravena. " + BOOKS[authorIndex].label + ". " + lesson.title;

    if (mode === "continue") {
        overlay.classList.add("hidden");
        overlay.classList.remove("overlay-done");
        typingArea.classList.add("is-active");
        typingInput.focus();
    } else {
        showStartOverlay();
    }

    debugLog("load", { mode, title: lesson.title });
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
        if (i === currentIndex && phase === "typing") span.classList.add("current");
        fragment.appendChild(span);
    }

    textContainer.replaceChildren(fragment);

    const current = textContainer.querySelector(".current");
    if (current) current.scrollIntoView({ block: "nearest", inline: "nearest" });
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

function showAdvanceOverlay(stats, upcoming) {
    const score = stats.wpm + " slov za minutu, přesnost " + stats.accuracy.toFixed(1) + " %.";
    const nextLabel = upcoming.authorChanged
        ? "Následuje " + BOOKS[upcoming.authorIndex].label + "."
        : "Následuje kapitola: " + lessonsFor(BOOKS[upcoming.authorIndex].id)[upcoming.chapterIndex].title + ".";
    overlay.textContent = "Kapitola hotová. " + score + " " + nextLabel;
    overlay.classList.remove("hidden");
    overlay.classList.add("overlay-done");
    typingArea.classList.remove("is-active");
    liveStatus.textContent = overlay.textContent;
}

function finishChapter() {
    if (phase !== "typing") return;
    clearInterval(interval);
    interval = null;
    const stats = updateStats();
    renderText();
    const upcoming = nextPosition();
    debugLog("finish", stats);

    if (!upcoming) {
        phase = "done";
        skipBtn.disabled = true;
        renderChapters();
        overlay.textContent = "Všech osm autorů je hotových. Klepnutím začnete znovu od začátku.";
        overlay.classList.remove("hidden");
        overlay.classList.add("overlay-done");
        typingArea.classList.remove("is-active");
        liveStatus.textContent = overlay.textContent;
        return;
    }

    phase = "advance";
    pendingNext = upcoming;
    showAdvanceOverlay(stats, upcoming);
    advanceTimer = setTimeout(() => {
        loadChapter(upcoming.authorIndex, upcoming.chapterIndex, "continue");
    }, ADVANCE_MS);
}

function typeChar(character) {
    if (phase === "advance") {
        const upcoming = pendingNext;
        if (!upcoming) return;
        loadChapter(upcoming.authorIndex, upcoming.chapterIndex, "continue");
    }
    if (phase !== "typing" || currentIndex >= currentText.length) return;

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
        finishChapter();
        return;
    }

    updateStats();
    renderText();
}

function typeString(value) {
    for (const character of value) {
        typeChar(character);
        if (phase !== "typing") break;
    }
}

function backspace() {
    if (phase !== "typing" || currentIndex === 0) return;
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
    if (phase === "done") return;
    if (phase === "advance") return;
    typingInput.focus();
    if (document.activeElement === typingInput) {
        phase = "typing";
        overlay.classList.add("hidden");
        typingArea.classList.add("is-active");
    }
}

typingInput.addEventListener("keydown", (event) => {
    if (event.key === " ") event.preventDefault();
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (phase === "done" || phase === "ready") return;

    if (event.key === "Backspace") {
        event.preventDefault();
        if (phase !== "typing") return;
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
    if (backspaceFromKeydown || phase !== "typing") return;
    backspace();
});

typingInput.addEventListener("input", () => {
    const value = typingInput.value;
    typingInput.value = "";
    if (!value || phase === "done" || phase === "ready") return;
    if (keydownHandledChar && value === keydownHandledChar) {
        keydownHandledChar = null;
        return;
    }
    keydownHandledChar = null;
    typeString(value);
});

typingInput.addEventListener("focus", () => {
    if (phase === "advance" || phase === "done") return;
    phase = "typing";
    overlay.classList.add("hidden");
    typingArea.classList.add("is-active");
});

typingInput.addEventListener("blur", () => {
    if (phase === "typing") {
        phase = "ready";
        showStartOverlay();
    }
});

overlay.addEventListener("click", () => {
    if (phase === "done") {
        loadChapter(0, 0, "ready");
        focusTyping();
        return;
    }
    if (phase === "advance" && pendingNext) {
        loadChapter(pendingNext.authorIndex, pendingNext.chapterIndex, "continue");
        return;
    }
    focusTyping();
});

typingArea.addEventListener("click", (event) => {
    if (event.target === overlay) return;
    focusTyping();
});

authorSelect.addEventListener("change", (event) => {
    loadChapter(Number(event.target.value), 0, "ready");
    focusTyping();
});

resetBtn.addEventListener("click", () => {
    loadChapter(authorIndex, chapterIndex, "ready");
    focusTyping();
});

skipBtn.addEventListener("click", () => {
    const upcoming = phase === "advance" && pendingNext ? pendingNext : nextPosition();
    if (!upcoming) return;
    loadChapter(upcoming.authorIndex, upcoming.chapterIndex, "continue");
});

if (DEBUG) {
    debugPanel.classList.remove("hidden");
    debugLog("debug-on");
}

loadChapter(0, 0, "ready");
