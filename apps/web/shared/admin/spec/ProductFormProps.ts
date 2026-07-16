import type { CreateProductData } from '@ddd-store/catalog';

export interface ProductFormProps {
  readonly form: CreateProductData;
  readonly isEditing: boolean;
  readonly onChange: (field: keyof CreateProductData, value: string | number) => void;
  readonly onSave: () => void;
  readonly onCancel: () => void;
}
