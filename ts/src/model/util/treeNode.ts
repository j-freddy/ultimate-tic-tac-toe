class TreeNode<Value> {
  readonly value?: Value;
  private children: TreeNode<Value>[];

  constructor(value: Value | undefined = undefined) {
    this.value = value;
    this.children = [];
  }
  
  isLeaf(): boolean {
    return this.children.length === 0;
  }

  getChildren(): TreeNode<Value>[] {
    return this.children;
  }

  setChildren(children: TreeNode<Value>[]): void {
    this.children = children;
  }

  size(): number {
    if (this.isLeaf()) {
      return 1;
    }

    let sum = 1;
    for (let child of this.children) {
      sum += child.size();
    }

    return sum;
  }
}
