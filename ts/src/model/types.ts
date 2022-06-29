type CellWithPosition = {
  cell: Cell;
  globalIndex: number;
  localIndex: number;
};

type BoardPosition = {
  globalIndex: number;
  localIndex: number;
}

type MoveWithEvaluation = {
  move: BoardPosition;
  eval: number;
}
