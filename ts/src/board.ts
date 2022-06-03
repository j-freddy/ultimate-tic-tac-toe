abstract class Board {
  protected readonly NUM_ROWS = 3;
  protected readonly NUM_COLS = 3;
  protected readonly NUM_CELLS = 9;
  protected readonly WIN_PATTERNS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]

  protected cells: Cell[] = [];
  protected status: BoardStatus;

  constructor() {
    this.status = BoardStatus.InProgress;
  }

  getStatus(): BoardStatus {
    return this.status;
  }

  updateAndGetStatus(): BoardStatus {
    // Do not update status if board is not in progress
    if (this.status !== BoardStatus.InProgress) {
      console.warn("Attempt to update board status when board is finished.");
      return this.status;
    }

    if (this.checkWin(CellValue.Nought)) {
      this.status = BoardStatus.NoughtWin;
      return this.status;
    }

    if (this.checkWin(CellValue.Cross)) {
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

  getCellValue(index: number): CellValue {
    return this.cells[index].getValue();
  }

  // TODO Refactor to use Player type with player.getValue()
  protected checkWin(playerValue: CellValue): boolean {
    for (let pattern of this.WIN_PATTERNS) {
      if (this.getCellValue(pattern[0]) === playerValue &&
          this.getCellValue(pattern[1]) === playerValue &&
          this.getCellValue(pattern[2]) === playerValue) {
        return true;
      }
    }

    return false;
  }

  protected checkFull(): boolean {
    for (let cell of this.cells) {
      if (cell.getValue() === CellValue.Empty) {
        return false;
      }
    }

    return true;
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
