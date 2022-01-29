class TicTacToe {
  constructor(rootElement, rows = 3, columns = 3, startsWithX = true) {
    this.isTurnX = startsWithX;
    this.winner = null;
    this.rows = rows;
    this.columns = columns;
    this.calculator = [
      new TicTacToeCalculator(rows, columns),
      new TicTacToeCalculator(rows, columns),
    ];
    const gameContainer = document.createElement("div");
    gameContainer.classList.add("game-container");
    const gameStatus = document.createElement("h4");
    gameStatus.id = "game-status";
    const gameBoard = document.createElement("div");
    gameBoard.id = "game-board";
    gameBoard.classList.add("game-board");
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const gameColumn = document.createElement("div");
        gameColumn.onclick = this.OnClick.bind(this);
        gameColumn.setAttribute("column", j);
        gameColumn.setAttribute("row", i);
        gameColumn.style.gridRow = i + 1;
        gameBoard.append(gameColumn);
      }
    }
    gameContainer.append(gameStatus);
    gameContainer.append(gameBoard);
    rootElement.append(gameContainer);
    this.updateGameStatus();
  }

  restart(startsWithX = true) {
    this.isTurnX = startsWithX;
    this.winner = null;
    this.calculator = [
      new TicTacToeCalculator(this.rows, this.columns),
      new TicTacToeCalculator(this.rows, this.columns),
    ];
    const gameBoard = document.getElementById("game-board");
    gameBoard.classList.remove("finish");
    for (let row of gameBoard.childNodes) {
      row.classList.remove("active");
      row.classList.remove("X");
      row.classList.remove("O");
    }
  }

  updateGameStatus() {
    const gameStatus = document.getElementById("game-status");
    gameStatus.innerText = this.winner
      ? `${this.winner} won!`
      : this.winner === undefined
      ? "Draw!"
      : `${this.isTurnX ? "X" : "O"}'s turn`;
  }

  async OnClick(event) {
    const button = event.currentTarget;
    if (
      this.winner === null &&
      !button.classList.contains("X") &&
      !button.classList.contains("O")
    ) {
      if (this.isTurnX === true) {
        button.classList.add("X");
      } else {
        button.classList.add("O");
      }
      const row = parseInt(button.getAttribute("row"));
      const column = parseInt(button.getAttribute("column"));
      const winner = await this.CalculateStep(row, column);
      if (winner) {
        this.winner = this.isTurnX ? "x" : "o";
        const board = document.getElementById("game-board");
        board.classList.add("finish");
        for (let cor of winner) {
          board.childNodes[cor[0] * this.columns + cor[1]].classList.add(
            "active"
          );
        }
        document.dispatchEvent(
          new CustomEvent("game-finish", { detail: this.winner })
        );
      } else {
        let isDraw = true;
        loopMain: for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            if (this.calculator[0].board[i][j]) continue;
            if (this.calculator[1].board[i][j]) continue;
            isDraw = false;
            break loopMain;
          }
        }
        if (isDraw) {
          this.winner = undefined;
          document.dispatchEvent(new CustomEvent("game-finish"));
        }
      }
      this.isTurnX = !this.isTurnX;
      this.updateGameStatus();
    }
  }

  async CalculateStep(row, column) {
    const calculator = this.calculator[this.isTurnX ? 0 : 1];
    return await calculator.CalculateStep(row, column);
  }
}

class TicTacToeCalculator {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.board = new Array(rows);
    for (let i = 0; i < rows; i++)
      this.board[i] = new Array(columns).fill(0);
  }

  async CalculateStep(row, column) {
    this.board[row][column] = 1;
    const Row = new Promise((resolve) => resolve(this.CalculateRow()));
    const Column = new Promise((resolve) => resolve(this.CalculateColumn()));
    const Diagonal = new Promise((resolve) =>
      resolve(this.CalculateDiagonal())
    );
    return (await Row) || (await Column) || (await Diagonal);
  }

  CalculateRow() {
    for (let row = 0; row < this.rows; row++) {
      let count = 0;
      for (let column = 0; column < this.columns; column++) {
        if (this.board[row][column]) count++;
        else count = 0;
        if (count === 3)
          return [
            [row, column - 2],
            [row, column - 1],
            [row, column],
          ];
      }
    }
  }

  CalculateColumn() {
    for (let column = 0; column < this.columns; column++) {
      let count = 0;
      for (let row = 0; row < this.rows; row++) {
        if (this.board[row][column]) count++;
        else count = 0;
        if (count === 3)
          return [
            [row - 2, column],
            [row - 1, column],
            [row, column],
          ];
      }
    }
  }

  CalculateDiagonal() {
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        if (row + 2 < this.rows && column + 2 < this.columns) {
          if (
            this.board[row][column] &&
            this.board[row + 1][column + 1] &&
            this.board[row + 2][column + 2]
          ) {
            return [
              [row, column],
              [row + 1, column + 1],
              [row + 2, column + 2],
            ];
          }
        }
        if (row + 2 < this.rows && column - 2 >= 0) {
          if (
            this.board[row][column] &&
            this.board[row + 1][column - 1] &&
            this.board[row + 2][column - 2]
          ) {
            return [
              [row, column],
              [row + 1, column - 1],
              [row + 2, column - 2],
            ];
          }
        }
      }
    }
  }
}
