// --- 1. IMPORT GAME DATA ---
import { GAME_DATA } from './players.js';
// NEW: Import the archetype database
import { ARCHETYPES } from './player_archetypes.js';

// --- 2. GAME CONSTANTS & STATE ---
const POSITIONS = ["PG", "SG", "SF", "PF", "C"];
const ELIMINATION_ROUNDS = [3, 3, 2]; // Open 3, then 3, then 2

// Game State Variables
let currentPositionIndex = 0;
let cases = []; 
let caseStatus = [];
let playerCaseIndex = -1;
let eliminationsThisRound = 0;
let currentEliminationRound = 0;
let finalTeam = { PG: null, SG: null, SF: null, PF: null, C: null };
let gameState = "PICK_POSITION"; // "PICK_CASE", "ELIMINATE", "BANKER_OFFER", "FINAL_CHOICE", "GAME_OVER"
let currentBankerOffer = null;

// --- 3. DOM ELEMENT REFERENCES ---
const statusMessage = document.getElementById("status-message");
const caseGrid = document.getElementById("case-grid");
const playerBoard = document.getElementById("player-board");
const playerBoardContainer = document.getElementById("player-board-container"); // NEW
const offerModal = document.getElementById("offer-modal");
const offerPlayerName = document.getElementById("offer-player-name");
const dealButton = document.getElementById("deal-button");
const noDealButton = document.getElementById("no-deal-button");
const resetButton = document.getElementById("reset-button");
const resetButtonContainer = document.getElementById("reset-button-container"); // NEW

// Switch Modal References
const switchModal = document.getElementById("switch-modal");
const yourCaseNumber = document.getElementById("your-case-number");
const otherCaseNumber = document.getElementById("other-case-number");
const switchButton = document.getElementById("switch-button");
const keepButton = document.getElementById("keep-button");

// NEW Report Card References
const seasonReport = document.getElementById("season-report");
const reportRecord = document.getElementById("report-record");
const reportGrade = document.getElementById("report-grade");
const reportStrengths = document.getElementById("report-strengths");
const reportWeaknesses = document.getElementById("report-weaknesses");


// --- 4. CORE GAME FUNCTIONS ---

/**
 * Initializes the entire game or resets it
 */
function initGame() {
    currentPositionIndex = 0;
    finalTeam = { PG: null, SG: null, SF: null, PF: null, C: null };
    updateTeamRosterUI();
    
    // Hide modals
    offerModal.classList.add("hidden");
    switchModal.classList.add("hidden");

    // NEW: Hide report card and show game elements
    seasonReport.classList.add("hidden");
    caseGrid.classList.remove("hidden");
    playerBoardContainer.classList.remove("hidden");
    resetButtonContainer.classList.remove("hidden"); // Show reset button
    
    startPositionRound();
}

/**
 * Sets up a new round for the next position
 */
function startPositionRound() {
    if (currentPositionIndex >= POSITIONS.length) {
        endGame();
        return;
    }

    // Reset round-specific state
    cases = [];
    caseStatus = new Array(10).fill("closed");
    playerCaseIndex = -1;
    eliminationsThisRound = 0;
    currentEliminationRound = 0;
    gameState = "PICK_CASE";
    
    const currentPosition = POSITIONS[currentPositionIndex];
    statusMessage.textContent = `Pick your case for ${currentPosition}`;

    // Get the *pool* of players for this position
    const playerPool = GAME_DATA[currentPosition];
    
    // Build the "super pools" based on tiers
    const greatPlayers = []; // 8-10
    const midPlayers = [];   // 4-7
    const badPlayers = [];   // 1-3

    for (let value = 10; value >= 8; value--) {
        if (playerPool[value]) {
            playerPool[value].forEach(name => {
                greatPlayers.push({ name, value });
            });
        }
    }
    for (let value = 7; value >= 4; value--) {
        if (playerPool[value]) {
            playerPool[value].forEach(name => {
                midPlayers.push({ name, value });
            });
        }
    }
    for (let value = 3; value >= 1; value--) {
         if (playerPool[value]) {
            playerPool[value].forEach(name => {
                badPlayers.push({ name, value });
            });
        }
    }

    // Build the 10-player board for this round
    let playersForThisRound = [];

    // Shuffle and pick 3 "great" players
    shuffleArray(greatPlayers);
    playersForThisRound = playersForThisRound.concat(greatPlayers.slice(0, 3));

    // Shuffle and pick 4 "mid" players
    shuffleArray(midPlayers);
    playersForThisRound = playersForThisRound.concat(midPlayers.slice(0, 4));

    // Shuffle and pick 3 "bad" players
    shuffleArray(badPlayers);
    playersForThisRound = playersForThisRound.concat(badPlayers.slice(0, 3));

    // Shuffle them into the cases
    shuffleArray(playersForThisRound);
    cases = playersForThisRound;

    // Render the UI for the new round
    renderPlayerBoard();
    renderCases();
}

