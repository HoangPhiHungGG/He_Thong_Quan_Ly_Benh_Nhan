import Link from "next/link";
import Image from "next/image";
import { DataTable } from "@/components/table/DataTable";
import { PatientListColumns } from "@/components/table/PatientListColumns";
import { getPatients } from "@/lib/actions/patient.actions";

const PatientsListPage = async () => {
  const patients = await getPatients();

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-12 p-4 md:p-8">
      <header className="admin-header">
        <Link href="/admin" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>
        <p className="text-lg font-semibold text-text-secondary">
          Quản lý bệnh nhân
        </p>
      </header>

      <main className="space-y-10">
        <section className="w-full space-y-2">
          <h1 className="header">Tất cả bệnh nhân</h1>
          <p className="text-text-secondary">
            Duyệt và quản lý tất cả bệnh nhân đã đăng ký trong hệ thống.
          </p>
        </section>

        <div className="data-table">
          <DataTable columns={PatientListColumns} data={patients} />
        </div>
      </main>
    </div>
  );
};

export default PatientsListPage;