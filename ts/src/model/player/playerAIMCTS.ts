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

    let evaluation = child.value!.eval(true);
    // Currently we have:
    //   evaluation = 1 -> perfect for X
    //   evaluation = 0 -> perfect for O
    // We need to map this to the following for UCT:
    //   evaluation = 1 -> perfect for AI
    if (this.markType === MarkType.O) {
      evaluation = 1 - evaluation;
    }

    return evaluation + 2 * Math.sqrt(
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

    return topChild;
  }

  private executeMCTSIter(boardCopy: GlobalBoard): void {
    // Selection
    let currNode = this.head;
    let currMarkType = this.markType;
    // Keep track of parents for backpropagation
    let parents: TreeNode<MoveWithPlayouts>[] = [];

    while (!currNode.isLeaf()) {
      parents.push(currNode);
      currNode = this.getChildWithTopUCT(currNode);
      let moveWithEval = currNode.value!;
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
        parents.push(currNode);
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
    for (let node of parents) {
      node.value!.update(result);
    }
  }

  protected executeSingleIterCalc(boardCopy: GlobalBoard): void {
    if (this.moveChosen) {
      return;
    }

    // TODO Magic number
    for (let i = 0; i < 24; i++) {
      let board = boardCopy.copy();
      this.executeMCTSIter(board);
    }
  }

  protected executeAfter(boardCopy: GlobalBoard): void {
    let children = this.head.getChildren();
    let movesWithEval = children.map(node => node.value!);

    // Choose optimal move
    // TODO Refactor duplicate
    if (this.markType === MarkType.X) {
      let bestEval = -Infinity;

      for (let moveWithEval of movesWithEval) {
        if (moveWithEval.eval() > bestEval) {
          bestEval = moveWithEval.eval();
          this.optimalMove = moveWithEval.move;
        }
      }
    } else {
      let bestEval = Infinity;

      for (let moveWithEval of movesWithEval) {
        if (moveWithEval.eval() < bestEval) {
          bestEval = moveWithEval.eval();
          this.optimalMove = moveWithEval.move;
        }
      }
    }

    // Print information
    let str = "";
    for (let moveWithEval of movesWithEval) {
      str += moveWithEval.toString() + "\n\n";
    }
    console.log(str);
    console.log(this.head.size());
  }
}
