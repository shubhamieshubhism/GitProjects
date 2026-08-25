import nodemailer from "nodemailer";
import { format } from "date-fns";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  text,
  attachments,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: any[];
}) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME || "GlamStudio"}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
      attachments,
    });
    return info;
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}

export function enquiryNotificationEmail({ name, email, phone, eventDate, message }: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #D4A5A5;">📩 New Enquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Event Date:</strong> ${eventDate ? format(new Date(eventDate), "MMMM dd, yyyy") : "Not specified"}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f5f5f5; padding: 15px; border-radius: 4px; border-left: 4px solid #D4A5A5;">
          ${message.replace(/\n/g, "<br>")}
        </blockquote>
        <p style="margin-top: 20px; color: #888; font-size: 0.9em;">This enquiry was submitted via the GlamStudio website.</p>
      </div>
    </body>
    </html>
  `;
}

export function appointmentConfirmationEmail({
  name,
  serviceType,
  date,
  timeSlot,
  status,
  googleLink,
  icsAttachment,
}: any) {
  const formattedDate = format(new Date(date), "EEEE, MMMM dd, yyyy");
  const serviceLabel = serviceType.toLowerCase().replace(/_/g, " ");

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #D4A5A5;">💄 Appointment ${status === "CONFIRMED" ? "Confirmed" : "Booked"}</h2>
          <p style="color: #888;">Hello ${name},</p>
        </div>
        <div style="background: #fafafa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Service:</strong> ${serviceLabel}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${timeSlot}</p>
          <p><strong>Status:</strong> <span style="color: ${status === "CONFIRMED" ? "green" : "orange"}; font-weight: bold;">${status}</span></p>
        </div>
        ${status === "CONFIRMED" ? `
          <div style="margin: 20px 0;">
            <p><strong>Add to your calendar:</strong></p>
            <a href="${googleLink}" target="_blank" style="display: inline-block; background: #4285f4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-right: 10px;">Google Calendar</a>
            ${icsAttachment ? '<a href="cid:event.ics" style="display: inline-block; background: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Download .ics</a>' : ""}
          </div>
        ` : `
          <p style="color: #888;">We'll notify you once your appointment is confirmed.</p>
        `}
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 0.9em; color: #888; text-align: center;">
          Need to reschedule? <a href="${process.env.NEXTAUTH_URL}/user/appointments" style="color: #D4A5A5;">Manage your appointments</a>
        </p>
      </div>
    </body>
    </html>
  `;
}

export function adminNotificationEmail({
  name,
  email,
  serviceType,
  date,
  timeSlot,
  notes,
}: any) {
  const formattedDate = format(new Date(date), "EEEE, MMMM dd, yyyy");
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #D4A5A5;">📅 New Appointment Booking</h2>
        <p><strong>Client:</strong> ${name} (${email})</p>
        <p><strong>Service:</strong> ${serviceType.toLowerCase().replace(/_/g, " ")}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${timeSlot}</p>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
        <p style="margin-top: 20px; color: #888; font-size: 0.9em;">Log in to the admin dashboard to manage this booking.</p>
      </div>
    </body>
    </html>
  `;
}