const canvas = <HTMLCanvasElement> document.getElementById("main-canvas");
const ctx = <CanvasRenderingContext2D> canvas.getContext("2d");

window.addEventListener("load", () => {
  console.log("Hello world!");
  createNewGame();
});

function createNewGame(playerCross: Player = new PlayerHuman(MarkType.X),
                       playerNought: Player = new PlayerHuman(MarkType.O)) {
  GUI.getInstance(new Game(playerCross, playerNought)).refresh();
}

function switchContextToNewGame(playerCross: Player, playerNought: Player) {
  // Old game is deprecated
  GUI.getInstance().getGame().setDeprecated();
  // Switch to new game
  GUI.getInstance().switchContext(new Game(playerCross, playerNought));
  GUI.getInstance().refresh();
}
