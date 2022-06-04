class GlobalBoard extends Board {
  constructor() {
    super();

    this.cells = [];

    for (let i = 0; i < this.NUM_CELLS; i++) {
      this.cells.push(new LocalBoard());
    }
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
    this.getLocalBoardByIndex(globalIndex).setCellValue(value, localIndex);
  }
}
