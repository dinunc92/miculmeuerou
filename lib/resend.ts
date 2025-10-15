// lib/resend.ts
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);
export const FROM = process.env.RESEND_FROM || "Micul Meu Erou <onboarding@resend.dev>";
//export const FROM = process.env.RESEND_FROM || "Micul Meu Erou <noreply@example.com>";
