export type ContactFieldErrorKey =
  | "nameRequired"
  | "emailRequired"
  | "emailInvalid"
  | "messageRequired";

export type ContactState = {
  success: boolean;
  error?: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    message?: string;
  };
};
