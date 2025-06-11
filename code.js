// Extract Elements
let mainGame = document.querySelector("#main-game");
let turnDisplaySection = document.querySelector("#turn-display");
let turnDisplay = document.querySelector("#display-section");
let userLabel = document.querySelector("label");
let userInput = document.querySelector("input");
let playerListDisplay = document.querySelector("#display-player-list");
let userInputSection = document.querySelector("#user-input-section");
let startMenu = document.querySelector("#game-menu");
let diceHeader = document.querySelector("#dice-header");
let dice1Image = document.querySelector("#dice-1");
let dice2Image = document.querySelector("#dice-2");
let currentTurnDisplay = document.querySelector("#current-player-turn");
let rollDiceButton = document.querySelector("#roll-dice-button");
let passTurnButton = document.querySelector("#pass-turn-button");
let toggleHistoryButton = document.querySelector("#toggle-history-button");
let historySection = document.querySelector("#player-history-section");
let winnerDisplay = document.querySelector("#display-winner");
let doneButton = document.querySelector("#done-button");
let scoreboard = document.querySelector("#scoreboard-section");

// Create Variables and Initialize
let points = [];
let players = [];
let turnCount = 0;
let playerTurnCount = 0;
let playerIndex = 0;
let double1s = false;
let single1s = false;
let count = 1;
let dice1, dice2;
let total = 0;
let reroll = false;
let playerName = "";
let winner = "";

// Initialize Displays
userInputSection.style.display = "none";
turnDisplaySection.style.display = "none";
mainGame.style.display = "none"; 
diceHeader.style.display = "none"; 
rollDiceButton.style.display = "none"; 
dice1Image.style.display = "none";
dice2Image.style.display = "none";
passTurnButton.style.display = "none";
historySection.style.display = "none";
winnerDisplay.style.display = "none";
doneButton.disabled = true;
doneButton.style.color = "#585858";
toggleHistoryButton.classList.add("hidden");
scoreboard.style.display = "none";

// Show History (initialize it to be shown)
toggleHistory();

// Add Event Listener
userInput.addEventListener("keydown", function addToList(event){
    
    // Get info
    let key = event.key;
    let name = userInput.value;
    
    // Decipher
    if(key === "Enter"){
        
        if(name != "" && name.length <= 9){
            
            if(players.length < 6){

                // Add to List
                players.push(name);
                points.push(0);
                
                // Recursion
                count++;
                
                // Change header text content
                userLabel.textContent = "Enter Player " + count + "'s Name: ";
                
                playerListDisplay.textContent = "Current Players: " + players[0];
                
                // Display Current Players
                for(let person = 1; person < players.length; person++){
                    playerListDisplay.textContent += ", " + players[person];
                    
                }
                
            } else {
                userLabel.textContent = "The max player amount has been met. Click done to begin game. ";
                
            }
                
        } else if(name.length > 9){
            userLabel.textContent = "Too many characters. Please enter a name with 9 or less characters.";
               
        } else {
            userLabel.textContent = "Please enter a valid input for Player " + count + "'s Name: ";

        }
        
        // Reset Input Field
        userInput.value = "";
        
        // Prevent user from clicking done if there are less than 2 players
        if(count > 2){
            doneButton.disabled = false;
            doneButton.style.color = "#ffe8c3";
        }
        
    }
    
});

/* Functions */

// Function to show user input section
function showInputSection(){
    
    // Change Displays
    startMenu.style.display = "none";
    userInputSection.style.display = "block";
    mainGame.style.display = "flex";
    
}

// Function to run game
function startGame(){
    
    // Change Displays
    userInputSection.style.display = "none";
    dice1Image.style.display = "inline";
    dice2Image.style.display = "inline";
    historySection.style.display = "block";
    turnDisplaySection.style.display = "block";
    scoreboard.style.display = "block";
    
    // Initialize Scoreboard
    initializeScores();
    
    // Start Loop
    switchTurns();
    
}

// Function to switch turns
function switchTurns(){
    
    // Reset
    passTurnButton.disabled = true;
    // dice1Image.src = "images/Blue_01.png";
    // dice2Image.src = "images/Blue_01.png";
    
    // Get Info
    playerIndex = turnCount % players.length;
    playerName = players[playerIndex];
    dice1 = randomRoll();
    dice2 = randomRoll();
    
    // Calculate
    total = dice1 + dice2;
    
    // Check penalty
    determinePenalty();
    
    // Add to score
    addPoints(playerIndex, total);
    
    // Get total score
    total = getScore(playerIndex);
    
    // Display
    currentTurnDisplay.innerHTML = "On turn " + (turnCount + 1) + ": " + playerName + "'s Turn. ";
    rollDiceButton.style.display = "block";
    rollDiceButton.disabled = false;
    
    // Clear Interval
    if(total >= 100){
        winner = playerName;
        changeScores(playerIndex, total);
        winGame();
    }
    
}

