"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";

import { Appointment, Patient } from "@/types/appwrite.types";

import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Resend } from "resend";
import AppointmentEmail from "@/components/emails/AppointmentEmail";

//  CREATE APPOINTMENT (Giữ nguyên)
// export const createAppointment = async (
//   appointment: CreateAppointmentParams
// ) => {
//   try {
//     const newAppointment = await databases.createDocument(
//       DATABASE_ID!,
//       APPOINTMENT_COLLECTION_ID!,
//       ID.unique(),
//       appointment
//     );

//     revalidatePath("/admin");
//     return parseStringify(newAppointment);
//   } catch (error) {
//     console.error("An error occurred while creating a new appointment:", error);
//   }
// };

// const resend = new Resend(process.env.RESEND_API_KEY);
const resend = new Resend("re_FYdAVcb5_K4PiFGPJJ5y9jgH5igncCAe7");

export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    // Dữ liệu truyền vào Appwrite phải đúng với cấu trúc
    const appointmentDataToSave = {
      userId: appointment.userId,
      // 'patient' phải là ID của document bệnh nhân (string)
      patient: appointment.patient, // Đảm bảo appointment.patient là một string ID
      primaryPhysician: appointment.primaryPhysician,
      schedule: appointment.schedule,
      reason: appointment.reason,
      note: appointment.note,
      status: "pending", // Trạng thái mặc định
    };

    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointmentDataToSave
    );

    revalidatePath("/admin");
    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
  }
};

//  GET APPOINTMENT (Giữ nguyên)
export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the existing patient:",
      error
    );
  }
};

//  GET RECENT APPOINTMENTS (Giữ nguyên)
export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        if (appointment.status === "scheduled") {
          acc.scheduledCount++;
        } else if (appointment.status === "pending") {
          acc.pendingCount++;
        } else if (appointment.status === "cancelled") {
          acc.cancelledCount++;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );
  }
};

// =========================================================
// HÀM MỚI: LẤY LỊCH SỬ LỊCH HẸN CỦA MỘT BỆNH NHÂN
// =========================================================
export const getPatientAppointments = async (userId: string) => {
  if (!userId) return [];

  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.equal("userId", [userId]), Query.orderDesc("$createdAt")]
    );

    return parseStringify(appointments.documents);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient's appointments:",
      error
    );
    return [];
  }
};

//  UPDATE APPOINTMENT (Cập nhật revalidatePath)
// export const updateAppointment = async ({
//   appointmentId,
//   userId,
//   appointment,
//   type,
// }: UpdateAppointmentParams) => {
//   try {
//     const updatedAppointment = await databases.updateDocument(
//       DATABASE_ID!,
//       APPOINTMENT_COLLECTION_ID!,
//       appointmentId,
//       appointment
//     );

//     if (!updatedAppointment) {
//       throw new Error("Appointment not found");
//     }

//     const smsMessage =
//       type === "schedule"
//         ? `Thân chào bạn từ CarePulse. Lịch hẹn của bạn vào lúc ${
//             formatDateTime(appointment.schedule).dateTime
//           } với Bác sĩ ${appointment.primaryPhysician} đã được xác nhận.`
//         : `Chúng tôi rất tiếc phải thông báo lịch hẹn của bạn vào lúc ${
//             formatDateTime(appointment.schedule).dateTime
//           } đã bị hủy. Lý do: ${appointment.cancellationReason}`;

//     await sendSMSNotification(userId, smsMessage);

//     revalidatePath("/admin");

//     revalidatePath(`/patients/${userId}/dashboard`);

//     return parseStringify(updatedAppointment);
//   } catch (error) {
//     console.error("An error occurred while updating an appointment:", error);
//   }
// };

