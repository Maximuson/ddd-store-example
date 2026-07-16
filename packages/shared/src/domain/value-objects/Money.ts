import { ValidationError } from '../errors';

export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string,
  ) {}

  static create(amount: number, currency = 'USD'): Money {
    if (amount < 0) {
      throw new ValidationError('Price cannot be negative');
    }
    if (!Number.isFinite(amount)) {
      throw new ValidationError('Price must be a finite number');
    }
    return new Money(Math.round(amount * 100) / 100, currency);
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  format(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency,
    }).format(this.amount);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}
