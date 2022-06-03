const canvas = <HTMLCanvasElement> document.getElementById("main-canvas");
const ctx = canvas.getContext("2d");

window.onload = () => {
  console.log("Hello world!");

  test();
}

function test(): void {
  const board = new GlobalBoard();
  board.setCellValue(CellValue.Cross, 4, 8);
  console.log(board);
}