/**
 * Main click handler for all cases (uses event delegation)
 */
function handleCaseClick(e) {
    if (gameState === "BANKER_OFFER" || gameState === "FINAL_CHOICE" || gameState === "GAME_OVER") return;

    const clickedCase = e.target.closest('.case-item');
    if (!clickedCase || clickedCase.dataset.index === undefined) return;

    const index = parseInt(clickedCase.dataset.index);

    if (gameState === "PICK_CASE") {
        playerCaseIndex = index;
        caseStatus[index] = "playerCase";
        gameState = "ELIMINATE";
        statusMessage.textContent = `Eliminate ${ELIMINATION_ROUNDS[currentEliminationRound]} cases.`;
        renderCases();
    
    } else if (gameState === "ELIMINATE") {
        if (index === playerCaseIndex || caseStatus[index] === "opened") {
            return;
        }

        caseStatus[index] = "opened";
        eliminationsThisRound++;
        const playerInCase = cases[index];
        
        updatePlayerBoard(playerInCase.name);
        renderCases();

        const elimsNeeded = ELIMINATION_ROUNDS[currentEliminationRound];
        if (eliminationsThisRound === elimsNeeded) {
            gameState = "BANKER_OFFER";
            eliminationsThisRound = 0;
            currentEliminationRound++;
            makeBankerOffer();
        } else {
            statusMessage.textContent = `Eliminate ${elimsNeeded - eliminationsThisRound} more cases.`;
        }
    }
}

/**
 * Calculates and displays the banker's offer
 */
function makeBankerOffer() {
    if (currentEliminationRound > ELIMINATION_ROUNDS.length) {
        const lastCaseIndex = caseStatus.findIndex(s => s === "closed");
        if (lastCaseIndex !== -1) {
            currentBankerOffer = cases[lastCaseIndex];
        } else {
            currentBankerOffer = cases[playerCaseIndex];
        }
        statusMessage.textContent = "Final Offer! Take this player or your case?";
    } else {
        currentBankerOffer = calculateOffer();
        statusMessage.textContent = "Banker's Offer...";
    }
    
    offerPlayerName.textContent = currentBankerOffer.name;
    offerModal.classList.remove("hidden");
}

/**
 * The "AI" for the banker.
 */
function calculateOffer() {
    let remainingValues = [];
    
    for (let i = 0; i < cases.length; i++) {
        if (caseStatus[i] === "closed" || caseStatus[i] === "playerCase") {
            remainingValues.push(cases[i].value);
        }
    }
    const avgValue = remainingValues.length > 0 ? remainingValues.reduce((a, b) => a + b, 0) / remainingValues.length : 0;

    const playerPool = GAME_DATA[POSITIONS[currentPositionIndex]];
    const allPlayersThisPosition = [];
    for (let value = 10; value >= 1; value--) {
        if(playerPool[value]) {
            playerPool[value].forEach(name => {
                allPlayersThisPosition.push({ name, value });
            });
        }
    }

    const openedPlayerNames = [];
    for(let i = 0; i < cases.length; i++) {
        if (caseStatus[i] === 'opened') {
            openedPlayerNames.push(cases[i].name);
        }
    }

    let availableOffers = allPlayersThisPosition.filter(player => {
        return !openedPlayerNames.includes(player.name);
    });

    if (availableOffers.length === 0) {
        availableOffers = cases.filter(player => {
            const openedCaseIndex = cases.findIndex((p, idx) => p.name === player.name && caseStatus[idx] === "opened");
            return openedCaseIndex === -1; 
        });
        
        if (availableOffers.length === 0) {
            return { name: "Failsafe Player", value: 1 };
        }
    }

    return availableOffers.reduce((prev, curr) => {
        return (Math.abs(curr.value - avgValue) < Math.abs(prev.value - avgValue) ? curr : prev);
    });
}

/**
 * Handles the "Deal" button click
 */
function handleDeal() {
    offerModal.classList.add("hidden");
    acceptPlayer(currentBankerOffer);
}

/**
 * Handles the "No Deal" button click
 */
function handleNoDeal() {
    offerModal.classList.add("hidden");

    if (currentEliminationRound > ELIMINATION_ROUNDS.length) {
        promptToSwitch();
    } else {
        gameState = "ELIMINATE";
        const elimsNeeded = ELIMINATION_ROUNDS[currentEliminationRound];
        if (elimsNeeded) {
            statusMessage.textContent = `Eliminate ${elimsNeeded} cases.`;
        } else {
            promptToSwitch();
        }
    }
}

/**
 * NEW: Shows the final switch modal
 */
