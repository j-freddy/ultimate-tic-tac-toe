class MoveWithRandomFeedback {
  readonly move: BoardPosition;
  private rawScore: number;
  private numPlayouts: number;

  constructor(move: BoardPosition) {
    this.move = move;
    this.rawScore = 0;
    this.numPlayouts = 0;
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

  print(): void {
    console.log(`Move: (${this.move.globalIndex}, ${this.move.localIndex})`);
    console.log(`Raw score: ${this.rawScore}`);
    console.log(`Number of playouts: ${this.numPlayouts}`);
    console.log(`Evaluation: ${this.eval()}`);
  }
}
