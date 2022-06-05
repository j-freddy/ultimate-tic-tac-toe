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

  getBoard(): GlobalBoard {
    return this.board;
  }

  private switchPlayer(): Player {
    if (this.currentPlayer === this.playerNought) {
      this.currentPlayer = this.playerCross;
    } else {
      this.currentPlayer = this.playerNought;
    }

    return this.currentPlayer;
  }

  private ended(): boolean {
    return this.board.getStatus() !== BoardStatus.InProgress;
  }

  makeMove(globalIndex: number, localIndex: number): boolean {
    try {
      if (this.ended()) {
        throw new Error("Trying to make a move when game has ended.");
      }

      this.board.setCellValue(this.currentPlayer.getMarkType(), globalIndex,
                              localIndex);

      if (this.ended()) {
        console.log("Game ended!");
      } else {
        this.switchPlayer();
        this.board.updateActiveBoards(localIndex);
      }

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
