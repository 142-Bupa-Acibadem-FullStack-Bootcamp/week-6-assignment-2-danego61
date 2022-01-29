window.onload = function () {
  let row = -1;
  let col = -1;
  const modal = document.getElementById("modal");
  const winnerText = document.getElementById("txt-winner");
  const gameRoot = document.getElementById("tic-tac-toe");
  const txtRow = document.getElementById("txt-row");
  const txtCol = document.getElementById("txt-col");
  document.getElementById("btn-start").onclick = function () {
    const newRow = txtRow.value;
    const newCol = txtCol.value;
    if (!this.ticTacToe || newRow != row || newCol != col) {
      row = newRow;
      col = newCol;
      gameRoot.innerHTML = "";
      this.ticTacToe = new TicTacToe(gameRoot, row, col);
    } else {
      this.ticTacToe.restart();
    }
    modal.classList.remove("open");
  };
  document.addEventListener("game-finish", function (winner) {
    winnerText.innerText = winner.detail ? `${winner.detail} won!` : "Draw!";
    modal.classList.add("open");
  });
};
