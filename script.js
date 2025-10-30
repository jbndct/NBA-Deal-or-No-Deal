// --- 1. IMPORT GAME DATA ---
// Import the expanded player database from the separate file
import { GAME_DATA } from './players.js';

// --- 2. GAME CONSTANTS & STATE ---
const POSITIONS = ["PG", "SG", "SF", "PF", "C"];
const ELIMINATION_ROUNDS = [3, 3, 2]; // Open 3, then 3, then 2

// Game State Variables
let currentPositionIndex = 0;
let cases = []; // Array of 10 player objects, {name, value}, for the *current* round
let caseStatus = []; // 10-item array: "closed", "opened", "playerCase"
let playerCaseIndex = -1;
let eliminationsThisRound = 0;
let currentEliminationRound = 0;
let finalTeam = { PG: null, SG: null, SF: null, PF: null, C: null };
let gameState = "PICK_POSITION"; // "PICK_CASE", "ELIMINATE", "BANKER_OFFER", "GAME_OVER"
let currentBankerOffer = null;

// --- 3. DOM ELEMENT REFERENCES ---
const statusMessage = document.getElementById("status-message");
const caseGrid = document.getElementById("case-grid");
const playerBoard = document.getElementById("player-board");
const offerModal = document.getElementById("offer-modal");
const offerPlayerName = document.getElementById("offer-player-name");
const dealButton = document.getElementById("deal-button");
const noDealButton = document.getElementById("no-deal-button");
const resetButton = document.getElementById("reset-button");

// --- 4. CORE GAME FUNCTIONS ---

/**
 * Initializes the entire game or resets it
 */
function initGame() {
    currentPositionIndex = 0;
    finalTeam = { PG: null, SG: null, SF: null, PF: null, C: null };
    updateTeamRosterUI();
    startPositionRound();
}

/**
 * Sets up a new round for the next position
 * *** THIS IS THE NEW RANDOMIZED LOGIC ***
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

    // --- NEW LOGIC ---
    // Get the *pool* of players for this position (e.g., GAME_DATA.PG)
    const playerPool = GAME_DATA[currentPosition];
    
    // Build the 10-player board for this round
    let playersForThisRound = [];
    for (let value = 10; value >= 1; value--) {
        const poolForValue = playerPool[value]; // Get the array of players at this value
        // Pick one random player *name* from that array
        const randomPlayerName = poolForValue[Math.floor(Math.random() * poolForValue.length)];
        
        // Add the player object to our round
        playersForThisRound.push({
            name: randomPlayerName,
            value: value
        });
    }

    // Now we have 10 players, one from each value tier
    // Shuffle them and assign them to the 'cases' variable
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
    const clickedCase = e.target.closest('.case-item');
    if (!clickedCase || clickedCase.dataset.index === undefined) return;

    const index = parseInt(clickedCase.dataset.index);

    if (gameState === "PICK_CASE") {
        // Player is picking their main case
        playerCaseIndex = index;
        caseStatus[index] = "playerCase";
        gameState = "ELIMINATE";
        statusMessage.textContent = `Eliminate ${ELIMINATION_ROUNDS[currentEliminationRound]} cases.`;
        renderCases();
    
    } else if (gameState === "ELIMINATE") {
        // Player is eliminating cases
        if (index === playerCaseIndex || caseStatus[index] === "opened") {
            return; // Can't open own case or an already-opened case
        }

        caseStatus[index] = "opened";
        eliminationsThisRound++;
        const playerInCase = cases[index];
        
        updatePlayerBoard(playerInCase.name);
        renderCases();

        const elimsNeeded = ELIMINATION_ROUNDS[currentEliminationRound];
        if (eliminationsThisRound === elimsNeeded) {
            // Round is over, trigger banker offer
            gameState = "BANKER_OFFER";
            eliminationsThisRound = 0;
            currentEliminationRound++;
            makeBankerOffer();
        } else {
            // Continue eliminating
            statusMessage.textContent = `Eliminate ${elimsNeeded - eliminationsThisRound} more cases.`;
        }
    }
}

/**
 * Calculates and displays the banker's offer
 */
