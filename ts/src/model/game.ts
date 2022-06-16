class Game {
  private readonly board: GlobalBoard;
  private readonly playerNought: Player;
  private readonly playerCross: Player;

  private currentPlayer: Player;

  constructor(playerCross: Player = new PlayerHuman(MarkType.X),
              playerNought: Player = new PlayerHuman(MarkType.O)) {
    this.board = new GlobalBoard();
    this.playerCross = playerCross;
    this.playerNought = playerNought;
    
    this.currentPlayer = this.playerCross;

    this.launchAIIfNeeded();
  }

  getBoard(): GlobalBoard {
    return this.board;
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  setDeprecated(): void {
    // Notify AIs that they are deprecated
    this.playerCross.setDeprecated();
    this.playerNought.setDeprecated();
  }

  private switchPlayer(): Player {
    if (this.currentPlayer === this.playerNought) {
      this.currentPlayer = this.playerCross;
    } else {
      this.currentPlayer = this.playerNought;
    }

    return this.currentPlayer;
  }

  ended(): boolean {
    return this.board.getStatus() !== BoardStatus.InProgress;
  }

  private makeMove(globalIndex: number, localIndex: number): boolean {
    try {
      if (this.ended()) {
        throw new Error("Trying to make a move when game has ended.");
      }

      this.board.setCellValue(this.currentPlayer.getMarkType(), globalIndex,
                              localIndex);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  performTurn(globalIndex: number, localIndex: number): void {
    let valid = this.makeMove(globalIndex, localIndex);

    if (!valid) {
      return;
    }

    // Refresh UI when AI makes move
    if (this.currentPlayer.isBot()) {
      // TODO Decouple canvas from model
      canvas.dispatchEvent(new Event("refresh"));
    }

    if (this.ended()) {
      console.log("Game ended!");
      return;
    }

    this.switchPlayer();
    this.board.updateActiveBoards(localIndex);
    this.launchAIIfNeeded();
  }

  // Launch AI if it needs to make the next move
  private launchAIIfNeeded(): void {
    if (this.currentPlayer.isBot()) {
      this.currentPlayer.chooseMove(this.board.copy())
        .then(move => {
          this.performTurn(move.globalIndex, move.localIndex);
        })
        .catch(err => console.log(err));
    }
  }
}
