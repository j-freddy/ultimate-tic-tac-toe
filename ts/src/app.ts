const canvas = <HTMLCanvasElement> document.getElementById("main-canvas");
const ctx = <CanvasRenderingContext2D> canvas.getContext("2d");

window.addEventListener("load", () => {
  console.log("Hello world!");
  createNewGame();
});

function createNewGame() {
  GUI.getInstance(new Game()).refresh();
}

function switchContextToNewGame() {
  GUI.getInstance().switchContext(new Game());
  GUI.getInstance().refresh();
}
