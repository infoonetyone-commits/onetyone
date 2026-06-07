"use server";

import nodemailer from "nodemailer";

export type ContactState = {
  success: boolean;
  message: string;
} | null;

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = formData.get("name") as string;
  const business = formData.get("business") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const service = formData.get("service") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, message: "Please fill in all required fields." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"OnetyOne Website" <${process.env.GMAIL_USER}>`,
      to: "info.onetyone@gmail.com",
      replyTo: email,
      subject: `New enquiry from ${name}${business ? ` — ${business}` : ""}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #0F2D4A;">
          <h2 style="margin: 0 0 24px; font-size: 24px; border-bottom: 2px solid #C9A84C; padding-bottom: 12px;">
            New Enquiry — OnetyOne
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Name</td><td style="padding: 8px 0;">${name}</td></tr>
            ${business ? `<tr><td style="padding: 8px 0; font-weight: bold;">Business</td><td style="padding: 8px 0;">${business}</td></tr>` : ""}
            <tr><td style="padding: 8px 0; font-weight: bold;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #C9A84C;">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding: 8px 0; font-weight: bold;">Phone</td><td style="padding: 8px 0;">${phone}</td></tr>` : ""}
            ${service ? `<tr><td style="padding: 8px 0; font-weight: bold;">Service</td><td style="padding: 8px 0;">${service}</td></tr>` : ""}
          </table>
          <div style="margin-top: 24px; padding: 20px; background: #f8f7f4; border-left: 3px solid #C9A84C;">
            <strong>Message:</strong>
            <p style="margin: 8px 0 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    return {
      success: true,
      message: "Thanks! We'll be in touch within 24 hours.",
    };
  } catch (err) {
    console.error("Email send error:", err);
    return {
      success: false,
      message: "Something went wrong. Please email us directly at info.onetyone@gmail.com",
    };
  }
}
