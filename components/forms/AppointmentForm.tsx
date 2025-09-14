// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { Form } from "@/components/ui/form";
// import CustomFormFeild from "../CustomFormFeild";
// import SubmitButton from "../SubmitButton";
// import { useState, Dispatch, SetStateAction } from "react";
// import { getAppointmentSchema } from "@/lib/validation";
// import { useRouter } from "next/navigation";
// import { FormFieldType } from "./PatientForm";
// import { Doctors } from "@/constants";
// import { SelectItem } from "../ui/select";
// import Image from "next/image";
// import {
//   createAppointment,
//   updateAppointment,
// } from "@/lib/actions/apointment.actions";
// import { Appointment } from "@/types/appwrite.types";

// const AppointmentForm = ({
//   userId,
//   patientId,
//   type = "create",
//   appointment,
//   setOpen,
// }: {
//   userId: string;
//   patientId: string;
//   type: "create" | "schedule" | "cancel";
//   appointment?: Appointment;
//   setOpen?: Dispatch<SetStateAction<boolean>>;
// }) => {
//   const router = useRouter();
//   const AppointmentFormValidation = getAppointmentSchema(type);

//   const [isLoading, setisLoading] = useState(false);
//   // 1. Define your form.
//   const form = useForm<z.infer<typeof AppointmentFormValidation>>({
//     resolver: zodResolver(AppointmentFormValidation),
//     defaultValues: {
//       primaryPhysician: appointment ? appointment?.primaryPhysician : "",
//       schedule: appointment
//         ? new Date(appointment?.schedule!)
//         : new Date(Date.now()),
//       reason: appointment ? appointment.reason : "",
//       note: appointment?.note || "",
//       cancellationReason: appointment?.cancellationReason || "",
//     },
//   });

//   // 2. Define a submit handler.
//   async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
//     console.log("đang gửi", type);
//     // Do something with the form values.
//     // ✅ This will be type-safe and validated.
//     setisLoading(true);

//     let status;
//     switch (type) {
//       case "schedule":
//         status = "scheduled";
//         break;
//       case "cancel":
//         status = "cancelled";
//         break;
//       default:
//         status = "pending";
//     }

//     try {
//       if (type === "create" && patientId) {
//         // Create a new appointment
//         const appointmentData = {
//           userId,
//           patient: patientId,
//           primaryPhysician: values.primaryPhysician,
//           schedule: new Date(values.schedule),
//           reason: values.reason!,
//           status: status as Status,
//           note: values.note,
//         };
//         const newAppointment = await createAppointment(appointmentData);
//         console.log(newAppointment);
//         if (newAppointment) {
//           form.reset();
//           router.push(
//             `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`,
//           );
//         }
//       } else {
//         const appointmentToUpdate = {
//           userId,
//           appointmentId: appointment?.$id!,
//           appointment: {
//             primaryPhysician: values.primaryPhysician,
//             schedule: new Date(values.schedule),
//             status: status as Status,
//             cancellationReason: values.cancellationReason,
//           },
//           type,
//               timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,

//         };

//         const updatedAppointment = await updateAppointment(appointmentToUpdate);

//         if (updatedAppointment) {
//           setOpen && setOpen(false);
//           form.reset();
//         }
//       }

//       //   const userData ={name,email,phone}
//       //  const user = await createUser(userData)
//       //  if(user) router.push(`/patients/${user.$id}/register`)
//     } catch (error) {
//       console.log(error);
//     }
//     setisLoading(false);
//   }

//   //
//   let buttonLabel;
//   switch (type) {
//     case "cancel":
//       buttonLabel = "Hủy cuộc hẹn";
//       break;
//     case "create":
//       buttonLabel = "Tạo cuộc hẹn";
//       break;
//     case "schedule":
//       buttonLabel = "Lên lịch hẹn";
//       break;
//     default:
//       break;
//   }
//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
//         {type === "create" && (
//           <section className="mb-12 space-y-4">
//             <h1 className="header ">Đặt lịch hẹn mới 👋</h1>
//             <p className="text-dark-700">
//               Yêu cầu đặt lịch hẹn mới trong 10 giây
//             </p>
//           </section>
//         )}

