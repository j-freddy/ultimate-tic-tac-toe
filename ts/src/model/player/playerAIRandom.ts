class PlayerAIRandom extends PlayerAI {
  constructor(markType: MarkType) {
    super(markType);
  }

  protected calculateOptimalMove(boardCopy: GlobalBoard): void {
    let validMoves = this.getValidMoves(boardCopy);
    this.optimalMove = validMoves[Math.floor(Math.random()*validMoves.length)];
  }
}
