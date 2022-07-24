/*
  rawScore:
  - 1 -> perfect for X
  - 0 -> perfect for O
*/
class MoveWithPlayouts {
  readonly move: BoardPosition;
  readonly boardBeforeMove?: GlobalBoard;
  readonly markType?: MarkType;
  private rawScore: number;
  private numPlayouts: number;

  constructor(move: BoardPosition,
              boardBeforeMove?: GlobalBoard,
              markType?: MarkType) {
    this.move = move;
    this.rawScore = 0;
    this.numPlayouts = 0;
    this.boardBeforeMove = boardBeforeMove;
    this.markType = markType;
  }

  getRawScore(): number {
    return this.rawScore;
  }

  getNumPlayouts(): number {
    return this.numPlayouts;
  }

  eval(): number {
    if (this.numPlayouts === 0) {
      return 0;
    }

    return this.rawScore / this.numPlayouts;
  }

  update(result: BoardStatus): void {
    this.numPlayouts++;

    if (result === BoardStatus.CrossWin) this.rawScore++;
    if (result === BoardStatus.Draw)     this.rawScore += 0.5;
  }

  updateAccumulate(rawScore: number, numPlayouts: number) {
    this.rawScore += rawScore;
    this.numPlayouts += numPlayouts;
  }

  // DEPRECATED Use toString
  print(): void {
    console.log(`Move: (${this.move.globalIndex}, ${this.move.localIndex})`);
    console.log(`Raw score: ${this.rawScore}`);
    console.log(`Number of playouts: ${this.numPlayouts}`);
    console.log(`Evaluation: ${this.eval()}`);
  }

  toString(): string {
    return `Move: (${this.move.globalIndex}, ${this.move.localIndex})\n` +
           `Raw score: ${this.rawScore}\n` +
           `Number of playouts: ${this.numPlayouts}\n` +
           `Evaluation: ${this.eval()}`;
  }
}
