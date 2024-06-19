import nodemailer from "nodemailer";
import { mailTemplate } from "./template";

export const sendEmail = async (
  name: string,
  email: string,
  phone: string,
  github_link: string,
  stopwatch_time: string
) => {
  try {
    let mailTransporter = nodemailer.createTransport({
      service: "iCloud",
      auth: {
        user: "ranjhaniharshal@icloud.com",
        pass: process.env.APP_PASSWORD,
      },
    });

    let mailDetails = {
      from: "noreply@harshalranjhani.in",
      to: email,
      subject: `Your Response has been recorded! 🚀`,
      html: mailTemplate(name, email, phone, github_link, stopwatch_time),
    };

    const info = await mailTransporter.sendMail(mailDetails);
    console.log("Email sent: " + info.response);
  } catch (e: any) {
    throw new Error(e.message);
  }
};
