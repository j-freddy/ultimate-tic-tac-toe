// TODO Refactor for repetition
class GUI {
  private static instance: GUI;

  private readonly game: Game;

  private constructor(game: Game) {
    this.game = game;
    this.startObservables();
  }

  static getInstance(game: Game): GUI {
    if (!GUI.instance) {
      GUI.instance = new GUI(game);
    }

    return GUI.instance;
  }

  private drawLine(x1: number, y1: number, x2: number, y2: number,
                          colour = "#000", width = 1) {
    ctx.lineWidth = width;
    ctx.strokeStyle = colour;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  private fillRect(x: number, y: number, width: number, height: number,
                   colour = "#000") {
    ctx.fillStyle = colour;
    ctx.fillRect(x, y, width, height);
  }

  drawLocalBoard(board: LocalBoard, xOffset: number, yOffset: number) {
    // TODO Magic numbers
    // TODO Repetition
    let boardWidth = canvas.width / 3;
    let boardHeight = canvas.height / 3;
    let cellWidth = boardWidth / board.NUM_COLS;
    let cellHeight = boardHeight / board.NUM_ROWS;
    
    // Highlight board if active
    if (this.game.getBoard().getActiveBoards().includes(board)) {
      this.fillRect(xOffset, yOffset, boardWidth, boardHeight, "#ffff00");
    }

    // Draw frame
    for (let i = 1; i < board.NUM_ROWS; i++) {
      let y = i * boardHeight / board.NUM_ROWS;
      this.drawLine(xOffset, y + yOffset, boardWidth + xOffset, y + yOffset,
                   "#777");
    }

    for (let i = 1; i < board.NUM_COLS; i++) {
      let x = i * boardWidth / board.NUM_COLS;
      this.drawLine(x + xOffset, yOffset, x + xOffset, boardHeight + yOffset,
                   "#777");
    }

    // Draw Os and Xs
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

  private drawGlobalBoard() {
    let board = this.game.getBoard();

    let boardWidth = canvas.width;
    let boardHeight = canvas.height;
    let localBoardWidth = boardWidth / board.NUM_COLS;
    let localBoardHeight = boardHeight / board.NUM_ROWS;

    // Draw local boards
    for (let i = 0; i < board.NUM_ROWS; i++) {
      for (let j = 0; j < board.NUM_COLS; j++) {
        this.drawLocalBoard(board.getLocalBoard(i, j), localBoardWidth * j,
                           localBoardHeight * i);
      }
    }

    // Draw frame
    for (let i = 1; i < board.NUM_ROWS; i++) {
      let y = i * boardHeight / board.NUM_ROWS;
      this.drawLine(0, y, boardWidth, y, "#000", 3);
    }

    for (let i = 1; i < board.NUM_COLS; i++) {
      let x = i * boardWidth / board.NUM_COLS;
      this.drawLine(x, 0, x, boardHeight, "#000", 3);
    }

    // Draw Os and Xs
    for (let i = 0; i < board.NUM_ROWS; i++) {
      for (let j= 0; j < board.NUM_COLS; j++) {
        let cellValue = board.getCellValue(i, j);

        // Move to next iteration if cell is empty
        if (!cellValue) {
          continue;
        }

        let image = cellValue === MarkType.O ? img.o : img.x;
        
        ctx.drawImage(image, localBoardWidth * j, localBoardHeight * i,
                      localBoardWidth, localBoardHeight);
      }
    }
  }

  refresh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawGlobalBoard();
  }

  private startObservables() {
    canvas.addEventListener("mousedown", e => {
      // Ignore user commands if current player is not a human
      if (this.game.getCurrentPlayer().isBot()) {
        return;
      }

      // TODO Duplicate
      let board = this.game.getBoard();

      let boardWidth = canvas.width;
      let boardHeight = canvas.height;
      let localBoardWidth = boardWidth / board.NUM_COLS;
      let localBoardHeight = boardHeight / board.NUM_ROWS;

      let row = Math.floor(e.offsetY / localBoardHeight);
      let col = Math.floor(e.offsetX / localBoardWidth);

      let globalIndex = row * board.NUM_COLS + col;

      // TODO Magic numbers (also duplicate)
      let cellWidth = localBoardWidth / 3;
      let cellHeight = localBoardHeight / 3;

      let innerRow = Math.floor((e.offsetY % localBoardHeight) / cellHeight);
      let innerCol = Math.floor((e.offsetX % localBoardWidth) / cellWidth);

      let localIndex = innerRow * 3 + innerCol;

      this.game.makeMove(globalIndex, localIndex);

      // Update
      this.refresh();
    });
  }
}
