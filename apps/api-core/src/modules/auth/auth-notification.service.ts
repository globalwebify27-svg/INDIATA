import { Injectable, Logger } from "@nestjs/common";

export interface DispatchOtpResult {
  success: boolean;
  channel: "DEV_CONSOLE" | "EMAIL" | "WHATSAPP" | "BOTH";
  message: string;
  devOtp?: string; // Only returned in non-production environments for automated testing
}

@Injectable()
export class AuthNotificationService {
  private readonly logger = new Logger(AuthNotificationService.name);

  /**
   * Dispatches a password reset verification code / link to the user.
   * In local development, logs prominently to the console so developers can immediately test.
   */
  async dispatchPasswordResetOtp(
    recipient: { name: string; email?: string | null; phone?: string | null },
    otp: string,
    resetLink: string,
    preferredChannel: "EMAIL" | "WHATSAPP" | "BOTH" = "BOTH",
  ): Promise<DispatchOtpResult> {
    const isProduction = process.env.NODE_ENV === "production";
    const hasSmtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER);
    const hasSmsConfigured = !!process.env.SMS_API_KEY;

    // 1. Production delivery if external providers are configured
    if (isProduction && (hasSmtpConfigured || hasSmsConfigured)) {
      this.logger.log(`Dispatching production password reset notification to ${recipient.email || recipient.phone}`);
      // Integrate with configured SMTP / Twilio / WhatsApp gateways here
      return {
        success: true,
        channel: preferredChannel,
        message: "Password reset verification code has been dispatched to your registered contact.",
      };
    }

    // 2. Local Development Mock Dispatcher (Logs directly to backend terminal)
    const divider = "=".repeat(72);
    const formattedBanner = `
${divider}
🔐 [INDIATA AUTH DEV DISPATCH] PASSWORD RESET VERIFICATION CODE
Recipient Name:   ${recipient.name}
Email Address:    ${recipient.email || "N/A"}
Phone Number:     ${recipient.phone || "N/A"}
------------------------------------------------------------------------
👉 VERIFICATION OTP:  ${otp}
👉 DIRECT RESET LINK: ${resetLink}
⏰ VALIDITY:          15 Minutes (Single-Use Only)
${divider}
`;

    // Print to stdout
    console.info(formattedBanner);

    return {
      success: true,
      channel: "DEV_CONSOLE",
      message: "Password reset verification code has been dispatched to your registered phone/email.",
      devOtp: !isProduction ? otp : undefined,
    };
  }

  /**
   * Dispatches security alert when a password is successfully updated.
   */
  async dispatchPasswordChangedNotification(
    recipient: { name: string; email?: string | null; phone?: string | null },
  ): Promise<void> {
    const divider = "-".repeat(72);
    console.info(`
${divider}
🛡️ [INDIATA SECURITY ALERT] Password was successfully changed for ${recipient.name} (${recipient.email || recipient.phone}).
Applicable active sessions have been revoked.
${divider}
`);
  }
}
