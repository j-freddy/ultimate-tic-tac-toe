/*
  PlayerAI

  To create a new AI, you need to implement 3 methods:
  - executeBefore (optional)
    This is called before startCalcMoveThread(). It is used to reset and prepare
    the AI properties.
  - exeecuteSingleIterCalc
    This is repeatedly called until the time limit.
  - executeAfter (optional)
    This is called when the time limit is reached. It is used to ensure a move
    is chosen. It is also an opportunity for the AI to print summary statistics.
*/
abstract class PlayerAI implements Player {
  private readonly MAX_FPS = 60;
  private readonly TIME_LIMIT = 2000; // Think time in milliseconds

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

  protected executeBefore(boardCopy: GlobalBoard): void {

  }

  protected executeSingleIterCalc(boardCopy: GlobalBoard): void {
    throw new Error("executeSingleIterCalc not implemented.");
  }

  protected executeAfter(boardCopy: GlobalBoard): void {

  }

  private startCalcMoveThread(boardCopy: GlobalBoard): ThreadId {
    return setInterval(() => this.executeSingleIterCalc(boardCopy),
      1000 / this.MAX_FPS);
  }

  chooseMove(boardCopy: GlobalBoard): Promise<BoardPosition> {
    this.executeBefore(boardCopy);
    const calcMoveThreadId = this.startCalcMoveThread(boardCopy);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.deprecated) {
          reject();
        } else {
          clearInterval(calcMoveThreadId);
          this.executeAfter(boardCopy);
          resolve(this.optimalMove);
        }
      }, this.TIME_LIMIT);
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
