let allCards = [];
let cards = [];
let studyDeck = [];
let currentCard = null;

let correctCount = 0;
let missedCount = 0;

async function loadCards() {

    const response = await fetch("vocab.json");

    allCards = await response.json();

    populateChapterList();

    startSession();
}
function populateChapterList() {

    const select =
        document.getElementById("chapterSelect");

    const chapters =
        [...new Set(allCards.map(card => card.chapter))]
            .sort((a, b) => a - b);

    chapters.forEach(chapter => {

        const option =
            document.createElement("option");

        option.value = chapter;

        option.textContent =
            `Chapter ${chapter}`;

        select.appendChild(option);
    });
}

function startSession() {

    const selectedChapter =
        document.getElementById("chapterSelect").value;

    if (selectedChapter === "all") {

        cards = [...allCards];

    } else {

        cards = allCards.filter(card =>
            card.chapter === Number(selectedChapter)
        );
    }

    studyDeck = [...cards];

    shuffle(studyDeck);

    correctCount = 0;
    missedCount = 0;

    updateStats();

    nextCard();
}


function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateStats() {

    const attempts = correctCount + missedCount;

    const accuracy =
        attempts === 0
            ? 0
            : Math.round((correctCount / attempts) * 100);

    document.getElementById("stats").textContent =
        `Correct: ${correctCount} | Missed: ${missedCount} | Accuracy: ${accuracy}%`;
}

function showCard() {

    document.getElementById("greekWord").textContent =
        currentCard.greek;

    document.getElementById("definition").textContent =
        currentCard.english;

    document.getElementById("definition").style.display =
        "none";

    document.getElementById("remaining").textContent =
        `${studyDeck.length + 1} cards remaining`;
}

function nextCard() {

    if (studyDeck.length === 0) {

        document.getElementById("greekWord").textContent =
            "Finished!";

        document.getElementById("definition").textContent =
            "";

        document.getElementById("remaining").textContent =
            "All cards answered correctly.";

        return;
    }

    currentCard = studyDeck.shift();

    showCard();
}

function showAnswer() {

    document.getElementById("definition").style.display =
        "block";
}

function knewIt() {

    correctCount++;

    updateStats();

    nextCard();
}

function missedIt() {

    missedCount++;

    updateStats();

    studyDeck.push(currentCard);

    nextCard();
}

loadCards();