// components/emails/AppointmentEmail.tsx

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
  Section,
} from "@react-email/components";
import * as React from "react";

interface AppointmentEmailProps {
  patientName: string;
  appointmentDetails: string;
  doctorName: string;
  status: "scheduled" | "cancelled";
  cancellationReason?: string | null;
  appUrl?: string;
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const box = {
  padding: "0 48px",
};

const heading = {
  color: "#1F2937",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
};

const logo = {
    margin: "0 auto",
    marginBottom: "24px",
};

export const AppointmentEmail = ({
  patientName,
  appointmentDetails,
  doctorName,
  status,
  cancellationReason,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
}: AppointmentEmailProps) => {
  const isScheduled = status === "scheduled";
  const previewText = isScheduled
    ? `Lịch hẹn của bạn đã được xác nhận!`
    : `Thông báo hủy lịch hẹn`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Img
              src={`${appUrl}/assets/icons/logo-full.svg`}
              width="150"
              height="40"
              alt="CarePulse Logo"
              style={logo}
            />
            <Heading style={heading}>
              {isScheduled ? "Lịch hẹn đã được xác nhận" : "Thông báo hủy lịch hẹn"}
            </Heading>
            <Text style={text}>Xin chào {patientName},</Text>
            
            {isScheduled ? (
              <Text style={text}>
                Chúng tôi vui mừng thông báo lịch hẹn của bạn đã được xác nhận. Dưới đây là thông tin chi tiết:
              </Text>
            ) : (
              <Text style={text}>
                Chúng tôi rất tiếc phải thông báo rằng lịch hẹn của bạn đã bị hủy.
              </Text>
            )}

            <Section style={{ border: "1px solid #E5E7EB", borderRadius: "8px", padding: "16px", margin: "20px 0" }}>
                <Text style={{ ...text, margin: 0 }}><strong>Bác sĩ:</strong> Dr. {doctorName}</Text>
                <Text style={{ ...text, margin: "8px 0 0 0" }}><strong>Thời gian:</strong> {appointmentDetails}</Text>
                {!isScheduled && cancellationReason && (
                    <Text style={{ ...text, color: "#EF4444", margin: "8px 0 0 0" }}><strong>Lý do hủy:</strong> {cancellationReason}</Text>
                )}
            </Section>

            <Text style={text}>
              Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.
            </Text>
            <Text style={text}>Trân trọng,<br />Đội ngũ CarePulse</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AppointmentEmail;