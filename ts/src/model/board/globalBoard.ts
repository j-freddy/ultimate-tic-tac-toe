class GlobalBoard extends Board {
  // List of boards a player can make a move on
  private activeBoards: LocalBoard[];
  // Potential move a player is considering
  private unconfirmedMove: CellWithPosition | null;

  constructor(cells: Cell[] = [], activeBoards: LocalBoard[] = []) {
    super();

    this.cells = cells;
    // TODO Refactor
    if (this.cells.length === 0) {
      for (let i = 0; i < this.NUM_CELLS; i++) {
        this.cells.push(new LocalBoard(i));
      }
    }

    this.activeBoards = activeBoards;
    // TODO Refactor
    if (activeBoards.length === 0) {
      // Default
      // Shallow copy
      this.activeBoards = <LocalBoard[]> [...this.cells];
    }

    this.unconfirmedMove = null;
  }

  getLocalBoards(): LocalBoard[] {
    return <LocalBoard[]> this.cells;
  }

  getLocalBoard(row: number, col: number): LocalBoard {
    return <LocalBoard> this.cells[row * this.NUM_COLS + col];
  }

  getLocalBoardByIndex(index: number): LocalBoard {
    return <LocalBoard> this.cells[index];
  }

  setCellValue(value: MarkType, globalIndex: number,
               localIndex: number): void {
    if (!this.getActiveBoardsIndices().includes(globalIndex)) {
      throw new Error(`Trying to set cell on non-active board at
                      (${globalIndex}, ${localIndex})`);
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

  updateActiveBoards(index: number): void {
    let nextBoard = this.getLocalBoardByIndex(index);

    if (nextBoard.getStatus() === BoardStatus.InProgress) {
      this.activeBoards = [nextBoard];
    } else {
      this.activeBoards = this.getBoardsInProgress();
    }
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

    return new GlobalBoard(boardsCopy, activeBoards);
  }
}
