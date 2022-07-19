class PlayerAISmartRandomFeedback extends PlayerAI {
  private movesWithEval!: MoveWithPlayouts[];
  private moveChosen!: boolean;

  constructor(markType: MarkType) {
    super(markType);
  }

  // Deprecated - use moveWithRandomFeedback instead
  // Evaluate position of a board by smart random playouts
  // 1 -> perfect for X
  // 0 -> perfect for O
  private evaluateBoard(board: GlobalBoard, currentMarkType: MarkType,
                        numPlayouts: number = 100): number {
    let absScore = 0;

    for (let i = 0; i < numPlayouts; i++) {
      // Simulate game until it ends
      let status = this.simulatePlayout(board, currentMarkType);

      if (status === BoardStatus.CrossWin) absScore++;
      if (status === BoardStatus.Draw)     absScore += 0.5;
    }

    return absScore / numPlayouts;
  }

  protected executeBefore(boardCopy: GlobalBoard): void {
    this.movesWithEval = [];
    this.moveChosen = false;

    let moves = this.getValidMovesThatDoNotLose(boardCopy);
    this.movesWithEval = moves.map(move => new MoveWithPlayouts(move));
  }

  protected executeSingleIterCalc(boardCopy: GlobalBoard): void {
    if (this.moveChosen) {
      return;
    }

    let winningMove = this.getMoveThatWinsGame(boardCopy, this.markType);
    if (winningMove) {
      // Choose winning move if it exists
      this.optimalMove = winningMove;
      this.moveChosen = true;
      return;
    }

    if (this.movesWithEval.length === 0) {
      // We're screwed: all moves immediately lose
      this.optimalMove = this.getValidMoves(boardCopy)[0];
      this.moveChosen = true;
      return;
    }

    // Simulate a single playout for each move and update evaluation
    for (let moveWithEval of this.movesWithEval) {
      // Make move
      let move = moveWithEval.move;
      let boardPrivateCopy = boardCopy.copy();
      boardPrivateCopy.setCellValueWithMove(this.markType, move);
      boardPrivateCopy.updateActiveBoards(move.localIndex);

      // Evaluate board
      let result = this.simulatePlayout(boardPrivateCopy,
                                        this.getOtherMarkType());
      moveWithEval.update(result);
    }
  }

  protected executeAfter(boardCopy: GlobalBoard): void {
    if (this.moveChosen) {
      return;
    }

    // TODO Refactor duplicate
    if (this.markType === MarkType.X) {
      let bestEval = -Infinity;

      for (let moveWithEval of this.movesWithEval) {
        if (moveWithEval.eval() > bestEval) {
          bestEval = moveWithEval.eval();
          this.optimalMove = moveWithEval.move;
        }
      }
    } else {
      let bestEval = Infinity;

      for (let moveWithEval of this.movesWithEval) {
        if (moveWithEval.eval() < bestEval) {
          bestEval = moveWithEval.eval();
          this.optimalMove = moveWithEval.move;
        }
      }
    }

    // Print information
    for (let moveWithEval of this.movesWithEval) {
      moveWithEval.print();
    }
  }
}
