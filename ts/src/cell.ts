interface Cell {
  getValue(): MarkType | null;
  setValue(value: MarkType): void;
}
