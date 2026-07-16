export interface LoginFormProps {
  readonly onSubmit: (email: string, password: string) => void;
  readonly isLoading?: boolean;
  readonly error?: string | null;
}
