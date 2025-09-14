// components/table/PatientListColumns.tsx

"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";

import { Patient } from "@/types/appwrite.types";
import { Button } from "@/components/ui/button";

export const PatientListColumns: ColumnDef<Patient>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Patient Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <p className="font-medium">{row.original.name}</p>,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
  },
  {
    accessorKey: "birthDate",
    header: "Date of Birth",
    cell: ({ row }) => {
      const birthDate = new Date(row.original.birthDate);
      return <p>{birthDate.toLocaleDateString("en-US")}</p>;
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => <p className="capitalize">{row.original.gender}</p>,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row: { original: patient } }) => (
      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link href={`/admin/patients/${patient.$id}`}>Xem sơ yếu lí lịch</Link>
        </Button>
      </div>
    ),
  },
];