// HÀM UPDATE ĐƯỢC NÂNG CẤP ĐỂ GỬI EMAIL
// =========================================================
export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    // 1. Cập nhật lịch hẹn trên Appwrite
    const updatedAppointmentDoc = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointmentDoc)
      throw new Error("Appointment not found after update");

    // Ép kiểu để sử dụng
    const updatedAppointment = updatedAppointmentDoc as Appointment;
    const patient = updatedAppointment.patient as Patient;
    const formattedDateTime = formatDateTime(
      updatedAppointment.schedule
    ).dateTime;

    // 2. Chuẩn bị nội dung email dựa trên 'type'
    let emailSubject = "";
    let emailHtmlContent = "";

    if (type === "schedule") {
      emailSubject = `Xác nhận: Lịch hẹn của bạn tại CarePulse đã được lên lịch!`;
      emailHtmlContent = `
        <div style="font-family: Arial, sans-serif;">
          <h1>Xin chào ${patient.name},</h1>
          <p>Chúng tôi vui mừng thông báo lịch hẹn của bạn đã được xác nhận.</p>
          <h3>Chi tiết lịch hẹn:</h3>
          <ul>
            <li><strong>Bác sĩ:</strong> Dr. ${updatedAppointment.primaryPhysician}</li>
            <li><strong>Thời gian:</strong> ${formattedDateTime}</li>
          </ul>
          <p>Trân trọng,<br/>Đội ngũ CarePulse</p>
        </div>
      `;
    } else if (type === "cancel") {
      emailSubject = `Thông báo: Lịch hẹn của bạn tại CarePulse đã bị hủy`;
      emailHtmlContent = `
        <div style="font-family: Arial, sans-serif;">
          <h1>Xin chào ${patient.name},</h1>
          <p>Chúng tôi rất tiếc phải thông báo rằng lịch hẹn của bạn đã bị hủy.</p>
          <h3>Chi tiết lịch hẹn đã hủy:</h3>
          <ul>
            <li><strong>Bác sĩ:</strong> Dr. ${updatedAppointment.primaryPhysician}</li>
            <li><strong>Thời gian:</strong> ${formattedDateTime}</li>
            <li><strong>Lý do hủy:</strong> ${updatedAppointment.cancellationReason || "Không có lý do cụ thể"}</li>
          </ul>
          <p>Vui lòng liên hệ với chúng tôi nếu bạn muốn đặt lại lịch. Trân trọng,<br/>Đội ngũ CarePulse</p>
        </div>
      `;
    }

    // 3. Gửi email nếu có nội dung
    if (emailHtmlContent && patient.email) {
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: patient.email, // Gửi đến email của bệnh nhân
          subject: emailSubject,
          html: emailHtmlContent,
        });
        console.log(`Email notification sent successfully to ${patient.email}`);
      } catch (emailError) {
        console.error("Failed to send notification email:", emailError);
      }
    }

    // 4. Gửi SMS (vẫn giữ)
    const smsMessage =
      type === "schedule"
        ? `Lich hen cua ban voi Dr. ${updatedAppointment.primaryPhysician} vao luc ${formattedDateTime} da duoc xac nhan. - CarePulse`
        : `Lich hen cua ban vao luc ${formattedDateTime} da bi huy. Ly do: ${updatedAppointment.cancellationReason}. - CarePulse`;
    await sendSMSNotification(userId, smsMessage);

    // 5. Làm mới dữ liệu
    revalidatePath("/admin");
    revalidatePath(`/patients/${userId}/dashboard`);

    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred in updateAppointment:", error);
    throw error;
  }
};

// SEND SMS NOTIFICATION (Giữ nguyên)
export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    );
    return parseStringify(message);
  } catch (error) {
    console.error("An error occurred while sending sms:", error);
  }
};

// HÀM MỚI: LẤY LỊCH HẸN CHO BÁC SĨ
// =========================================================
export const getAppointmentsByDoctor = async (doctorName: string) => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.equal("primaryPhysician", doctorName), Query.orderDesc("schedule")]
    );
    return parseStringify(appointments.documents);
  } catch (error) {
    console.error("Error fetching appointments for doctor:", error);
    return [];
  }
};

// =========================================================
// HÀM MỚI: CẬP NHẬT GHI CHÚ KHÁM BỆNH
// =========================================================
// HÀM CẬP NHẬT GHI CHÚ
// =========================================================
export const updateClinicalNotes = async ({
  appointmentId,
  notes,
}: {
  appointmentId: string;
  notes: string;
}) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      { clinicalNotes: notes }
    );

    // Làm mới trang dashboard admin để hiển thị/ẩn icon ghi chú
    revalidatePath(`/admin`);

    // Làm mới trang chi tiết hiện tại để hiển thị ghi chú đã lưu
    revalidatePath(`/admin/appointments/${appointmentId}`);

    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("Error updating clinical notes:", error);
    throw new Error("Failed to update clinical notes");
  }
};

// =========================================================
// HÀM XÓA GHI CHÚ
// =========================================================
export const deleteClinicalNotes = async (appointmentId: string) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      { clinicalNotes: null } // Đặt giá trị thành null để xóa
    );

    // Làm mới cả hai trang
    revalidatePath(`/admin`);
    revalidatePath(`/admin/appointments/${appointmentId}`);

    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("Error deleting clinical notes:", error);
    throw new Error("Failed to delete clinical notes");
  }
};