function makeBankerOffer() {
    // Check if this is the final 1v1
    if (currentEliminationRound > ELIMINATION_ROUNDS.length) {
        const lastCaseIndex = caseStatus.findIndex(s => s === "closed");
        currentBankerOffer = cases[lastCaseIndex];
        statusMessage.textContent = "Final Offer! Take this player or your case?";
    } else {
        // Calculate offer
        currentBankerOffer = calculateOffer();
        statusMessage.textContent = "Banker's Offer...";
    }
    
    offerPlayerName.textContent = currentBankerOffer.name;
    offerModal.classList.remove("hidden");
}

/**
 * The "AI" for the banker.
 * Calculates offer based on the average value of *remaining* cases.
 * Offers the player (from the 10 on the board) whose value is closest to that average.
 */
function calculateOffer() {
    let remainingValues = [];
    
    // Get all players for *this* round (the 10 in the cases)
    let allPlayersThisRound = [...cases];

    for (let i = 0; i < cases.length; i++) {
        if (caseStatus[i] === "closed" || caseStatus[i] === "playerCase") {
            remainingValues.push(cases[i].value);
        }
    }

    const avgValue = remainingValues.reduce((a, b) => a + b, 0) / remainingValues.length;

    // Find an "offerable" player. This is a player not yet eliminated.
    let availableOffers = allPlayersThisRound.filter(player => {
        // Check if this player is in an *opened* case.
        const openedCaseIndex = cases.findIndex((p, idx) => p.name === player.name && caseStatus[idx] === "opened");
        return openedCaseIndex === -1; // Return true if NOT in an opened case
    });

    if (availableOffers.length === 0) {
        // Failsafe, should rarely happen. Offer the lowest-value player.
        return [...allPlayersThisRound].sort((a,b) => a.value - b.value)[0];
    }

    // Find the available player closest to the average value
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
        // Player chose their case over the last offer
        openPlayerCase();
    } else {
        // Continue to next elimination round
        gameState = "ELIMINATE";
        const elimsNeeded = ELIMINATION_ROUNDS[currentEliminationRound];
        if (elimsNeeded) {
            statusMessage.textContent = `Eliminate ${elimsNeeded} cases.`;
        } else {
            // This can happen if rounds are misconfigured, open case as failsafe
            openPlayerCase();
        }
    }
}

/**
 * Final step: Player gets what's in their chosen case
 */
function openPlayerCase() {
    const player = cases[playerCaseIndex];
    statusMessage.textContent = `Your case had ${player.name}!`;
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
    // Use a timeout to let the player see the result
    setTimeout(() => {
        startPositionRound();
    }, 2000); // 2-second delay
}

/**
 * Ends the game when all 5 positions are filled
 */
function endGame() {
    gameState = "GAME_OVER";
    statusMessage.textContent = "Your Championship Team is set!";
    caseGrid.innerHTML = `<div class="col-span-5 text-center text-2xl font-bold">GAME OVER!</div>`;
    playerBoard.innerHTML = `<div class="col-span-2 text-center">Thanks for playing!</div>`;
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
        
        const caseNumber = `<span class="case-number text-3xl font-extrabold">${i + 1}</span>`;
        const player = cases[i];
        const casePlayer = `<span class="case-player hidden text-center text-xs font-bold p-1">${player.name}</span>`;

        caseEl.innerHTML = caseNumber + casePlayer;

        // Apply styles based on status
        const status = caseStatus[i];
        if (status === "playerCase") {
            caseEl.classList.add("player-case");
        } else if (status === "opened") {
            caseEl.classList.add("opened-case");
        } else {
            // "closed"
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
    
    // Get the players for this round from the 'cases' variable
    const players = [...cases];
    
    // Sort by value, descending (best player on top)
    const sortedPlayers = players.sort((a, b) => b.value - a.value);
    
    for (const player of sortedPlayers) {
        const playerEl = document.createElement("div");
        playerEl.textContent = player.name;
        playerEl.dataset.playerName = player.name;
        playerEl.className = "player-board-player bg-gray-700 p-2 rounded text-sm";
        // Color code by value
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

// --- 8. START THE GAME! ---
initGame();
