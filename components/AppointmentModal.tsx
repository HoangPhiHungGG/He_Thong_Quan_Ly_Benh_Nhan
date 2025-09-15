// "use client";

// import { useState } from "react";

// import { Button } from "@/components/ui/button";

// import { Appointment } from "@/types/appwrite.types";

// import "react-datepicker/dist/react-datepicker.css";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import AppointmentForm from "./forms/AppointmentForm";
// export const AppointmentModal = ({
//   patientId,
//   userId,
//   appointment,
//   type,
// }: {
//   patientId: string;
//   userId: string;
//   appointment?: Appointment;
//   type: "schedule" | "cancel";
//   title: string;
//   description: string;
// }) => {
//   const [open, setOpen] = useState(false);

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button
//           variant="ghost"
//           className={`capitalize ${type === "schedule" && "text-green-500"}`}
//         >
//           {type}
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="shad-dialog sm:max-w-md">
//         <DialogHeader className="mb-4 space-y-3">
//           <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
//           <DialogDescription>
// Vui lòng xem các thông tin sau để {type} cuộc hẹn          </DialogDescription>
//         </DialogHeader>

//         <AppointmentForm
//           userId={userId}
//           patientId={patientId}
//           type={type}
//           appointment={appointment}
//           setOpen={setOpen}
//         />
//       </DialogContent>
//     </Dialog>
//   );
// };



"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AppointmentForm from "./forms/AppointmentForm";
import { Appointment } from "@/types/appwrite.types";

interface AppointmentModalProps {
  type: "schedule" | "cancel";
  patientId: string;
  userId: string;
  appointment?: Appointment;
}

export const AppointmentModal = ({
  type,
  patientId,
  userId,
  appointment,
}: AppointmentModalProps) => {
  const [open, setOpen] = useState(false);

  // Xác định text và style dựa trên 'type'
  const isScheduling = type === "schedule";
  const buttonVariant = isScheduling ? "ghost" : "destructive";
  const buttonText = isScheduling ? "Xác nhận" : "Hủy";
  const title = isScheduling ? "Xác nhận lịch hẹn" : "Hủy cuộc hẹn";
  const description = isScheduling
    ? "Vui lòng xác nhận các thông tin sau để lên lịch."
    : "Bạn có chắc chắn muốn hủy cuộc hẹn này không?";
  const buttonClassName = isScheduling ? "text-success" : "shad-destructive-btn";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className={`capitalize ${buttonClassName}`}>
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <AppointmentForm
          userId={userId}
          patientId={patientId}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};