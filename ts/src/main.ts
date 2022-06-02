const canvas = <HTMLCanvasElement> document.getElementById("main-canvas");
const ctx = canvas.getContext("2d");

window.onload = () => {
  console.log("Hello world!");

  test();
}

function test(): void {
  const board = new LocalBoard();
  
  board.setCellValue(CellValue.Cross, 3);
  board.setCellValue(CellValue.Nought, 6);
  console.log(board.getValue());

  board.setCellValue(CellValue.Nought, 4);
  board.setCellValue(CellValue.Nought, 2);
  console.log(board.getValue());
}
