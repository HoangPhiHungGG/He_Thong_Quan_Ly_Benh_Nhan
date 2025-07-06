"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormFeild from "../CustomFormFeild";
import SubmitButton from "../SubmitButton";
import { useState, Dispatch, SetStateAction } from "react";
import { getAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/apointment.actions";
import { Appointment } from "@/types/appwrite.types";

const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const AppointmentFormValidation = getAppointmentSchema(type);

  const [isLoading, setisLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment?.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment?.schedule!)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    console.log("đang gửi", type);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setisLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }

    try {
      if (type === "create" && patientId) {
        // Create a new appointment
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status: status as Status,
          note: values.note,
        };
        const newAppointment = await createAppointment(appointmentData);
        console.log(newAppointment);
        if (newAppointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`,
          );
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }

      //   const userData ={name,email,phone}
      //  const user = await createUser(userData)
      //  if(user) router.push(`/patients/${user.$id}/register`)
    } catch (error) {
      console.log(error);
    }
    setisLoading(false);
  }

  //
  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Hủy cuộc hẹn";
      break;
    case "create":
      buttonLabel = "Tạo cuộc hẹn";
      break;
    case "schedule":
      buttonLabel = "Lên lịch hẹn";
      break;
    default:
      break;
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header ">Đặt lịch hẹn mới 👋</h1>
            <p className="text-dark-700">
              Yêu cầu đặt lịch hẹn mới trong 10 giây
            </p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            <CustomFormFeild
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Bác sĩ"
              placeholder="Chọn bác sĩ"
            >
              {Doctors.map((doctor, i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt="doctor"
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormFeild>

            <CustomFormFeild
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Ngày hẹn dự kiến"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />

            <div
              className={`flex flex-col gap-6  ${type === "create" && "xl:flex-row"}`}
            >
              <CustomFormFeild
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Lý do hẹn"
                placeholder="Khám sức khỏe định kỳ"
                disabled={type === "schedule"}
              />

              <CustomFormFeild
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Ghi chú"
                placeholder="Ưu tiên lịch hẹn buổi chiều, nếu có thể"
                disabled={type === "schedule"}
              />
            </div>
          </>
        )}
        {/* name */}

        {type === "cancel" && (
          <CustomFormFeild
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Lý do hủy"
            placeholder="Cuộc họp khẩn cấp đã diễn ra"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
