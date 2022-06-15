interface Player {
  getMarkType(): MarkType;
  isBot(): boolean;
  chooseMove(boardCopy: GlobalBoard): Promise<BoardPosition>;
  setDeprecated(): void;
}
