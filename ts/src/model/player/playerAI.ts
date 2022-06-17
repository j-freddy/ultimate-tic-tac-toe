abstract class PlayerAI implements Player {
  protected readonly markType: MarkType;
  protected optimalMove: BoardPosition;
  protected deprecated: boolean;

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

  setDeprecated(): void {
    this.deprecated = true;
  }

  // This is the ONLY method a new AI has to implement
  // The AI must set its chosen move in this.optimalMove within the time frame
  protected calculateOptimalMove(boardCopy: GlobalBoard): void {
    throw new Error("calculateOptimalMove not implemented.");
  }

  chooseMove(boardCopy: GlobalBoard): Promise<BoardPosition> {
    this.calculateOptimalMove(boardCopy);

    return new Promise((resolve, reject) => {
      // TODO Currently set AI think time to 500 milliseconds
      setTimeout(() => {
        if (this.deprecated) {
          reject();
        } else {
          resolve(this.optimalMove);
        }
      }, 500);
    });
  }

  // The rest of this class consists of useful methods that assist making an AI

  protected getValidMoves(board: GlobalBoard): BoardPosition[] {
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
}
