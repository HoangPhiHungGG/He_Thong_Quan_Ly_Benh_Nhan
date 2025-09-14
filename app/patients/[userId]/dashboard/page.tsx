
import Image from "next/image";
import Link from "next/link";
import { DataTable } from "@/components/table/DataTable";

import { PatientColumns } from "@/components/table/PatientColumns";
import { getPatientAppointments } from "@/lib/actions/apointment.actions";

const PatientDashboard = async ({ params: { userId } }: SearchParamProps) => {
  const appointments = await getPatientAppointments(userId);

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-12 p-4 md:p-8">
      <header className="flex items-center justify-between">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="CarePulse logo"
            className="h-8 w-fit"
          />
        </Link>
        <div className="flex items-center gap-4">
            <p className="text-lg font-semibold text-text-secondary">My Dashboard</p>
        </div>
      </header>

      <main className="space-y-10">
        <section className="w-full space-y-2">
          <h1 className="header">Lịch sử Lịch hẹn</h1>
          <p className="text-text-secondary">
            Xem và quản lý tất cả các cuộc hẹn của bạn tại CarePulse.
          </p>
        </section>

        <div className="data-table">
         
          <DataTable columns={PatientColumns} data={appointments} />
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;