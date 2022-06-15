class PlayerHuman implements Player {
  private readonly markType: MarkType;

  constructor(markType: MarkType) {
    this.markType = markType;
  }

  getMarkType(): MarkType {
    return this.markType;
  }

  isBot(): boolean {
    return false;
  }

  setDeprecated(): void {
    // Do nothing
  }

  chooseMove(boardCopy: GlobalBoard): Promise<BoardPosition> {
    throw new Error("chooseMove called on human player.");
  }
}
