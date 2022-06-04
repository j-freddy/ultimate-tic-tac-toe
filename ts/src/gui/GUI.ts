// TODO Refactor for repetition
class GUI {
  private static drawLine(x1: number, y1: number, x2: number, y2: number,
                          colour = "#000", width = 1) {
    ctx.lineWidth = width;
    ctx.strokeStyle = colour;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  static drawLocalBoard(board: LocalBoard, xOffset: number, yOffset: number) {
    // TODO Magic numbers
    // TODO Repetition
    let boardWidth = canvas.width / 3;
    let boardHeight = canvas.height / 3;
    let cellWidth = boardWidth / board.NUM_COLS;
    let cellHeight = boardHeight / board.NUM_ROWS;

    for (let i = 1; i < board.NUM_ROWS; i++) {
      let y = i * boardHeight / board.NUM_ROWS;
      GUI.drawLine(xOffset, y + yOffset, boardWidth + xOffset, y + yOffset,
                   "#777");
    }

    for (let i = 1; i < board.NUM_COLS; i++) {
      let x = i * boardWidth / board.NUM_COLS;
      GUI.drawLine(x + xOffset, yOffset, x + xOffset, boardHeight + yOffset,
                   "#777");
    }

    for (let i = 0; i < board.NUM_ROWS; i++) {
      for (let j= 0; j < board.NUM_COLS; j++) {
        let cellValue = board.getCellValue(i, j);

        // Move to next iteration if cell is empty
        if (!cellValue) {
          continue;
        }

        let image = cellValue === MarkType.O ? img.o : img.x;
        
        ctx.drawImage(image, xOffset + cellWidth * j, yOffset + cellHeight * i,
                      cellWidth, cellHeight)
      }
    }
  }

  static drawBoard(board: GlobalBoard) {
    let boardWidth = canvas.width;
    let boardHeight = canvas.height;
    let localBoardWidth = boardWidth / board.NUM_COLS;
    let localBoardHeight = boardHeight / board.NUM_ROWS;

    for (let i = 0; i < board.NUM_ROWS; i++) {
      for (let j = 0; j < board.NUM_COLS; j++) {
        GUI.drawLocalBoard(board.getLocalBoard(i, j), localBoardWidth * j,
                           localBoardHeight * i);
      }
    }

    for (let i = 1; i < board.NUM_ROWS; i++) {
      let y = i * boardHeight / board.NUM_ROWS;
      GUI.drawLine(0, y, boardWidth, y, "#000", 3);
    }

    for (let i = 1; i < board.NUM_COLS; i++) {
      let x = i * boardWidth / board.NUM_COLS;
      GUI.drawLine(x, 0, x, boardHeight, "#000", 3);
    }
  }
}
