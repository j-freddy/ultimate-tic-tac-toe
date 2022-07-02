class PlayerAIRandom extends PlayerAI {
  private moveChosen: boolean;

  constructor(markType: MarkType) {
    super(markType);
    this.moveChosen = false;
  }

  protected resetForMove(): void {
    this.moveChosen = false;
  }

  protected performSingleIterCalc(boardCopy: GlobalBoard): void {
    console.log("Perform iter.");

    if (this.moveChosen) {
      return;
    }

    let validMoves = this.getValidMoves(boardCopy);
    this.optimalMove = validMoves[Math.floor(Math.random()*validMoves.length)];
    this.moveChosen = true;
    console.log("Chosen move.");
  }
}