function promptToSwitch() {
    gameState = "FINAL_CHOICE"; 
    statusMessage.textContent = "Make your final choice...";

    const lastCaseIndex = caseStatus.findIndex(s => s === "closed");

    yourCaseNumber.textContent = `#${playerCaseIndex + 1}`;
    otherCaseNumber.textContent = (lastCaseIndex !== -1) ? `#${lastCaseIndex + 1}` : `#${playerCaseIndex + 1}`; // Failsafe

    switchModal.classList.remove("hidden");
}

/**
 * NEW: Player decides to KEEP their original case
 */
function handleKeepCase() {
    switchModal.classList.add("hidden");
    statusMessage.textContent = `Kept your case! You got...`;
    openPlayerCase();
}

/**
 * NEW: Player decides to SWITCH cases
 */
function handleSwitchCase() {
    switchModal.classList.add("hidden");
    
    const lastCaseIndex = caseStatus.findIndex(s => s === "closed");

    if (lastCaseIndex !== -1) {
        caseStatus[playerCaseIndex] = "closed"; 
        playerCaseIndex = lastCaseIndex;
        caseStatus[playerCaseIndex] = "playerCase";
    }
    
    renderCases();
    statusMessage.textContent = "Switched cases! You got...";

    setTimeout(() => {
        openPlayerCase();
    }, 1000); // 1 second delay
}


/**
 * Final step: Player gets what's in their chosen case
 */
function openPlayerCase() {
    const player = cases[playerCaseIndex];
    acceptPlayer(player);
}

/**
 * Locks in the chosen player and moves to the next round
 */
function acceptPlayer(player) {
    const position = POSITIONS[currentPositionIndex];
    finalTeam[position] = player;
    updateTeamRosterUI();

    currentPositionIndex++;
    
    setTimeout(() => {
        startPositionRound();
    }, 2500); // 2.5-second delay
}

/**
 * Ends the game and shows the NEW analysis report
 */
function endGame() {
    gameState = "GAME_OVER";
    statusMessage.textContent = "Your Championship Team is set! Analyzing...";

    // Hide game elements
    caseGrid.innerHTML = "";
    caseGrid.classList.add("hidden");
    playerBoard.innerHTML = "";
    playerBoardContainer.classList.add("hidden");
    resetButtonContainer.classList.add("hidden"); // Hide reset button temporarily

    // --- NEW ANALYSIS LOGIC ---
    analyzeAndShowReport();
}

/**
 * NEW: Analyzes the finalTeam and renders the report
 */
function analyzeAndShowReport() {
    let totalValue = 0;
    const allTags = new Set();
    let projectCount = 0;

    for (const pos of POSITIONS) {
        const player = finalTeam[pos];
        if (player) {
            totalValue += player.value;
            const playerTags = ARCHETYPES[player.name];

            if (playerTags) {
                playerTags.forEach(tag => allTags.add(tag));
            } else {
                // Player not in our archetype list
                allTags.add("WILDCARD");
            }
        }
    }

    // --- 1. Generate Quantitative Analysis (Record & Grade) ---
    let record = "41-41";
    let grade = "C+ (Play-In Team)";

    if (totalValue >= 48) {
        record = "62-20"; grade = "A+ (Championship Favorite)";
    } else if (totalValue >= 45) {
        record = "57-25"; grade = "A (True Contender)";
    } else if (totalValue >= 40) {
        record = "51-31"; grade = "B+ (Playoff Lock)";
    } else if (totalValue >= 35) {
        record = "45-37"; grade = "B (Solid Playoff Team)";
    } else if (totalValue >= 30) {
        record = "40-42"; grade = "C (Play-In Bubble)";
    } else if (totalValue >= 25) {
        record = "33-49"; grade = "D (Lottery Bound)";
    } else if (totalValue >= 20) {
        record = "25-57"; grade = "F (Deep Lottery)";
    } else {
        record = "17-65"; grade = "F- (Generational Tank)";
    }

    reportRecord.textContent = record;
    reportGrade.textContent = grade;

    // --- 2. Generate Qualitative Analysis (Synergy) ---
    const strengths = new Set();
    const weaknesses = new Set();

    // Check for core needs
    if (allTags.has("PLAYMAKER")) strengths.add("Elite Playmaking");
    else weaknesses.add("Lacks a true floor general");

    if (allTags.has("SCORING")) strengths.add("Go-to Scoring Options");
    else weaknesses.add("No reliable go-to scorer");
    
    if (allTags.has("SPACING")) strengths.add("Good Floor Spacing");
    else weaknesses.add("Poor Floor Spacing");

    if (allTags.has("DEFENSE_PER")) strengths.add("Strong Perimeter Defense");
    else weaknesses.add("Weak Perimeter Defense");

    if (allTags.has("DEFENSE_INT")) strengths.add("Strong Interior Defense");
    else weaknesses.add("Weak Interior Defense");

    if (allTags.has("REBOUNDING")) strengths.add("Solid Rebounding");
    else weaknesses.add("Poor Rebounding");

    // Check for combinations
    if (allTags.has("DEFENSE_PER") && allTags.has("DEFENSE_INT")) {
        strengths.add("Versatile Defensive Identity");
    }
    if (allTags.has("SCORING") && allTags.has("PLAYMAKER")) {
        strengths.add("Dynamic Offense");
    }
    if (allTags.has("PROJECT")) {
        projectCount = [...allTags].filter(t => t === "PROJECT").length;
        weaknesses.add(`Relies on ${projectCount} unproven ${projectCount > 1 ? 'players' : 'player'}`);
    }
    if (allTags.has("WILDCARD")) {
        weaknesses.add("Contains unknown 'Wildcard' players");
    }

    // --- 3. Render Report ---
    reportStrengths.innerHTML = "";
    reportWeaknesses.innerHTML = "";

    strengths.forEach(s => {
        const li = document.createElement("li");
        li.textContent = s;
        reportStrengths.appendChild(li);
    });

    weaknesses.forEach(w => {
        const li = document.createElement("li");
        li.textContent = w;
        reportWeaknesses.appendChild(li);
    });

    // Show the report
    statusMessage.textContent = "Your 2025-2026 Season Projection is in!";
    seasonReport.classList.remove("hidden");
    resetButtonContainer.classList.remove("hidden"); // Show reset button again
}


