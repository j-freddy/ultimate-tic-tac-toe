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
}
