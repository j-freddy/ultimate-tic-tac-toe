class PlayerAIMinimaxMCTS extends PlayerAI {
  constructor(markType: MarkType) {
    super(markType);
  }

  // Get move that wins game immediately
  private getMoveThatWinsGame(board: GlobalBoard,
                              markType: MarkType): BoardPosition | null {
    for (let move of this.getValidMoves(board)) {
      // Copy board state and make move
      let boardCopy = board.copy();
      boardCopy.setCellValue(markType, move.globalIndex, move.localIndex);

      // Check win
      let statusWin = markType === MarkType.O ?
                      BoardStatus.NoughtWin : BoardStatus.CrossWin;

      if (boardCopy.getStatus() === statusWin) {
        return move;
      }
    }

    // No moves win game
    return null;
  }

  protected calculateOptimalMove(boardCopy: GlobalBoard): void {
    let validMoves = this.getValidMoves(boardCopy);
    this.optimalMove = validMoves[Math.floor(Math.random()*validMoves.length)];
  }
}
