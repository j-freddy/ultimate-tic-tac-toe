class PlayerAIRandom implements Player {
  private readonly markType: MarkType;
  private optimalMove: BoardPosition;
  private deprecated: boolean;

  constructor(markType: MarkType) {
    this.markType = markType;
    // TODO Spaghetti
    this.optimalMove = {
      globalIndex: 0,
      localIndex: 0
    }
    this.deprecated = false;
  }

  getMarkType(): MarkType {
    return this.markType;
  }

  isBot(): boolean {
    return true;
  }

  private getValidMoves(board: GlobalBoard): BoardPosition[] {
    let validMoves: BoardPosition[] = [];

    let activeBoards = board.getActiveBoards();

    for (let localBoard of activeBoards) {
      let cellValues = localBoard.getCellsValues();

      for (let i = 0; i < cellValues.length; i++) {
        // Cell is empty
        if (!cellValues[i]) {
          validMoves.push({
            globalIndex: localBoard.getIndex(),
            localIndex: i
          });
        }
      }
    }

    return validMoves;
  }

  setDeprecated(): void {
    this.deprecated = true;
  }

  chooseMove(boardCopy: GlobalBoard): Promise<BoardPosition> {
    let validMoves = this.getValidMoves(boardCopy);
    this.optimalMove = validMoves[Math.floor(Math.random()*validMoves.length)];

    return new Promise((resolve, reject) => {
      // TODO Currently set AI think time to 500 seconds
      setTimeout(() => {
        if (this.deprecated) {
          reject();
        } else {
          resolve(this.optimalMove);
        }
      }, 500);
    });
  }
}