//         {type !== "cancel" && (
//           <>
//             <CustomFormFeild
//               fieldType={FormFieldType.SELECT}
//               control={form.control}
//               name="primaryPhysician"
//               label="Bác sĩ"
//               placeholder="Chọn bác sĩ"
//             >
//               {Doctors.map((doctor, i) => (
//                 <SelectItem key={doctor.name + i} value={doctor.name}>
//                   <div className="flex cursor-pointer items-center gap-2">
//                     <Image
//                       src={doctor.image}
//                       width={32}
//                       height={32}
//                       alt="doctor"
//                       className="rounded-full border border-dark-500"
//                     />
//                     <p>{doctor.name}</p>
//                   </div>
//                 </SelectItem>
//               ))}
//             </CustomFormFeild>

//             <CustomFormFeild
//               fieldType={FormFieldType.DATE_PICKER}
//               control={form.control}
//               name="schedule"
//               label="Ngày hẹn dự kiến"
//               showTimeSelect
//               dateFormat="MM/dd/yyyy  -  h:mm aa"
//             />

//             <div
//               className={`flex flex-col gap-6  ${type === "create" && "xl:flex-row"}`}
//             >
//               <CustomFormFeild
//                 fieldType={FormFieldType.TEXTAREA}
//                 control={form.control}
//                 name="reason"
//                 label="Lý do hẹn"
//                 placeholder="Khám sức khỏe định kỳ"
//                 disabled={type === "schedule"}
//               />

//               <CustomFormFeild
//                 fieldType={FormFieldType.TEXTAREA}
//                 control={form.control}
//                 name="note"
//                 label="Ghi chú"
//                 placeholder="Ưu tiên lịch hẹn buổi chiều, nếu có thể"
//                 disabled={type === "schedule"}
//               />
//             </div>
//             {type === "schedule" && (
//               <CustomFormFeild
//                 fieldType={FormFieldType.TEXTAREA}
//                 control={form.control}
//                 name="internalNotes"
//                 label="Ghi chú của Bác sĩ"
//                 placeholder="Patient requires special assistance, follow up needed..."
//               />
//             )}
//           </>
//         )}
//         {/* name */}

//         {type === "cancel" && (
//           <CustomFormFeild
//             fieldType={FormFieldType.TEXTAREA}
//             control={form.control}
//             name="cancellationReason"
//             label="Lý do hủy"
//             placeholder="Cuộc họp khẩn cấp đã diễn ra"
//           />
//         )}

//         <SubmitButton
//           isLoading={isLoading}
//           className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
//         >
//           {buttonLabel}
//         </SubmitButton>
//       </form>
//     </Form>
//   );
// };

// export default AppointmentForm;



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
import CustomFormField from "../CustomFormFeild"; // Đảm bảo tên file này đúng
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

    let status: "pending" | "scheduled" | "cancelled" = "pending";
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
        // Logic để tạo lịch hẹn mới
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status: status,
          note: values.note,
        };

        const newAppointment = await createAppointment(appointmentData);

        if (newAppointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
          );
        }
      } else {
        // Logic để cập nhật (lên lịch hoặc hủy) lịch hẹn đã có
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status,
            cancellationReason: values.cancellationReason,
            internalNotes: values.internalNotes,
          },
          type,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,

        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);
        if (updatedAppointment) {
          setOpen?.(false); // Đóng modal nếu có
          form.reset();
          
          // Hiển thị thông báo thành công
          toast.success(
            `Cuộc hẹn đã thành công ${type}d!`
          );
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Xác định nhãn cho nút submit
  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Confirm Cancellation";
      break;
    case "schedule":
      buttonLabel = "Confirm Schedule";
      break;
    default:
      buttonLabel = "Request Appointment";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-text-secondary">
              Request a new appointment in 10 seconds.
            </p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
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
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
            />

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason for appointment"
                placeholder="Ex: Annual check-up"
                disabled={type === "schedule"}
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Additional notes"
                placeholder="Ex: Prefer afternoon appointment"
                disabled={type === "schedule"}
              />
            </div>
            
            {type === "schedule" && (
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="internalNotes"
                label="Internal Notes (Admin Only)"
                placeholder="Patient requires special assistance..."
              />
            )}
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter the reason for cancellation"
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