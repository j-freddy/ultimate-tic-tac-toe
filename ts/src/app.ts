const canvas = <HTMLCanvasElement> document.getElementById("main-canvas");
const ctx = <CanvasRenderingContext2D> canvas.getContext("2d");

window.addEventListener("load", () => {
  console.log("Hello world!");

  const game = new Game();
  const gui = GUI.getInstance(game);

  game.makeMove(3, 5);
  game.makeMove(4, 6);
  game.makeMove(5, 7);
  game.makeMove(4, 7);
  game.makeMove(4, 1);
  game.makeMove(4, 8);

  gui.refresh();
});
