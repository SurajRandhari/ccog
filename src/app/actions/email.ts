"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

// Helper to determine the recipient email based on form type (optional routing)
// For now, we'll send everything to a default configurable address
const TO_EMAIL = process.env.CONTACT_EMAIL || "info@calvarycogindia.com";

export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Calvary Church <onboarding@resend.dev>", // Replace with verified domain in production if needed
      to: [TO_EMAIL],
      subject: `New Contact Form Submission: ${subject || "General Inquiry"}`,
      html: `
        <h2>New Message from ${name}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Error sending email:", err);
    return { success: false, error: err.message };
  }
}

export async function sendConnectEmail(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!firstName || !lastName || !email) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Calvary Church <onboarding@resend.dev>",
      to: [TO_EMAIL],
      subject: `New Connection Card: ${firstName} ${lastName}`,
      html: `
        <h2>New Connection Card Received</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message/Notes:</strong></p>
        <p>${message ? message.replace(/\n/g, "<br/>") : "No specific message provided."}</p>
      `,
    });

    if (error) {
       console.error("Resend Error:", error);
       return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Error sending email:", err);
    return { success: false, error: err.message };
  }
}
