// TODO Refactor for repetition
class GUI {
  private static instance: GUI;

  private game: Game;

  private constructor(game: Game) {
    this.game = game;
    this.startObservables();
  }

  static getInstance(game?: Game): GUI {
    if (!GUI.instance) {
      if (game) {
        GUI.instance = new GUI(game);
      } else {
        throw new Error("Instance does not exist and game is unspecified.");
      }
    }

    return GUI.instance;
  }

  public getGame(): Game {
    return this.game;
  }

  switchContext(game: Game) {
    this.game = game;
  }

  private getBoardWidth(): number {
    return canvas.width;
  }

  private getBoardHeight(): number {
    return canvas.height;
  }

  private getLocalBoardWidth(): number {
    return this.getBoardWidth() / this.game.getBoard().NUM_COLS;
  }

  private getLocalBoardHeight(): number {
    return this.getBoardHeight() / this.game.getBoard().NUM_ROWS;
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

  drawLocalBoard(board: LocalBoard, xOffset: number, yOffset: number,
                 boardWidth: number, boardHeight: number) {
    // TODO Magic numbers
    // TODO Repetition
    let cellWidth = boardWidth / board.NUM_COLS;
    let cellHeight = boardHeight / board.NUM_ROWS;
    
    // Highlight board if active, and game has not ended
    if (!this.game.ended() &&
        this.game.getBoard().getActiveBoards().includes(board)) {
      this.fillRect(xOffset, yOffset, boardWidth, boardHeight,
                    GUIData.activeColour);
    }

    // Draw frame
    for (let i = 1; i < board.NUM_ROWS; i++) {
      let y = i * boardHeight / board.NUM_ROWS;
      this.drawLine(xOffset, y + yOffset, boardWidth + xOffset, y + yOffset,
                    GUIData.localFrameColour, GUIData.localFrameThickness);
    }

    for (let i = 1; i < board.NUM_COLS; i++) {
      let x = i * boardWidth / board.NUM_COLS;
      this.drawLine(x + xOffset, yOffset, x + xOffset, boardHeight + yOffset,
                    GUIData.localFrameColour, GUIData.localFrameThickness);
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

    let localBoardWidth = this.getLocalBoardWidth();
    let localBoardHeight = this.getLocalBoardHeight();

    let cellWidth = localBoardWidth / board.NUM_COLS;
    let cellHeight = localBoardHeight / board.NUM_ROWS;

    // Draw local boards
    for (let i = 0; i < board.NUM_ROWS; i++) {
      for (let j = 0; j < board.NUM_COLS; j++) {
        this.drawLocalBoard(board.getLocalBoard(i, j), localBoardWidth * j,
                            localBoardHeight * i, localBoardWidth, 
                            localBoardHeight);
      }
    }

    // Draw frame
    for (let i = 1; i < board.NUM_ROWS; i++) {
      let y = i * this.getBoardHeight() / board.NUM_ROWS;
      this.drawLine(0, y, this.getBoardWidth(), y, GUIData.globalFrameColour,
                    GUIData.globalFrameThickness);
    }

    for (let i = 1; i < board.NUM_COLS; i++) {
      let x = i * this.getBoardWidth() / board.NUM_COLS;
      this.drawLine(x, 0, x, this.getBoardHeight(), GUIData.globalFrameColour,
                    GUIData.globalFrameThickness);
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

    // Draw unconfirmed move (on mouse hover)
    let unconfirmedMove = board.getUnconfirmedMove();

    // Draw if this move exists
    if (unconfirmedMove) {
      let cellValue = unconfirmedMove.cell.getValue();
      let image = cellValue === MarkType.O ? img.o : img.x;

      let outerRow = Math.floor(unconfirmedMove.globalIndex / board.NUM_COLS);
      let outerCol = unconfirmedMove.globalIndex % board.NUM_COLS;
      let innerRow = Math.floor(unconfirmedMove.localIndex / board.NUM_COLS);
      let innerCol = unconfirmedMove.localIndex % board.NUM_COLS;

      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.drawImage(image,
                    localBoardWidth * outerCol + cellWidth * innerCol,
                    localBoardHeight * outerRow + cellHeight * innerRow,
                    cellWidth, cellHeight);
      ctx.restore();
    }
  }

  refresh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawGlobalBoard();
  }

  private getPositionOnBoard(x: number, y: number): BoardPosition {
    let board = this.game.getBoard();

    let localBoardWidth = this.getLocalBoardHeight();
    let localBoardHeight = this.getLocalBoardWidth();

    let row = Math.floor(y / localBoardHeight);
    let col = Math.floor(x / localBoardWidth);

    let globalIndex = row * board.NUM_COLS + col;

    // TODO Magic numbers
    // Assume all local boards have same number of rows / columns
    let cellWidth = localBoardWidth / 3;
    let cellHeight = localBoardHeight / 3;

    let innerRow = Math.floor((y % localBoardHeight) / cellHeight);
    let innerCol = Math.floor((x % localBoardWidth) / cellWidth);

    let localIndex = innerRow * 3 + innerCol;

    return {
      globalIndex: globalIndex,
      localIndex: localIndex
    }
  }

  private startObservables() {
    canvas.addEventListener("mousemove", e => {
      if (this.game.ended()) {
        return;
      }

      // Ignore user commands if current player is not a human
      if (this.game.getCurrentPlayer().isBot()) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      let pos = this.getPositionOnBoard(e.clientX - rect.left,
                                        e.clientY - rect.top);
      let cell = new LocalCell();
      cell.setValue(this.game.getCurrentPlayer().getMarkType());

      this.game.getBoard().setUnconfirmedMove({
        cell: cell,
        globalIndex: pos.globalIndex,
        localIndex: pos.localIndex
      });

      // Update
      this.refresh();
    });

    canvas.addEventListener("mousedown", e => {
      if (this.game.ended()) {
        return;
      }

      // Ignore user commands if current player is not a human
      if (this.game.getCurrentPlayer().isBot()) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      let pos = this.getPositionOnBoard(e.clientX - rect.left,
                                        e.clientY - rect.top);

      this.game.performTurn(pos.globalIndex, pos.localIndex);

      // Update
      this.refresh();
    });

    // Force refresh (useful for AIs)
    canvas.addEventListener("refresh", _ => {
      this.refresh();
    });

    // Config
    const configButton = <HTMLElement> document.getElementById("config-button");

    configButton.addEventListener("click", _ => {
      let checkedX = <HTMLElement> document.querySelector(
        "input[name='radio-player-x']:checked");
      let checkedO = <HTMLElement> document.querySelector(
        "input[name='radio-player-o']:checked");

      let playerCross: Player = new PlayerHuman(MarkType.X);
      let playerNought: Player = new PlayerHuman(MarkType.O);

      // TODO Write a function for this and pass in MarkType
      if (checkedX.id.includes("ai")) playerCross = new PlayerAIRandom(MarkType.X);
      if (checkedO.id.includes("ai")) playerNought = new PlayerAIRandom(MarkType.O);

      switchContextToNewGame(playerCross, playerNought);
    });
  }
}
