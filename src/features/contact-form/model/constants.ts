import type { ContactFieldErrorKey, ContactState } from "./types";

export const initialState: ContactState = { success: false };

export const errorMap: Record<string, ContactFieldErrorKey> = {
  nameRequired: "nameRequired",
  emailRequired: "emailRequired",
  emailInvalid: "emailInvalid",
  messageRequired: "messageRequired",
};
