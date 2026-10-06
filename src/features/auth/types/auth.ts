export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
};

export type RegisterInput = {
  email: string;
  password: string;
  name?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthFormState = {
  error?: string;
  success?: boolean;
};
