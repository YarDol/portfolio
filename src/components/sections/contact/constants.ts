import type { ContactState } from "@/app/actions/contact";

export const initialState: ContactState = { success: false };

export const errorMap: Record<
  string,
  "nameRequired" | "emailRequired" | "emailInvalid" | "messageRequired"
> = {
  nameRequired: "nameRequired",
  emailRequired: "emailRequired",
  emailInvalid: "emailInvalid",
  messageRequired: "messageRequired",
};
