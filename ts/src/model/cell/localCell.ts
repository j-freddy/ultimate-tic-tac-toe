class LocalCell implements Cell {
  private value: MarkType | null;

  constructor(value: MarkType | null = null) {
    this.value = value;
  }
  
  getValue(): MarkType | null {
    return this.value;
  }
  setValue(value: MarkType): void {
    this.value = value;
  }

  copy(): LocalCell {
    return new LocalCell(this.value);
  }
}
