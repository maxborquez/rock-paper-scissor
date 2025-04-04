function getSecureRandomInt(max) {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
}

class Player {
  constructor() {
    this.score = 0;
  }

  pcHand() {
    return getSecureRandomInt(3);
  }
}

class Game {
  constructor() {
    this.player_you = new Player();
    this.player_pc = new Player();
  }

  updateScores() {
    const youScore = document.getElementById("left-score");
    const pcScore = document.getElementById("right-score");

    youScore.textContent = this.player_you.score;
    pcScore.textContent = this.player_pc.score;
  }

  displayHand(youHand, pcHand) {
    const left = document.getElementById("left-score");
    const right = document.getElementById("right-score");

    // Función auxiliar para obtener la imagen correspondiente
    function getHandImage(hand) {
      switch (hand) {
        case 0:
          return '<img class="hand" src="./icons/fist.png">';
        case 1:
          return '<img class="hand" src="./icons/hand.png">';
        case 2:
          return '<img class="hand" src="./icons/scissors.png">';
        default:
          return "";
      }
    }

    // Cambiar a imagen
    left.innerHTML = getHandImage(youHand);
    right.innerHTML = getHandImage(pcHand);

    const buttons = document.querySelectorAll("#rock, #paper, #scissor");

    buttons.forEach((btn) => {
      btn.disabled = true;
    });

    // Después de 2 segundos, restaurar los puntajes
    setTimeout(() => {
      left.textContent = this.player_you.score;
      right.textContent = this.player_pc.score;

      buttons.forEach((btn) => {
        btn.disabled = false;
      });
    }, 3000);
  }

  play(youHand) {
    let pcHand = this.player_pc.pcHand();

    this.displayHand(youHand, pcHand);

    // Evaluamos el resultado
    let result = "";
    if (youHand == pcHand) {
      result = "draw";
    } else if (
      (youHand == 0 && pcHand == 1) ||
      (youHand == 1 && pcHand == 2) ||
      (youHand == 2 && pcHand == 0)
    ) {
      result = "lose";
    } else {
      result = "win";
    }

    // Aplazamos la actualización del score 2 segundos
    setTimeout(() => {
      if (result == "lose") {
        this.player_pc.score++;
      } else if (result == "win") {
        this.player_you.score++;
      }

      // Mostramos los nuevos puntajes después de 2 segundos
      this.updateScores();
    }, 2000);

    return result;
  }

  printScores() {
    console.log("score you: " + this.player_you.score);
    console.log("score pc: " + this.player_pc.score);
  }
}

const game = new Game();

game.printScores();

const rock = document.getElementById("rock");
const paper = document.getElementById("paper");
const scissor = document.getElementById("scissor");
const youScore = document.getElementById("left-score");
const pcScore = document.getElementById("right-score");

rock.addEventListener("click", () => {
  game.play(0);
});

paper.addEventListener("click", () => {
  game.play(1);
});

scissor.addEventListener("click", () => {
  game.play(2);
});
