
"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import { StatusBadge } from "../StatusBadge";
import { AppointmentModal } from "../AppointmentModal";
import { Button } from "../ui/button";
import { ArrowUpDown, FileText } from "lucide-react";
import Link from "next/link";

export const AdminColumns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => <p className="text-sm font-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "patient",
  //   header: "Patient",
  //   cell: ({ row }) => (
  //     <p className="font-medium">{row.original.patient.name}</p>
  //   ),
  // },
  header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Patient
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
        
      );
    },
    // Chúng ta cần truy cập vào 'name' để lọc, nên phải tùy chỉnh cell
    cell: ({ row }) => {
        const patient = row.original.patient;
        const appointment = row.original;
        return <div className="flex items-center gap-2">
          <p className="font-medium">{patient.name}</p>
          {appointment.clinicalNotes && (
            <span title="Has clinical notes">
              <FileText className="h-4 w-4 text-primary" />
            </span>
          )}
        </div>
    },
    // Thêm accessorFn để lọc đúng
    accessorFn: (row) => row.patient.name,
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
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => (
      <p className="min-w-[100px]">
        {formatDateTime(row.original.schedule).dateTime}
      </p>
    ),
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
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: appointment } }) => (
      <div className="flex gap-1">
        <AppointmentModal
          type="schedule"
          patientId={appointment.patient.$id}
          userId={appointment.userId}
          appointment={appointment}
        />
        <AppointmentModal
          type="cancel"
          patientId={appointment.patient.$id}
          userId={appointment.userId}
          appointment={appointment}
        />
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/appointments/${appointment.$id}`}>
            Chi tiết
          </Link>
        </Button>
      </div>
    ),
  },
];




// "use client";

// import { ColumnDef } from "@tanstack/react-table";
// import Link from "next/link";
// import Image from "next/image";
// import { FileText, ArrowUpDown } from "lucide-react";
// import { Doctors } from "@/constants";
// import { formatDateTime } from "@/lib/utils";
// import { Appointment } from "@/types/appwrite.types";
// import { StatusBadge } from "../StatusBadge";
// import { AppointmentModal } from "../AppointmentModal";
// import { Button } from "@/components/ui/button";

// export const AdminColumns: ColumnDef<Appointment>[] = [
//   {
//     header: "#",
//     cell: ({ row }) => <p className="text-sm font-medium">{row.index + 1}</p>,
//   },
//   {
//     accessorKey: "patient.name",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Patient
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => {
//       const appointment = row.original;
//       return (
//         <div className="flex items-center gap-2">
//           <p className="font-medium">{appointment.patient.name}</p>
//           {appointment.clinicalNotes && (
//             <span title="Has clinical notes">
//               <FileText className="h-4 w-4 text-primary" />
//             </span>
//           )}
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => (
//       <div className="min-w-[115px]">
//         <StatusBadge status={row.original.status} />
//       </div>
//     ),
//   },
//   {
//     accessorKey: "schedule",
//     header: "Appointment",
//     cell: ({ row }) => (
//       <p className="min-w-[100px]">
//         {formatDateTime(row.original.schedule).dateTime}
//       </p>
//     ),
//   },
//   {
//     accessorKey: "primaryPhysician",
//     header: "Doctor",
//     cell: ({ row }) => {
//       const doctor = Doctors.find(
//         (doc) => doc.name === row.original.primaryPhysician
//       );
//       return (
//         <div className="flex items-center gap-3">
//           <Image
//             src={doctor?.image!}
//             alt={doctor?.name!}
//             width={32}
//             height={32}
//             className="size-8 rounded-full"
//           />
//           <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
//         </div>
//       );
//     },
//   },
//   {
//     id: "actions",
//     header: () => <div className="text-right pr-4">Actions</div>,
//     cell: ({ row: { original: appointment } }) => (
//       <div className="flex justify-end gap-2">
//         <AppointmentModal
//           type="schedule"
//           patientId={appointment.patient.$id}
//           userId={appointment.userId}
//           appointment={appointment}
//         />
//         <AppointmentModal
//           type="cancel"
//           patientId={appointment.patient.$id}
//           userId={appointment.userId}
//           appointment={appointment}
//         />
//         <Button asChild variant="outline" size="sm">
//           <Link href={`/admin/appointments/${appointment.$id}`}>
//             Chi tiết
//           </Link>
//         </Button>
//       </div>
//     ),
//   },
// ];