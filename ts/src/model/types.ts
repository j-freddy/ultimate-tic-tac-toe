type BoardPosition = {
  globalIndex: number;
  localIndex: number;
}

type CellWithPosition = {
  cell: Cell;
  globalIndex: number;
  localIndex: number;
};

type MoveWithEvaluation = {
  move: BoardPosition;
  eval: number;
}

type ThreadId = number;
