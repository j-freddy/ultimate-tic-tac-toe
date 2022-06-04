class Game {
  private readonly board: GlobalBoard;
  private readonly playerNought: Player;
  private readonly playerCross: Player;

  private currentPlayer: Player;

  constructor() {
    this.board = new GlobalBoard();
    this.playerNought = new PlayerHuman(MarkType.O);
    this.playerCross = new PlayerHuman(MarkType.X);

    this.currentPlayer = this.playerCross;
  }
}
