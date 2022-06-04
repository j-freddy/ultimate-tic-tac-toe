const canvas = <HTMLCanvasElement> document.getElementById("main-canvas");
const ctx = <CanvasRenderingContext2D> canvas.getContext("2d");

window.onload = () => {
  console.log("Hello world!");

  test();
}

function test(): void {
  const board = new GlobalBoard();
  board.setCellValue(MarkType.O, 0, 0);
  board.setCellValue(MarkType.O, 5, 3);
  board.setCellValue(MarkType.X, 7, 8);
  GUI.drawBoard(board);
}
