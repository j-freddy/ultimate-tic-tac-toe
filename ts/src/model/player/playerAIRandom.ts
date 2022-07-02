class PlayerAIRandom extends PlayerAI {
  private moveChosen!: boolean;

  constructor(markType: MarkType) {
    super(markType);
  }

  protected executeBefore(boardCopy: GlobalBoard): void {
    this.moveChosen = false;
  }

  protected executeSingleIterCalc(boardCopy: GlobalBoard): void {
    if (this.moveChosen) {
      return;
    }

    let validMoves = this.getValidMoves(boardCopy);
    this.optimalMove = validMoves[Math.floor(Math.random()*validMoves.length)];
    this.moveChosen = true;
  }
}
