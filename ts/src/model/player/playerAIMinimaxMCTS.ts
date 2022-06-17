class PlayerAIMinimaxMCTS extends PlayerAI {
  constructor(markType: MarkType) {
    super(markType);
  }

  private markTypeToStatus(markType: MarkType) {
    return markType === MarkType.O ?
           BoardStatus.NoughtWin : BoardStatus.CrossWin;
  }

  // Get all moves that wins a local board
  private getMovesThatWinsLocalBoard(board: GlobalBoard,
                                     markType: MarkType): BoardPosition[] {
    let winningMoves = [];

    for (let move of this.getValidMoves(board)) {
      // Copy board state and make move
      let boardCopy = board.copy();
      boardCopy.setCellValue(markType, move.globalIndex, move.localIndex);

      // Check win
      let localBoard = boardCopy.getLocalBoardByIndex(move.globalIndex);
      if (localBoard.getStatus() === this.markTypeToStatus(markType)) {
        winningMoves.push(move);
      }
    }

    return winningMoves;
  }

  // Get move that wins game immediately
  private getMoveThatWinsGame(board: GlobalBoard,
                              markType: MarkType): BoardPosition | null {
    for (let move of this.getValidMoves(board)) {
      // Copy board state and make move
      let boardCopy = board.copy();
      boardCopy.setCellValue(markType, move.globalIndex, move.localIndex);

      // Check win
      if (boardCopy.getStatus() === this.markTypeToStatus(markType)) {
        return move;
      }
    }

    // No moves win game
    return null;
  }

  protected calculateOptimalMove(boardCopy: GlobalBoard): void {
    let validMoves = this.getValidMoves(boardCopy);
    let winningMove = this.getMoveThatWinsGame(boardCopy, this.markType);

    // TODO Delete
    // Choose winning move if exists
    if (winningMove) {
      this.optimalMove = winningMove;
    } else {
      // Otherwise choose move that wins a local board if exists
      let goodMoves = this.getMovesThatWinsLocalBoard(boardCopy, this.markType);

      if (goodMoves.length !== 0) {
        this.optimalMove = goodMoves[0];
      } else {
        // Otherwise choose random move
        this.optimalMove =
          validMoves[Math.floor(Math.random()*validMoves.length)]; 
      }
    }
  }
}
