class PlayerAIMCTS extends PlayerAI {
  private moveChosen!: boolean;
  private head!: TreeNode<MoveWithPlayouts>;

  constructor(markType: MarkType) {
    super(markType);
  }

  protected executeBefore(boardCopy: GlobalBoard): void {
    this.moveChosen = false;

    // Build initial tree as a head with valid next moves as children
    this.head = new TreeNode(new MoveWithPlayouts(
      // TODO Spaghetti
      { globalIndex: -1, localIndex: -1 },
      boardCopy.copy()
    ));

    const moves = this.getValidMovesThatDoNotLose(boardCopy);
    const children = moves.map(move => {
      return new TreeNode(
        new MoveWithPlayouts(move, boardCopy.copy(), this.markType)
      );
    });

    this.head.setChildren(children);
  }

  private calcUCT(child: TreeNode<MoveWithPlayouts>,
                  parent: TreeNode<MoveWithPlayouts>): number {
    const childPlayouts = child.value!.getNumPlayouts();

    if (childPlayouts === 0) {
      return Infinity;
    }

    const parentPlayouts = parent.value!.getNumPlayouts();
    return child.value!.eval(true) + 2 * Math.sqrt(
      Math.log(parentPlayouts) / childPlayouts
    );
  }

  private getChildWithTopUCT(parent: TreeNode<MoveWithPlayouts>) {
    if (parent.getChildren().length == 0) {
      throw new Error("Trying to get top UCT child of a childless node");
    }

    let topChild = parent.getChildren()[0];
    let topScore = -Infinity;

    for (const child of parent.getChildren()) {
      const score = this.calcUCT(child, parent);

      if (score > topScore) {
        topChild = child;
        topScore = score;
      }
    }

    console.log(`Top score: ${topScore}`)
    return topChild;
  }

  protected executeSingleIterCalc(boardCopy: GlobalBoard): void {
    if (this.moveChosen) {
      return;
    }

    // TODO DELETE
    let validMoves = this.getValidMoves(boardCopy);
    this.optimalMove = validMoves[Math.floor(Math.random()*validMoves.length)];
    this.moveChosen = true;
    // TODO END OF DELETE

    // Selection
    let currNode = this.head;
    let currMarkType = this.markType;

    while (!currNode.isLeaf()) {
      currNode = this.getChildWithTopUCT(currNode);
      let moveWithEval = currNode.value!;
      console.log(moveWithEval);
      // Update board
      boardCopy.setCellValueWithMove(moveWithEval.markType!, moveWithEval.move);
      boardCopy.updateActiveBoards(moveWithEval.move.localIndex);
      // Keep track of mark type
      currMarkType = this.getOtherMarkType(currMarkType);
    }

    // Expansion
    if (currNode.value!.getNumPlayouts() > 0) {
      const moves = this.getValidMovesThatDoNotLose(boardCopy);
      const children = moves.map(move => {
        return new TreeNode(
          new MoveWithPlayouts(move, boardCopy.copy(), currMarkType)
        );
      });
      currNode.setChildren(children);

      if (children.length > 0) {
        currNode = children[0];
        const moveWithEval = currNode.value!;
        // Update board
        boardCopy.setCellValueWithMove(
          moveWithEval.markType!, moveWithEval.move
        );
        boardCopy.updateActiveBoards(moveWithEval.move.localIndex);
        // Keep track of mark type
        currMarkType = this.getOtherMarkType(currMarkType);
      }
    }

    // Simulation
    const chosenNode = currNode;
    const result = this.simulatePlayout(boardCopy, currMarkType);
    chosenNode.value!.update(result);

    // Backpropagation
    // TODO Update TreeNode with parent
    // Or keep track of parents (use a stack, pop & push from end)
    console.log(chosenNode.value!);
  }
}
