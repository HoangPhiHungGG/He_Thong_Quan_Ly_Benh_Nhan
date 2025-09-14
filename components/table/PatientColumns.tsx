"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import { StatusBadge } from "../StatusBadge";
import { AppointmentModal } from "../AppointmentModal";

export const PatientColumns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => <p className="text-sm font-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const appointment = row.original;
      const doctor = Doctors.find(
        (doc) => doc.name === appointment.primaryPhysician
      );
      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image!}
            alt={doctor?.name!}
            width={32}
            height={32}
            className="size-8 rounded-full"
          />
          <p className="whitespace-nowrap font-medium">Dr. {doctor?.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Date & Time",
    cell: ({ row }) => (
      <p className="min-w-[100px]">
        {formatDateTime(row.original.schedule).dateTime}
      </p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Action</div>,
    cell: ({ row: { original: appointment } }) => {
      const isCancellable = ["pending", "scheduled"].includes(
        appointment.status
      );

      if (isCancellable) {
        return (
          <div className="flex justify-center">
            <AppointmentModal
              type="cancel"
              patientId={appointment.patient.$id}
              userId={appointment.userId}
              appointment={appointment}
            />
          </div>
        );
      }
      return null;
    },
  },
];