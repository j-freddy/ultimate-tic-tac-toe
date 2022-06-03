class LocalBoard implements Cell {
  private readonly NUM_ROWS = 3;
  private readonly NUM_COLS = 3;
  private readonly NUM_CELLS = 9;
  private readonly WIN_PATTERNS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]

  private cells: LocalCell[];
  private status: BoardStatus;

  constructor() {
    this.cells = [];

    for (let i = 0; i < this.NUM_CELLS; i++) {
      this.cells.push(new LocalCell());
    }

    this.status = BoardStatus.InProgress;
  }

  getStatus(): BoardStatus {
    return this.status;
  }

  getCellValue(index: number): CellValue {
    return this.cells[index].getValue();
  }

  setCellValue(value: CellValue, index: number): void {
    this.cells[index].setValue(value);
  }

  // TODO Refactor to use Player type with player.getValue()
  checkWin(playerValue: CellValue): boolean {
    for (let pattern of this.WIN_PATTERNS) {
      if (this.getCellValue(pattern[0]) === playerValue &&
          this.getCellValue(pattern[1]) === playerValue &&
          this.getCellValue(pattern[2]) === playerValue) {
        if (playerValue === CellValue.Nought) {
          this.status = BoardStatus.NoughtWin;
        }

        if (playerValue === CellValue.Cross) {
          this.status = BoardStatus.CrossWin;
        }

        return true;
      }
    }

    return false;
  }

  getValue(): CellValue {
    // Use cache
    if (this.status === BoardStatus.NoughtWin) return CellValue.Nought;
    if (this.status === BoardStatus.CrossWin)  return CellValue.Cross;
    if (this.status === BoardStatus.Draw)      return CellValue.Empty;

    // Board was previously in progress

    if (this.checkWin(CellValue.Nought)) {
      return CellValue.Nought;
    }

    if (this.checkWin(CellValue.Cross)) {
      return CellValue.Cross;
    }

    return CellValue.Empty;
  }
  setValue(value: CellValue): void {
    throw new Error("Method not implemented.");
  }

  print(): void {
    let i = 0;
    let str = "";

    for (let x = 0; x < this.NUM_COLS; x++) {
      for (let y = 0; y < this.NUM_ROWS; y++) {
        str += `${this.cells[i].getValue()} `
        i++;
      }
      str += "\n";
    }

    console.log(str);
  }
}