// --- 5. UI RENDERING FUNCTIONS ---

/**
 * Renders the 10 cases based on current `caseStatus`
 */
function renderCases() {
    caseGrid.innerHTML = ""; // Clear existing cases
    for (let i = 0; i < 10; i++) {
        const caseEl = document.createElement("div");
        caseEl.dataset.index = i;
        caseEl.className = "case-item h-20 md:h-24 flex items-center justify-center rounded-lg shadow-md cursor-pointer transition-all duration-200";

        // Failsafe for empty case
        const player = cases[i] || { name: 'Error', value: 0 };
        
        const caseNumber = document.createElement("span");
        caseNumber.className = "case-number text-3xl font-extrabold";
        caseNumber.textContent = i + 1;

        const casePlayer = document.createElement("span");
        casePlayer.className = "case-player text-center text-xs font-bold p-1";
        casePlayer.textContent = player.name;
        casePlayer.style.display = "none";

        caseEl.appendChild(caseNumber);
        caseEl.appendChild(casePlayer);

        const status = caseStatus[i];
        if (status === "playerCase") {
            caseEl.classList.add("player-case");
        } else if (status === "opened") {
            caseEl.classList.add("opened-case");
            caseNumber.style.display = "none";
            casePlayer.style.display = "block";
        } else {
            caseEl.classList.add("bg-gray-600", "hover:bg-gray-500");
        }
        
        caseGrid.appendChild(caseEl);
    }
}

/**
 * Renders the list of 10 players for the current round
 */
function renderPlayerBoard() {
    playerBoard.innerHTML = ""; // Clear board

    const sortedPlayers = [...cases].sort((a, b) => b.value - a.value);

    for (const player of sortedPlayers) {
        const playerEl = document.createElement("div");
        playerEl.textContent = player.name;
        playerEl.dataset.playerName = player.name;
        playerEl.className = "player-board-player bg-gray-700 p-2 rounded text-sm";
        
        if (player.value >= 8) playerEl.classList.add("text-green-400");
        else if (player.value >= 4) playerEl.classList.add("text-yellow-400");
        else playerEl.classList.add("text-red-400");

        playerBoard.appendChild(playerEl);
    }
}

/**
 * Finds a player on the board and grays them out
 */
function updatePlayerBoard(playerName) {
    const playerEl = playerBoard.querySelector(`[data-player-name="${playerName}"]`);
    if (playerEl) {
        playerEl.classList.add("eliminated");
    }
}

/**
 * Updates the "Your Starting Five" roster display
 */
function updateTeamRosterUI() {
    for (const position of POSITIONS) {
        const el = document.getElementById(`roster-${position}`);
        if (finalTeam[position]) {
            el.textContent = finalTeam[position].name;
        } else {
            el.textContent = "---";
        }
    }
}


// --- 6. UTILITY FUNCTIONS ---

/**
 * Shuffles an array in place (Fisher-Yates shuffle)
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- 7. ATTACH EVENT LISTENERS ---
caseGrid.addEventListener("click", handleCaseClick);
dealButton.addEventListener("click", handleDeal);
noDealButton.addEventListener("click", handleNoDeal);
resetButton.addEventListener("click", initGame);

// Listeners for Switch Modal
switchButton.addEventListener("click", handleSwitchCase);
keepButton.addEventListener("click", handleKeepCase);

// --- 8. START THE GAME! ---
initGame();