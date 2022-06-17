class GlobalBoard extends Board {
  // List of boards a player can make a move on
  private activeBoards: LocalBoard[];
  // Potential move a player is considering
  private unconfirmedMove: CellWithPosition | null;

  constructor(cells: Cell[] = GlobalBoard.createEmptyBoards(),
              activeBoards: LocalBoard[] = <LocalBoard[]> [...cells],
              status: BoardStatus = BoardStatus.InProgress) {
    super(status);
    this.cells = cells;
    this.activeBoards = activeBoards;
    this.unconfirmedMove = null;
  }

  static createEmptyBoards(): LocalBoard[] {
    let cells = [];

    for (let i = 0; i < Board.NUM_CELLS; i++) {
      cells.push(new LocalBoard(i));
    }

    return cells;
  }

  getLocalBoards(): LocalBoard[] {
    return <LocalBoard[]> this.cells;
  }

  getLocalBoard(row: number, col: number): LocalBoard {
    return <LocalBoard> this.cells[row * Board.NUM_COLS + col];
  }

  getLocalBoardByIndex(index: number): LocalBoard {
    return <LocalBoard> this.cells[index];
  }

  setCellValue(value: MarkType, globalIndex: number,
               localIndex: number): void {
    if (!this.getActiveBoardsIndices().includes(globalIndex)) {
      throw new Error(`Trying to set cell on non-active board at ` +
                      `(${globalIndex}, ${localIndex}).`);
    }
    
    this.getLocalBoardByIndex(globalIndex).setCellValue(value, localIndex);
    this.updateAndGetStatus();
  }

  getBoardsInProgress(): LocalBoard[] {
    return this.getLocalBoards()
               .filter(board => board.getStatus() === BoardStatus.InProgress);
  }

  getActiveBoards(): LocalBoard[] {
    return this.activeBoards;
  }

  getActiveBoardsIndices(): number[] {
    return this.activeBoards.map(board => board.getIndex());
  }

  getUnconfirmedMove(): CellWithPosition | null {
    return this.unconfirmedMove;
  }

  setUnconfirmedMove(cellWithPosition: CellWithPosition): void {
    this.unconfirmedMove = cellWithPosition;
  }

  resetUnconfirmedMove(): void {
    this.unconfirmedMove = null;
  }

  protected checkFull(): boolean {
    return this.getBoardsInProgress().length === 0;
  }

  updateActiveBoards(index: number): void {
    let nextBoard = this.getLocalBoardByIndex(index);

    if (nextBoard.getStatus() === BoardStatus.InProgress) {
      this.activeBoards = [nextBoard];
    } else {
      this.activeBoards = this.getBoardsInProgress();
    }
  }

  // TODO Duplicate
  // This uses a different checkFull function
  updateAndGetStatus(): BoardStatus {
    // Do not update status if board is not in progress
    if (this.status !== BoardStatus.InProgress) {
      console.warn("Attempt to update board status when board is finished.");
      return this.status;
    }

    if (this.checkWin(MarkType.O)) {
      this.status = BoardStatus.NoughtWin;
      return this.status;
    }

    if (this.checkWin(MarkType.X)) {
      this.status = BoardStatus.CrossWin;
      return this.status;
    }

    if (this.checkFull()) {
      this.status = BoardStatus.Draw;
      return this.status;
    }

    this.status = BoardStatus.InProgress;
    return this.status;
  }
  
  copy(): GlobalBoard {
    let boardsCopy = (<LocalBoard[]> this.cells).map(c => c.copy());
    let activeIndices = this.getActiveBoardsIndices();
    let activeBoards: LocalBoard[] = [];

    for (let board of boardsCopy) {
      if (activeIndices.includes(board.getIndex())) {
        activeBoards.push(board);
      }
    }

    return new GlobalBoard(boardsCopy, activeBoards, this.status);
  }
}
