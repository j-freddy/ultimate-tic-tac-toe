class LocalCell implements Cell {
  private value: MarkType | null;

  constructor() {
    this.value = null;
  }
  
  getValue(): MarkType | null {
    return this.value;
  }
  setValue(value: MarkType): void {
    this.value = value;
  }
}
