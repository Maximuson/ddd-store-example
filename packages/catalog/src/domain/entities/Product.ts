import { Money } from '@ddd-store/shared';

export interface ProductProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  createdAt: Date;
}

export class Product {
  private constructor(
    private readonly id: string,
    private readonly title: string,
    private readonly description: string,
    private readonly price: Money,
    private readonly image: string,
    private readonly category: string,
    private readonly createdAt: Date,
  ) {}

  static create(props: ProductProps): Product {
    return new Product(
      props.id,
      props.title,
      props.description,
      Money.create(props.price),
      props.image,
      props.category,
      props.createdAt,
    );
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getDescription(): string {
    return this.description;
  }

  getPrice(): Money {
    return this.price;
  }

  getImage(): string {
    return this.image;
  }

  getCategory(): string {
    return this.category;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  toJSON(): ProductProps {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      price: this.price.getAmount(),
      image: this.image,
      category: this.category,
      createdAt: this.createdAt,
    };
  }
}
