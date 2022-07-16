class PlayerAIMCTS extends PlayerAI {
  private readonly SEARCH_DEPTH = 3;
  private moveChosen!: boolean;
  private head!: TreeNode<MoveWithPlayouts>;

  constructor(markType: MarkType) {
    super(markType);
  }

  protected executeBefore(boardCopy: GlobalBoard): void {
    this.moveChosen = false;

    // Create tree head
    this.head = new TreeNode<MoveWithPlayouts>();

    // Create tree body
    let prevDepthNodes = [this.head];
    let currDepthNodes = [];

    for (let i = 0; i < this.SEARCH_DEPTH; i++) {
      for (let moveNode of prevDepthNodes) {
        // Current board
        let board: GlobalBoard;

        if (i === 0) {
          board = boardCopy;
        } else {
          let moveWithEval = moveNode.value!;
          board = moveWithEval.boardBeforeMove!; 
          board.setCellValueWithMove(moveWithEval.markType!, moveWithEval.move);
          board.updateActiveBoards(moveWithEval.move.localIndex);
        }

        let moves = this.getValidMovesThatDoNotLose(board);

        // When i = 0, it is our move
        // Players take turns moving
        let markType = (i % 2 === 0) ? this.markType : this.getOtherMarkType();

        let children = moves.map(move => {
          return new TreeNode(
            new MoveWithPlayouts(move, board.copy(), markType)
          );
        });

        moveNode.setChildren(children);
        currDepthNodes.push(...children);
      }

      prevDepthNodes = currDepthNodes;
      currDepthNodes = [];
    }

    // TODO Delete test

    console.log(this.head.size());

    console.log(this.head.getChildren());

    let moveOne = this.head.getChildren()[80];
    let moveTwo = moveOne.getChildren()[2];
    let moveThree = moveTwo.getChildren()[7];

    console.log(moveOne.getChildren());
    console.log(moveTwo.getChildren());

    let m1 = moveOne.value!;
    let m2 = moveTwo.value!;
    let m3 = moveThree.value!;

    boardCopy.setCellValueWithMove(m1.markType!, m1.move);
    boardCopy.setCellValueWithMove(m2.markType!, m2.move);
    boardCopy.setCellValueWithMove(m3.markType!, m3.move);

    boardCopy.print();
  }

  protected executeSingleIterCalc(boardCopy: GlobalBoard): void {
    if (this.moveChosen) {
      return;
    }

    let validMoves = this.getValidMoves(boardCopy);
    this.optimalMove = validMoves[Math.floor(Math.random()*validMoves.length)];
    this.moveChosen = true;
  }
}
