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
    return this.getBoardWidth() / Board.NUM_COLS;
  }

  private getLocalBoardHeight(): number {
    return this.getBoardHeight() / Board.NUM_ROWS;
  }

  private getCellWidth(): number {
    return this.getLocalBoardWidth() / Board.NUM_COLS;
  }

  private getCellHeight(): number {
    return this.getLocalBoardHeight() / Board.NUM_ROWS;
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
    // Highlight board if active, and game has not ended
    if (!this.game.ended() &&
        this.game.getBoard().getActiveBoards().includes(board)) {
      this.fillRect(xOffset, yOffset, boardWidth, boardHeight,
                    GUIData.activeColour);
    }

    // TODO Repetition
    // Draw frame
    for (let i = 1; i < Board.NUM_ROWS; i++) {
      let y = i * boardHeight / Board.NUM_ROWS;
      this.drawLine(xOffset, y + yOffset, boardWidth + xOffset, y + yOffset,
                    GUIData.localFrameColour, GUIData.localFrameThickness);
    }

    for (let i = 1; i < Board.NUM_COLS; i++) {
      let x = i * boardWidth / Board.NUM_COLS;
      this.drawLine(x + xOffset, yOffset, x + xOffset, boardHeight + yOffset,
                    GUIData.localFrameColour, GUIData.localFrameThickness);
    }

    // Draw Os and Xs
    for (let i = 0; i < Board.NUM_ROWS; i++) {
      for (let j= 0; j < Board.NUM_COLS; j++) {
        let cellValue = board.getCellValue(i, j);

        // Move to next iteration if cell is empty
        if (!cellValue) {
          continue;
        }

        let image = cellValue === MarkType.O ? img.o : img.x;
        
        ctx.drawImage(image, xOffset + this.getCellWidth() * j,
                      yOffset + this.getCellHeight() * i,
                      this.getCellWidth(), this.getCellHeight());
      }
    }
  }

  private drawGlobalBoard() {
    let board = this.game.getBoard();

    // Draw local boards
    for (let i = 0; i < Board.NUM_ROWS; i++) {
      for (let j = 0; j < Board.NUM_COLS; j++) {
        this.drawLocalBoard(board.getLocalBoard(i, j),
                            this.getLocalBoardWidth() * j,
                            this.getLocalBoardHeight() * i,
                            this.getLocalBoardWidth(), 
                            this.getLocalBoardHeight());
      }
    }

    // Draw frame
    for (let i = 1; i < Board.NUM_ROWS; i++) {
      let y = i * this.getBoardHeight() / Board.NUM_ROWS;
      this.drawLine(0, y, this.getBoardWidth(), y, GUIData.globalFrameColour,
                    GUIData.globalFrameThickness);
    }

    for (let i = 1; i < Board.NUM_COLS; i++) {
      let x = i * this.getBoardWidth() / Board.NUM_COLS;
      this.drawLine(x, 0, x, this.getBoardHeight(), GUIData.globalFrameColour,
                    GUIData.globalFrameThickness);
    }

    // Draw Os and Xs
    for (let i = 0; i < Board.NUM_ROWS; i++) {
      for (let j= 0; j < Board.NUM_COLS; j++) {
        let cellValue = board.getCellValue(i, j);

        // Move to next iteration if cell is empty
        if (!cellValue) {
          continue;
        }

        let image = cellValue === MarkType.O ? img.o : img.x;
        
        ctx.drawImage(image, this.getLocalBoardWidth() * j,
                      this.getLocalBoardHeight() * i,
                      this.getLocalBoardWidth(), this.getLocalBoardHeight());
      }
    }

    // Draw unconfirmed move (on mouse hover)
    let unconfirmedMove = board.getUnconfirmedMove();

    // Draw if this move exists
    if (unconfirmedMove) {
      let cellValue = unconfirmedMove.cell.getValue();
      let image = cellValue === MarkType.O ? img.o : img.x;

      let outerRow = Math.floor(unconfirmedMove.globalIndex / Board.NUM_COLS);
      let outerCol = unconfirmedMove.globalIndex % Board.NUM_COLS;
      let innerRow = Math.floor(unconfirmedMove.localIndex / Board.NUM_COLS);
      let innerCol = unconfirmedMove.localIndex % Board.NUM_COLS;

      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.drawImage(image,
                    this.getLocalBoardWidth() * outerCol + this.getCellWidth() * innerCol,
                    this.getLocalBoardHeight() * outerRow + this.getCellHeight() * innerRow,
                    this.getCellWidth(), this.getCellHeight());
      ctx.restore();
    }
  }

  refresh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawGlobalBoard();
  }

  private getPositionOnBoard(x: number, y: number): BoardPosition {
    let localBoardWidth = this.getLocalBoardHeight();
    let localBoardHeight = this.getLocalBoardWidth();

    let row = Math.floor(y / localBoardHeight);
    let col = Math.floor(x / localBoardWidth);

    let globalIndex = row * Board.NUM_COLS + col;

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

  private getPlayerType(buttonId: string):
    typeof PlayerHuman |
    typeof PlayerAIRandom |
    typeof PlayerAISmartRandomFeedback |
    typeof PlayerAIMCTS
  {
    if (buttonId.includes("human")) {
      return PlayerHuman;
    } else if (buttonId.includes("ai-easy")) {
      return PlayerAIRandom;
    } else if (buttonId.includes("ai-medium")) {
      return PlayerAISmartRandomFeedback;
    } else if (buttonId.includes("ai-hard")) {
      return PlayerAIMCTS;
    }

    throw new Error("Unable to identify player type");
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

      let PlayerTypeX = this.getPlayerType(checkedX.id);
      let PlayerTypeO = this.getPlayerType(checkedO.id);

      switchContextToNewGame(new PlayerTypeX(MarkType.X),
                             new PlayerTypeO(MarkType.O));
    });
  }
}
