"use server";

import nodemailer from "nodemailer";

export type ContactState = {
  success: boolean;
  error?: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    message?: string;
  };
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendContactForm(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = formData.get("name") as string | null;
  const email = formData.get("email") as string | null;
  const message = formData.get("message") as string | null;

  const fieldErrors: ContactState["fieldErrors"] = {};

  if (!name?.trim()) fieldErrors.name = "nameRequired";
  if (!email?.trim()) fieldErrors.email = "emailRequired";
  else if (!EMAIL_REGEX.test(email)) fieldErrors.email = "emailInvalid";
  if (!message?.trim()) fieldErrors.message = "messageRequired";

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL ?? process.env.SMTP_USER,
      replyTo: email!.trim(),
      subject: `New message from ${name!.trim()}`,
      text: [
        `Name: ${name!.trim()}`,
        `Email: ${email!.trim()}`,
        ``,
        `Message:`,
        message!.trim(),
      ].join("\n"),
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #4f46e5;">New Contact Form Message</h2>
          <p><strong>Name:</strong> ${name!.trim()}</p>
          <p><strong>Email:</strong> <a href="mailto:${email!.trim()}">${email!.trim()}</a></p>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
          <p style="white-space: pre-wrap;">${message!.trim()}</p>
        </div>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error("Failed to send email:", err);
    return { success: false, error: "error" };
  }
}
