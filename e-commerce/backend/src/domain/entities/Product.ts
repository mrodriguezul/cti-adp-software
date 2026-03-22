export class Product {
  constructor(
    public readonly id: number,
    public readonly sku: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly price: number,
    public readonly onhand: number,
    public readonly imageUrl: string | null,
    public readonly status: string
  ) {}

  public isActive(): boolean {
    return this.status === 'A';
  }

  public isInStock(): boolean {
    return this.onhand > 0;
  }

  public toJSON() {
    return {
      id: this.id,
      sku: this.sku,
      name: this.name,
      description: this.description,
      price: this.price,
      onhand: this.onhand,
      imageUrl: this.imageUrl
    };
  }
}