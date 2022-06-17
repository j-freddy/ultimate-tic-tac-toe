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
      boardCopy.updateActiveBoards(move.localIndex);

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
      boardCopy.updateActiveBoards(move.localIndex);

      // Check win
      if (boardCopy.getStatus() === this.markTypeToStatus(markType)) {
        return move;
      }
    }

    // No moves win game
    return null;
  }

  private getSmartRandomMove(board: GlobalBoard,
                             markType: MarkType): BoardPosition {
    let winningMove = this.getMoveThatWinsGame(board, this.markType);
    if (winningMove) {
      // Choose winning move if it exists
      return winningMove;
    }

    // Otherwise, choose a move that wins a local board if it exists
    let goodMoves = this.getMovesThatWinsLocalBoard(board, this.markType);
    if (goodMoves.length !== 0) {
      return goodMoves[0];
    }

    let validMoves = this.getValidMoves(board);
    // Otherwise, choose a random move
    return validMoves[Math.floor(Math.random()*validMoves.length)];
  }

  private simulatePlayout(board: GlobalBoard,
                          currentMarkType: MarkType): BoardStatus {
    let boardCopy = board.copy();

    // Simulate game until it ends
    while (boardCopy.getStatus() === BoardStatus.InProgress) {
      let move = this.getSmartRandomMove(boardCopy, currentMarkType);

      boardCopy.setCellValue(currentMarkType, move.globalIndex,
                             move.localIndex);
      boardCopy.updateActiveBoards(move.localIndex);

      // Switch player
      currentMarkType = currentMarkType === MarkType.O ?
                        MarkType.X : MarkType.O;
    }

    return boardCopy.getStatus();
  }

  // Evaluate position of a board by smart random playouts
  // 1 -> perfect for X
  // 0 -> perfect for O
  private evaluateBoard(board: GlobalBoard, currentMarkType: MarkType): number {
    const PLAYOUTS = 100;
    let absScore = 0;

    for (let i = 0; i < PLAYOUTS; i++) {
      // Simulate game until it ends
      let status = this.simulatePlayout(board, currentMarkType);

      if (status === BoardStatus.CrossWin) absScore++;
      if (status === BoardStatus.Draw)     absScore += 0.5;
    }

    return absScore / PLAYOUTS;
  }

  protected calculateOptimalMove(boardCopy: GlobalBoard): void {
    this.optimalMove = this.getSmartRandomMove(boardCopy, this.markType);

    // TODO Delete
    let evaluation = this.evaluateBoard(boardCopy, this.markType);
    console.log(evaluation);
  }
}
