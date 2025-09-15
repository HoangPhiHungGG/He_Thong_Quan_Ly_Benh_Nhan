"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

import { SelectItem } from "@/components/ui/select";
import { Doctors } from "@/constants";
import { getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite.types";
import { Form } from "../ui/form";
import CustomFormField from "../CustomFormFeild";
import SubmitButton from "../SubmitButton";
import { FormFieldType } from "./PatientForm";
import { createAppointment, updateAppointment } from "@/lib/actions/apointment.actions";

// Định nghĩa Props cho component
interface AppointmentFormProps {
  userId: string;
  patientId: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

const AppointmentForm = ({
  userId,
  patientId,
  type,
  appointment,
  setOpen,
}: AppointmentFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Lấy schema xác thực dựa trên loại form
  const AppointmentFormValidation = getAppointmentSchema(type);

  // Khởi tạo form với react-hook-form và zod
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment?.primaryPhysician || "",
      schedule: appointment ? new Date(appointment.schedule) : new Date(),
      reason: appointment?.reason || "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
      internalNotes: appointment?.internalNotes || "",
    },
  });

  // Hàm xử lý khi submit form
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);

    try {
      if (type === "create" && patientId) {
        // Tạo mới cuộc hẹn
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status: "pending" as Status,
          note: values.note,
        };

        const newAppointment = await createAppointment(appointmentData);

        if (newAppointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
          );
        }
      } else if (appointment?.$id) {
        // Cập nhật cuộc hẹn (lên lịch hoặc hủy)
        let status: "pending" | "scheduled" | "cancelled" = "pending";
        if (type === "schedule") status = "scheduled";
        if (type === "cancel") status = "cancelled";

        // Chỉ truyền các trường đã có trong collection
        const appointmentToUpdate: any = {
          appointmentId: appointment.$id,
          userId,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status,
          },
          type,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };

        // Nếu có lý do hủy thì truyền vào
        if (type === "cancel" && values.cancellationReason) {
          appointmentToUpdate.appointment.cancellationReason = values.cancellationReason;
        }
        // Nếu có internalNotes và collection có trường này thì truyền vào
        if (type === "schedule" && values.internalNotes !== undefined) {
          appointmentToUpdate.appointment.internalNotes = values.internalNotes;
        }

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen?.(false);
          form.reset();
          toast.success(
            `Cuộc hẹn đã được ${type === "schedule" ? "lên lịch" : "hủy"} thành công!`
          );
        }
      } else {
        toast.error("Không tìm thấy ID cuộc hẹn để cập nhật.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }

  // Xác định nhãn cho nút submit
  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Xác nhận hủy bỏ";
      break;
    case "schedule":
      buttonLabel = "Xác nhận lịch hẹn";
      break;
    default:
      buttonLabel = "Yêu cầu cuộc hẹn";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">Cuộc hẹn mới</h1>
            <p className="text-text-secondary">
              Yêu cầu một cuộc hẹn mới trong 10 giây.
            </p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Bác sĩ"
              placeholder="Chọn bác sĩ"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt={doctor.name}
                      className="rounded-full"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Ngày hẹn dự kiến"
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
            />

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Lý do hẹn"
                placeholder="Ví dụ: Khám sức khỏe định kỳ"
                disabled={type === "schedule"}
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Ghi chú bổ sung"
                placeholder="Ví dụ: Ưu tiên cuộc hẹn buổi chiều"
                disabled={type === "schedule"}
              />
            </div>
            
            {type === "schedule" && (
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="internalNotes"
                label="Ghi chú nội bộ (Chỉ dành cho quản trị viên)"
                placeholder="Bệnh nhân cần hỗ trợ đặc biệt..."
              />
            )}
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Lý do hủy bỏ"
            placeholder="Nhập lý do hủy bỏ"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-destructive-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