// Function to roll dice
function rollDice(){
    
    // Disable button + change color to show that it is disabled
    passTurnButton.disabled = false;
    passTurnButton.style.color = "#585858";
    rollDiceButton.style.color = "#ffe8c3";
    
    // Reroll dice if necessary
    if(reroll){
        dice1 = randomRoll();
        dice2 = randomRoll();
    }
    
    // Change Sources
    dice1Image.src = "images/Blue_0" + dice1 + ".png";
    dice2Image.src = "images/Blue_0" + dice2 + ".png";
    
    // Display Pass Button
    passTurnButton.style.display = "inline";
    passTurnButton.textContent = "Pass Turn";
    determinePenalty();
    
    // Add to History
    if(reroll){
        
        // Calculate
        total = dice1 + dice2;
        addPoints(playerIndex, total);
        total = getScore(playerIndex);
        
        // Add to history and scoreboard
        addGameHistory();
        changeScores(playerIndex, total);
        
    } else {

        // Add to history and scoreboard
        addGameHistory();
        changeScores(playerIndex, total);
        
        
    } 
    
    // Decipher
    if(dice1 != 1 && dice2 != 1 && !reroll){
        rollDiceButton.textContent = "Reroll";
        passTurnButton.textContent = "Keep Score";
        passTurnButton.style.color = "#ffe8c3";
        rollDiceButton.style.color = "#ffe8c3";
        reroll = true;
        
    } else if(reroll){
        rollDiceButton.disabled = true;
        rollDiceButton.style.color = "#585858";
        passTurnButton.style.color = "#ffe8c3";
        
    } else if(dice1 == 1 || dice2 == 1){
        rollDiceButton.disabled = true;
        rollDiceButton.style.color = "#585858";
        passTurnButton.style.color = "#ffe8c3";
    }
    
    // Scroll
    scrollToBottom();

    // Clear Interval if someone won
    if(total >= 100){
        winner = playerName;
        changeScores(playerIndex, total);
        winGame();
    }

}

// Function to generate random number
function randomRoll(){
    
    // Generate
    let rndNum = Math.floor(Math.random() * 6) + 1;
    
    // Return
    return(rndNum);
}

// Function to determine penalty
function determinePenalty(){
    
    // Reset
    double1s = false;
    single1s = false;
    
    // Determine
    if(dice1 == 1 && dice2 == 1){
        
        // Set variable equal to true
        double1s = true;
        
    } else if(dice1 == 1 || dice2 == 1){
        single1s = true;
        
    }
    
}

// Function to add to point bank
function addPoints(player, total){
    
    // Get current total
    let currentTotal = points[player];
    
    // Check for penalty
    if(double1s){
        currentTotal = 0;
        
    } else if(!single1s){
        currentTotal = currentTotal + total;
        
    }
    
    // Update list value
    points[player] = currentTotal;
}

// Function to get total from point bank
function getScore(player){
    
    // Get score
    let score = points[player];
    
    // Return
    return(score);
    
}

// Function to add to history
function addGameHistory(){

    // Display
    if(!reroll){
        
        // Adjust Formatting
        if(turnCount == 0){
            turnDisplay.textContent += "On turn " + (turnCount + 1) + ": " + playerName + " rolled a " + dice1 + " and " + dice2 + ".";
            
        } else {
            turnDisplay.textContent += "\n\n On turn " + (turnCount + 1) + ": " + playerName + " rolled a " + dice1 + " and " + dice2 + ".";
            
        }
        
    } else {
        turnDisplay.innerHTML += "\n On their reroll, they rolled a " + dice1 + " and " + dice2 + ".";
    }
    
    // Display Penalty if applicable
    if(double1s){
        turnDisplay.innerHTML += "\n Because " + playerName + " rolled double 1s, their score has been reset to 0. ";
        
    } else if(single1s) {
        turnDisplay.innerHTML += "\n Because " + playerName + " rolled a single 1, their score will remain as " + total + ".";
        
    } else {
        turnDisplay.innerHTML += "\n Their total score is " + total + ".";
    }
    
}

// Function to pass the turn to next player
function passTurn(){
    
    // Reset
    reroll = false;
    rollDiceButton.textContent = "Roll";
    rollDiceButton.style.color = "#ffe8c3";
    passTurnButton.style.color = "#585858";
    
    // Recursion
    turnCount++;
    
    // Switch Turns
    switchTurns();
    
    // Scroll
    scrollToBottom();
}

// Function to toggle history
function toggleHistory(){
    
    // Toggle classes (for the + and - signs)
    toggleHistoryButton.classList.toggle("shown");
    toggleHistoryButton.classList.toggle("hidden");
    
    // Collapse if needed
    if(turnDisplay.style.maxHeight){
        turnDisplay.style.maxHeight = "";
        
    } else {
        turnDisplay.style.maxHeight = "200px";
    }
    
    // Scroll when opened
    scrollToBottom();
    
}

// Function to scroll to bottom for textarea
function scrollToBottom(){
    turnDisplay.scrollTop = turnDisplay.scrollHeight;
    
}

// Function to display winner
function winGame(){
    
    // Add to History
    addGameHistory();
    
    // Disable Buttons
    rollDiceButton.disabled = true;
    passTurnButton.disabled = true;
    
    // Display Header
    winnerDisplay.style.display = "block";
    winnerDisplay.textContent = "After " + (turnCount + 1) + " turns, " + winner + " won the game with a total of " + total + " points! ";
    
}

// Function to add to scoreboard
function initializeScores(){
    
    // Loop to create elements
    for(let index = 0; index < players.length; index++){

        // Create Elements
        let playerSection = document.createElement("div");
        let playerName = document.createElement("h3");
        let playerScore = document.createElement("h3");

        // Get Scores
        let score = points[index];
        let name = players[index];

        // Change Properties
        playerSection.style.display = "flex";
        playerSection.style.justifyContent = "space-between";
        playerSection.style.border = "2px dotted #3d4241";
        playerSection.style.backgroundColor = "#e2efef";
        playerSection.style.borderRadius = "5px";
        playerSection.style.margin = "7px";
        playerSection.style.padding = "5px";
        
        playerName.textContent = name;
        
        playerScore.textContent = score;
        playerScore.classList.add("scores");

        // Append
        scoreboard.appendChild(playerSection);
        playerSection.append(playerName);
        playerSection.append(playerScore);

    }
    
}

// Function to change scores
function changeScores(index, newScore){
    
    // Get Element
    let allScores = document.querySelectorAll(".scores");
    let scoreElement = allScores[index];

    // Change Score
    scoreElement.textContent = newScore;

}