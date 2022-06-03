class LocalCell implements Cell {
  private value: CellValue;

  constructor() {
    this.value = CellValue.Empty;
  }
  
  getValue(): CellValue {
    return this.value;
  }
  setValue(value: CellValue): void {
    this.value = value;
  }

  isEmpty(): boolean {
    return this.value === CellValue.Empty;
  }
}
