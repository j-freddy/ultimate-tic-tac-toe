class LocalBoard extends Board implements Cell {
  constructor() {
    super();

    this.cells = [];

    for (let i = 0; i < this.NUM_CELLS; i++) {
      this.cells.push(new LocalCell());
    }
  }

  setCellValue(value: CellValue, index: number): void {
    if (this.status !== BoardStatus.InProgress) {
      throw new Error("Trying to set cell of finished board.");
    }

    this.cells[index].setValue(value);
    this.updateAndGetStatus();
  }

  getValue(): CellValue {
    if (this.status === BoardStatus.NoughtWin) return CellValue.Nought;
    if (this.status === BoardStatus.CrossWin)  return CellValue.Cross;
    
    return CellValue.Empty;
  }

  setValue(value: CellValue): void {
    throw new Error("Trying to set value of board.");
  }
}
