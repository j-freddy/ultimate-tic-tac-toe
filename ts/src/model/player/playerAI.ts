/*
  PlayerAI

  To create a new AI, you need to implement 3 methods:
  - resetForMove
  - performSingleIterCalc
  - printMoveInformation
*/

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

  // This method must be implemented in a new AI
  // It is called before calcOptimalMove() and is used to reset the AI state
  protected resetForMove(): void {
    throw new Error("resetForMove not implemented.");
  }

  // This is the main method that must be implemented in a new AI
  // The AI must set its chosen move in this.optimalMove within the time frame
  protected performSingleIterCalc(boardCopy: GlobalBoard): void {
    throw new Error("performSingleIterCalc not implemented.");
  }

  private calcOptimalMove(boardCopy: GlobalBoard): ThreadId {
    // TODO 60 frames per second
    return setInterval(() => this.performSingleIterCalc(boardCopy), 1000 / 60);
  }

  // This is an optional method for a new AI
  // It is used to print a summary regarding the move choice
  protected printMoveInformation(): void {
    return;
  }

  chooseMove(boardCopy: GlobalBoard): Promise<BoardPosition> {
    this.resetForMove();
    const calcMoveThreadId = this.calcOptimalMove(boardCopy);

    return new Promise((resolve, reject) => {
      // TODO Currently set AI think time to 1000 milliseconds
      setTimeout(() => {
        if (this.deprecated) {
          reject();
        } else {
          clearInterval(calcMoveThreadId);
          resolve(this.optimalMove);
          this.printMoveInformation();
        }
      }, 1000);
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
