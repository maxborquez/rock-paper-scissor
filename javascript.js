// Function to generate a secure random integer between 0 and max - 1
function getSecureRandomInt(max) {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
}

// Class representing a player
class Player {
  constructor(name) {
    this.name = name;
    this.score = 0; // Initialize player score
  }

  // Method to randomly choose a hand (0 = rock, 1 = paper, 2 = scissors)
  cpuHand() {
    return getSecureRandomInt(3);
  }
}

// Class representing the game logic
class Game {
  constructor(name) {
    this.player_you = new Player(name); // Player controlled by the user
    this.player_cpu = new Player("cpu"); // Computer-controlled player
  }

  // Update the score display on the screen
  updateScores() {
    const youScore = document.getElementById("left-score");
    const cpuScore = document.getElementById("right-score");

    youScore.textContent = this.player_you.score;
    cpuScore.textContent = this.player_cpu.score;
  }

  // Display hands as images, then restore score view after 2 seconds
  displayHand(youHand, cpuHand) {
    const left = document.getElementById("left-score");
    const right = document.getElementById("right-score");

    // Helper function to get the correct hand image
    function getHandImage(hand) {
      switch (hand) {
        case 0:
          return '<img class="hand" src="./icons/fist.png">'; // Rock
        case 1:
          return '<img class="hand" src="./icons/hand.png">'; // Paper
        case 2:
          return '<img class="hand" src="./icons/scissors.png">'; // Scissors
        default:
          return "";
      }
    }

    // Display chosen hands as images
    left.innerHTML = getHandImage(youHand);
    right.innerHTML = getHandImage(cpuHand);

    // Disable buttons temporarily
    const buttons = document.querySelectorAll("#rock, #paper, #scissor");
    buttons.forEach((btn) => {
      btn.disabled = true;
    });

    // After 2 seconds, revert to showing the scores
    setTimeout(() => {
      left.textContent = this.player_you.score;
      right.textContent = this.player_cpu.score;

      // Re-enable buttons
      buttons.forEach((btn) => {
        btn.disabled = false;
      });
    }, 2000);
  }

  // Main game logic when a move is played
  play(youHand) {
    let cpuHand = this.player_cpu.cpuHand(); // Get computer's hand

    this.displayHand(youHand, cpuHand); // Show the hands

    const body = document.querySelector("body");
    const playerName = document.querySelectorAll(".name");

    let result = ""; // Store the result: win, lose, draw

    // Reset name colors
    playerName.forEach((name) => {
      name.style.color = "#181825";
    });

    // Determine the result
    if (youHand == cpuHand) {
      result = "draw";
      body.style.backgroundColor = "var(--yellow)"; // Yellow for draw
    } else if (
      (youHand == 0 && cpuHand == 1) || // Rock vs Paper
      (youHand == 1 && cpuHand == 2) || // Paper vs Scissors
      (youHand == 2 && cpuHand == 0) // Scissors vs Rock
    ) {
      result = "lose";
      body.style.backgroundColor = "var(--red)"; // Red for losing
    } else {
      result = "win";
      body.style.backgroundColor = "var(--green)"; // Green for winning
    }

    // After 2 seconds, update scores and reset styles
    setTimeout(() => {
      if (result == "lose") {
        this.player_cpu.score++;
      } else if (result == "win") {
        this.player_you.score++;
      }

      // Reset background and name colors
      body.style.backgroundColor = "var(--mantle)";
      playerName.forEach((name) => {
        name.style.color = "var(--text)";
      });

      // Update the displayed scores
      this.updateScores();
    }, 2000);

    return result;
  }

  // Print current scores to the console
  printConsoleScores() {
    console.log("score you: " + this.player_you.score);
    console.log("score cpu: " + this.player_cpu.score);
  }
}

// Get dialog and form
const dialog = document.getElementById("nameDialog");
const form = document.getElementById("dialogForm");

// Open the dialog modal
dialog.showModal();

form.addEventListener("submit", (event) => {

  // Get the player name from the modal
  const playerName = document.getElementById("playerName").value;
  // Create a new game instance
  const game = new Game(playerName);


  // Get the text element with "You" and replace with your name
  const displayName = document.getElementById("myName");
  displayName.textContent = playerName;


  // Get button elements
  const rock = document.getElementById("rock");
  const paper = document.getElementById("paper");
  const scissor = document.getElementById("scissor");

  // Add event listeners for each move
  rock.addEventListener("click", () => {
    game.play(0); // Rock
  });

  paper.addEventListener("click", () => {
    game.play(1); // Paper
  });

  scissor.addEventListener("click", () => {
    game.play(2); // Scissors
  });

  dialog.close(); // Cierra el diálogo
});
