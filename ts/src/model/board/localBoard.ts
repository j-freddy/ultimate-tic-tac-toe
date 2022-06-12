class LocalBoard extends Board implements Cell {
  private readonly index: number;

  constructor(index: number, cells: Cell[] = []) {
    super();

    this.index = index;
    this.cells = cells;
    // TODO Refactor (make constructor call static method after refactoring
    // Board.ROWS to be static)
    if (this.cells.length === 0) {
      for (let i = 0; i < this.NUM_CELLS; i++) {
        this.cells.push(new LocalCell());
      }
    }
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
    return new LocalBoard(this.index, cellsCopy);
  }
}
