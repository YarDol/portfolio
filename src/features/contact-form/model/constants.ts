import type { ContactFieldErrorKey, ContactState } from "./types";

export const initialState: ContactState = { success: false };

/** Maps a server validation key onto the `Contact` translation key. */
export const errorMap: Record<string, ContactFieldErrorKey> = {
  nameRequired: "nameRequired",
  emailRequired: "emailRequired",
  emailInvalid: "emailInvalid",
  messageRequired: "messageRequired",
};
