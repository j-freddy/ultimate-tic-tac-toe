class GlobalBoard extends Board {
  constructor() {
    super();

    this.cells = [];

    for (let i = 0; i < this.NUM_CELLS; i++) {
      this.cells.push(new LocalBoard());
    }
  }

  getLocalBoard(index: number): LocalBoard {
    return <LocalBoard> <unknown> this.cells[index];
  }

  setCellValue(value: MarkType, globalIndex: number,
               localIndex: number): void {
    this.getLocalBoard(globalIndex).setCellValue(value, localIndex);
  }
}
