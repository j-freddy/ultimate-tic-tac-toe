class Game {
  private readonly board: GlobalBoard;
  private readonly playerNought: Player;
  private readonly playerCross: Player;

  private currentPlayer: Player;

  constructor() {
    this.board = new GlobalBoard();
    this.playerCross = new PlayerHuman(MarkType.X);
    this.playerNought = new PlayerAIRandom(MarkType.O);

    this.currentPlayer = this.playerCross;
  }

  getBoard(): GlobalBoard {
    return this.board;
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer;
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

    if (this.ended()) {
      console.log("Game ended!");
    } else {
      this.switchPlayer();
      this.board.updateActiveBoards(localIndex);
    }

    // Launch AI if it needs to make the next move
    if (this.currentPlayer.isBot()) {
      this.currentPlayer.chooseMove(this.board.copy())
        .then(move => {
          this.performTurn(move.globalIndex, move.localIndex);
        })
        .catch(err => console.log(err));
    }
  }
}
