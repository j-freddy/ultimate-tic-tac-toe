class LocalBoard extends Board implements Cell {
  private readonly index: number;

  constructor(index: number, cells: Cell[] = LocalBoard.createEmptyCells(),
              status: BoardStatus = BoardStatus.InProgress) {
    super(status);

    this.index = index;
    this.cells = cells;
  }

  static createEmptyCells(): LocalCell[] {
    let cells = [];

    for (let i = 0; i < Board.NUM_CELLS; i++) {
      cells.push(new LocalCell());
    }

    return cells;
  }

  getIndex(): number {
    return this.index;
  }

  setCellValue(value: MarkType, index: number): void {
    if (this.status !== BoardStatus.InProgress) {
      throw new Error("Trying to set cell of finished board.");
    }

    // Cell already has a value
    if (this.cells[index].getValue()) {
      throw new Error("Trying to set non-empty cell.");
    }

    this.cells[index].setValue(value);
    this.updateAndGetStatus();
  }

  getValue(): MarkType | null {
    if (this.status === BoardStatus.NoughtWin) return MarkType.O;
    if (this.status === BoardStatus.CrossWin)  return MarkType.X;
    
    return null;
  }

  setValue(value: MarkType): void {
    throw new Error("Trying to set value of board.");
  }

  copy(): LocalBoard {
    let cellsCopy = (<LocalCell[]> this.cells).map(c => c.copy());
    return new LocalBoard(this.index, cellsCopy, this.status);
  }
}
