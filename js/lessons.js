const BOOKS = [
    { id: "orwell", label: "George Orwell: Farma zvířat" },
    { id: "clarke", label: "Arthur C. Clarke: 2001: Vesmírná odysea" },
    { id: "pavel", label: "Ota Pavel: Smrt krásných srnců" },
    { id: "nebe", label: "Svěrák a Smoljak: České nebe" },
    { id: "goldoni", label: "Carlo Goldoni: Sluha dvou pánů" },
    { id: "king", label: "Stephen King: Zelená míle" },
    { id: "hemingway", label: "Ernest Hemingway: Stařec a moře" },
    { id: "polacek", label: "Karel Poláček: Bylo nás pět" }
];

const LESSONS = [
    {
        book: "orwell",
        title: "Autor a doba vzniku",
        text: "George Orwell, vlastním jménem Eric Arthur Blair, patří ke světové literatuře 20. století. Farma zvířat vyšla roku 1945, krátce po druhé světové válce, jako reakce na Stalinův Sovětský svaz a na širší vzestup totalitních režimů. Nejde o zprávu z jedné farmy, ale o rozbor toho, jak se heslo rovnosti může změnit v diktaturu."
    },
    {
        book: "orwell",
        title: "Žánr a literární druh",
        text: "Farma zvířat je epika napsaná prózou. Žánrově je to alegorická antiutopická novela, politická satira a moderní bajka. Starší bajka učila mrav na zvířatech. Orwell tuto formu obrací k historické zkušenosti dvacátého století: prasata jsou vládnoucí vrstva, která si revoluční ideály přivlastní a ostatní udrží ve strachu i v nevědomosti."
    },
    {
        book: "orwell",
        title: "Alegorie stalinského režimu",
        text: "Postavy mají historické předobrazy. Starý Major shrnuje teoretika revoluce, spojovaného s Marxem a Leninem. Napoleon odpovídá Stalinovi, Kuliš Trockému a Pištík státní propagandě. Boxer je pracující lid: obětavý, výkonný a poslušný. Benjamin je pasivní intelektuál, který úpadek chápe, ale nejedná. Alegorie tak čte ruské dějiny jako varování."
    },
    {
        book: "orwell",
        title: "Jazyk moci a antiutopie",
        text: "Sedm přikázání se postupně přepisuje, až z rovnosti zbude věta, že všichni jsou si rovni, ale někteří jsou si rovnější. Orwell ukazuje, jak totalitní moc legalizuje bezpráví jazykem a jak propaganda nutí zvířata, aby nevěřila vlastní paměti. Ve stejné linii stojí Huxleyho Konec civilizace, Bradburyho 451 stupňů Fahrenheita, Zamjatinovo My a Čapkova Válka s Mloky."
    },
    {
        book: "clarke",
        title: "Vznik v době vesmírných závodů",
        text: "Arthur C. Clarke je britský autor hard science fiction. Román 2001: Vesmírná odysea vyšel roku 1968, v době vesmírných závodů, a vznikal souběžně s filmem Stanleyho Kubricka. Vychází ze starší povídky Hlídka. Clarke spojuje technickou věrohodnost doby, která právě mířila na Měsíc, s otázkou, zda člověka určuje jen jeho biologie."
    },
    {
        book: "clarke",
        title: "Hard sci-fi jako žánr",
        text: "Kniha je epická próza, vědeckofantastický román typu hard sci-fi. Od volné fantastiky se liší tím, že loď Discovery, měsíční nález i umělá inteligence mají působit jako důsledek reálného vědeckého vývoje. Filozofický závěr tento rámec neruší. Evoluce v něm pokračuje dál než k nástroji a k počítači, až k nové podobě člověka."
    },
    {
        book: "clarke",
        title: "Monolity a vývoj lidstva",
        text: "Monolity zasahují do děje od pravěku po transhumanismus. První přivede lidoopa k nástroji a ke zbrani, další stojí za měsíčním nálezem TMA-1 a za cestou Discovery. V science fiction šedesátých let to není jen záhada pro napětí. Je to dobová představa, že lidstvo může být článkem delšího vývoje, který neřídí samo a kterému nerozumí."
    },
    {
        book: "clarke",
        title: "HAL a současná sci-fi",
        text: "Počítač HAL 9000 má být pravdomluvný, a přitom musí před posádkou tajit skutečný cíl mise. Z tohoto rozporu vznikne porucha a konflikt s lidmi. Dave Bowman jako jediný přežije a po průchodu bránou se stane Hvězdným dítětem. Podobné otázky vztahu člověka, stroje a neznáma kladou Asimov v Já, robot, Bradbury v Marťanské kronice, Heinlein v románu Měsíc je zlá milenka a Lem v Solarisu."
    },
    {
        book: "pavel",
        title: "Místo v české poválečné próze",
        text: "Ota Pavel, vlastním jménem Otto Popper, patří do české literatury druhé poloviny 20. století. Smrt krásných srnců vyšla roku 1971 jako soubor autobiografických povídek. Není to učebnicový román o válce. Je to vzpomínka na dětství židovské rodiny, do kterého vstupuje nacistická perzekuce, transport a hrozba holokaustu."
    },
    {
        book: "pavel",
        title: "Vzpomínková próza",
        text: "Žánrově jde o vzpomínkovou prózu, ne o jednolitý román. Jednotlivé povídky drží pohromadě rodina, řeka a vypravěč. Tato mozaika odpovídá tomu, jak se v české literatuře vracela osobní zkušenost války: ne jako přehled tažení, ale jako konkrétní osud. Epika tu zůstává prózou, jen je složená z obrazů místo z jedné přímé zápletky."
    },
    {
        book: "pavel",
        title: "Idyla proti transportu",
        text: "Lyrické obrazy Berounky a rybaření jsou útočištěm a zdrojem síly. V titulní povídce mají starší synové nastoupit do transportu. Tatínek Leo Popper proto přes hrozící trest uloví s pomocí psa Holana srnce, aby jim dal maso a důstojnost. Lov není myslivecká historka. V dobovém kontextu je to pokus nedovolit hladu a násilí, aby rodinu připravily o budoucnost."
    },
    {
        book: "pavel",
        title: "Tragikomika a současníci",
        text: "Humor, hovorový jazyk a lyrický popis přírody stojí vedle nacistického násilí. Z toho vzniká tragikomický účinek: radost z řeky nezakrývá transport, ale dělá ho bolestnějším. Blízké prózy o protektorátu jsou Hrabalovy Ostře sledované vlaky, Fuksův Spalovač mrtvol, Otčenáškův Romeo, Julie a tma a Lustigova Modlitba pro Kateřinu Horovitzovou. Pavel je z nich nejvíc rodinný."
    },
    {
        book: "nebe",
        title: "Drama a národní paměť",
        text: "České nebe Zdeňka Svěráka a Ladislava Smoljaka je hra z roku 2008, spjatá s Divadlem Járy Cimrmana. Patří k modernímu českému dramatu, ale látkou se vrací ke starší národní paměti: k první světové válce, ke krizi Rakouska-Uherska a k postavám, ze kterých škola dělá nedotknutelné velikány. Satira tu nemíří mimo dějiny, míří do způsobu, jakým si je národ vypráví."
    },
    {
        book: "nebe",
        title: "Mystifikace jako metoda",
        text: "Hra je satirická komedie a pseudohistorické drama. Cimrmanovské představení má dvě části. Nejprve seminář, který fiktivního Járu Cimrmana představuje jako skutečného génia, potom samotná jednoaktovka. Mystifikace je literární metoda. Národní mýtus se nepopírá heslem, ale tím, že se hraje s vážnou tváří a divák sám pozná, kde velikost přechází v lidskou slabost."
    },
    {
        book: "nebe",
        title: "Nebeská komise",
        text: "V českém nebi za první světové války zasedají Komenský, svatý Václav, Hus, Němcová, Havlíček, praotec Čech, maršál Radecký i Babička. Nejsou pomník. Jsou lidé, na nichž hra ukazuje rysy přičítané české povaze: chytračení, alibismus, humor a zároveň vlastenectví. Historický okamžik rozpadu monarchie slouží k tomu, aby se tyto rysy ukázaly při rozhodování o osudu národa."
    },
    {
        book: "nebe",
        title: "Jazyk a české drama",
        text: "Jazyk je kultivovaný a místy archaizující. Komika stojí na slovní hříčce, na citaci dokumentů a básní a na kontrastu vznešené postavy s obyčejnou lidskou slabostí. V moderním českém divadle vedle toho stojí Havlova Audience, Suchého Kytice a tvorba Ivana Vyskočila a Milana Uhdeho. České nebe je z této společnosti nejvíc obrácené ke školním obrazům národních dějin."
    },
    {
        book: "goldoni",
        title: "Osvícenské divadlo",
        text: "Carlo Goldoni je italský dramatik 18. století. Sluha dvou pánů z roku 1746 vzniká v osvícenství, které chce divadlo přiblížit pozorovatelnému životu, ne jen opakovaným masopustním typům. Komedie o hladovém sluhovi je proto zároveň zábavná hra a příspěvek k reformě italského divadla. Literární druh je drama a základní formou je pevně napsaný dialog."
    },
    {
        book: "goldoni",
        title: "Reforma commedie dell'arte",
        text: "Starší commedia dell'arte stavěla na improvizaci, na maskách a na pevných typech. Goldoni ponechává živost, záměny a postavu sluhy, ale hercům dává zapsané repliky a postavám zřetelnější psychologii. Truffaldino už není jen maska z Bergama. Je to člověk, který se nechá najmout dvěma pány, protože chce dva platy a dvě porce jídla."
    },
    {
        book: "goldoni",
        title: "Intrika a měšťanská komedie",
        text: "Beatrice se vydává za údajně mrtvého bratra Federica Rasponiho a Florindo utíká před spravedlností. Skrývání identity žene dopisy, zavazadla i dohodnuté sňatky do omylů, až se zamilované dvojice šťastně sejdou. V dobovém kontextu to není jen řetěz vtipů. Goldoni z commedie dělá komedii mravů: o vychytralosti, o penězích a o tom, jak se city střetávají s majetkem."
    },
    {
        book: "goldoni",
        title: "Tři jednání a evropský kontext",
        text: "Hra má tři jednání, svižný dialog a promluvy stranou k publiku. Situační komika zůstává, ale je zapsaná, takže se dá opakovat a číst jako literatura, ne jen jako jednorázová improvizace. Goldoni navazuje na francouzskou charakterovou komedii 17. století a časově stojí blízko osvícenské satiry, jak ji představuje Voltairův Candide."
    },
    {
        book: "king",
        title: "Konec století a rok 1932",
        text: "Stephen King vydal Zelenou míli roku 1996 nejprve na pokračování. Patří k americké literatuře konce 20. století, ale děj vrací do roku 1932, do bloku smrti ve věznici Cold Mountain. Posun v čase není kulisa. Umožňuje mluvit o trestu smrti a o rasismu Jihu v době, kdy se právní rozsudek a společenský předsudek daly jen těžko oddělit."
    },
    {
        book: "king",
        title: "Žánr mezi thrillerem a zázrakem",
        text: "Kniha je epická próza. Spojuje vězeňské drama, psychologický thriller a magický realismus: do krutě realistického vězení vstupuje dar Johna Coffeyho, který přejímá bolest a nemoc druhých. King tu opouští pouhý horor. Nadpřirozeno neslouží k leknutí, ale jako morální zkouška lidí, kteří mají vykonat trest na nevinném."
    },
    {
        book: "king",
        title: "Zákon, rasismus a svědomí",
        text: "John Coffey je odsouzen za vraždu dvou dívek, ačkoli je nevinný. Sadistický dozorce Percy a vrah Wild Bill ukazují, že surovost může stát na straně zákona i mimo něj. Paul Edgecomb vede blok smrti a musí volit mezi rozsudkem a svědomím. V kontextu amerického Jihu je to kritika systému, v němž je legální trest oddělený od spravedlnosti."
    },
    {
        book: "king",
        title: "Retrospektiva a vina",
        text: "Starý Paul vypráví příběh z roku 1932 až po mnoha letech. Kompozice je proto rámcová a retrospektivní. Odstup neoslabuje vinu, naopak ukazuje, že vykonaný trest zůstává v člověku dál. King tím stojí v americké próze o násilí a svědomí vedle thrilleru i vedle pozdějších knih, které se ptají, kdo nese odpovědnost za cizí smrt."
    },
    {
        book: "hemingway",
        title: "Pozdní dílo ztracené generace",
        text: "Ernest Hemingway patří k americké ztracené generaci, která po první světové válce psala o ztrátě starých jistot. Stařec a moře je ale pozdní novela z roku 1952, zasazená na Kubu, ne text dvacátých let. Roku 1953 za ni dostal Pulitzerovu cenu a roku 1954 Nobelovu cenu za literaturu. Z úsporného stylu své generace přesto vychází."
    },
    {
        book: "hemingway",
        title: "Alegorická novela",
        text: "Žánrově jde o alegorickou novelu, tedy o epiku v próze. Povrch je prostý. Rybář Santiago po čtyřiaosmdesáti dnech bez úlovku dva dny zápasí s obrovským marlinem a cestou zpět mu kořist sežerou žraloci. Zůstane kostra. Alegorie začíná tam, kde rybolov přestává být jen lovem a stává se výpovědí o důstojnosti. Člověka je možné zničit, ale ne porazit."
    },
    {
        book: "hemingway",
        title: "Teorie ledovce",
        text: "Teorie ledovce znamená, že text ukáže jen malou část významu a zbytek nechá pod hladinou. Krátké věty, věcný jazyk a přímá chronologie proto nejsou chudoba stylu. Jsou to prostředek, který odmítá vysvětlující komentář. Pod příběhem zůstává stoicismus, samota, respekt k soupeři a náznak Kristova utrpení: krvácející ruce a nesení stěžně."
    },
    {
        book: "hemingway",
        title: "Hodnoty a američtí modernisté",
        text: "Santiago nese nezlomnost a pokoru, chlapec Manolin mezigenerační naději, marlin rovnocenného soupeře a žraloci ničivou sílu okolí. V americké próze první poloviny století vedle Hemingwaye stojí Fitzgeraldův Velký Gatsby, Steinbeckovo O myších a lidech a William Faulkner. Stařec a moře je z těchto knih nejúspornější: rozhodující zápas se odehrává mimo město, mezi člověkem a mořem."
    },
    {
        book: "polacek",
        title: "Demokratický proud a rok 1943",
        text: "Karel Poláček patří k české meziválečné literatuře a k jejímu demokratickému proudu. Bylo nás pět napsal roku 1943 a kniha vyšla posmrtně roku 1946. Není to idyla z bezpečného odstupu. Vzniká ve chvíli, kdy je autor pro židovský původ deportován, a vrací se v ní do dětství v Rychnově nad Kněžnou. Veselý tón má proto tragické historické pozadí."
    },
    {
        book: "polacek",
        title: "Epizodický humoristický román",
        text: "Žánrově jde o humoristický román s autobiografickými rysy, epiku v próze. Kompozice je epizodická. Parta prožije hru na paliče a hasiče, školní vysvědčení i záchranu továrníkova syna Otakárka u řeky. Tyto klukoviny se čtou jinak, jakmile víme, že svět, z něhož se vypráví, měla válka zničit. Humor tu není únik od dějin, ale způsob, jak vedle nich obstát."
    },
    {
        book: "polacek",
        title: "Dětská ich-forma",
        text: "Petr Bajza, syn kupce s koloniálním zbožím, vypráví v ich-formě a vidí jen to, čemu rozumí kluk. Partu tvoří Antonín Bejval, Čeněk Jirsák, Eda Kemlink a Pepek Zilvar z chudobince. Dětská perspektiva je nástroj, ne nedostatek. Naivita odhalí maloměstské pokrytectví, přehnanou vážnost a pravidla dospělých, aniž by vypravěč moralizoval. Smích vzniká z omezeného, ale přesného pohledu."
    },
    {
        book: "polacek",
        title: "Jazyk a humoristický román",
        text: "Komika stojí na střetu knižního slohu se slovy jako pravil nebo jelikož a klukovského slangu s nářečím. Vznešená věta popisuje obyčejnou klukovinu. Poláček tím patří do linie českého humoristického románu: od Haškova Švejka přes Čapkovu Válku s Mloky a Bassovu Klapzubovu jedenáctku až k Jirotkovu Saturninovi. U něj je smích nejtěsněji svázaný s dětskou řečí a se zánikem toho světa."
    }
];
