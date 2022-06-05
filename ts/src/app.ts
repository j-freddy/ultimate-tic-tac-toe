const canvas = <HTMLCanvasElement> document.getElementById("main-canvas");
const ctx = <CanvasRenderingContext2D> canvas.getContext("2d");

window.addEventListener("load", () => {
  console.log("Hello world!");

  const game = new Game();
  const gui = GUI.getInstance(game);
  gui.refresh();
});
