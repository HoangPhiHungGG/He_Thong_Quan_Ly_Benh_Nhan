// app/admin/appointments/[appointmentId]/page.tsx

import Link from "next/link";
import Image from "next/image";
import { getPatient } from "@/lib/actions/patient.actions";
import ClinicalNotesForm from "@/components/forms/ClinicalNotesForm";
import { Button } from "@/components/ui/button";
import { getAppointment } from "@/lib/actions/apointment.actions";

const AdminAppointmentDetails = async ({
  params: { appointmentId },
}: {
  params: { appointmentId: string };
}) => {
  const appointment = await getAppointment(appointmentId);
  if (!appointment) {
    return <div>Appointment not found.</div>;
  }

  const patient = await getPatient(appointment.patient.$id);
  if (!patient) {
    return <div>Patient not found for this appointment.</div>;
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col space-y-12 p-4 md:p-8">
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
          Chi tiết cuộc hẹn
        </p>
      </header>
      <main>
        <div className="flex flex-col gap-8">
          {/* Patient Details Section */}
          <div className="bg-foreground p-6 rounded-lg shadow-card">
            <h2 className="sub-header">Thông tin bệnh nhân</h2>
            <p><strong>Họ và Tên:</strong> {patient.name}</p>
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>Số điện thoại:</strong> {patient.phone}</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href={`/admin/patients/${patient.$id}`}>
              Xem hồ sơ bệnh nhân đầy đủ
              </Link>
            </Button>
          </div>

          {/* Appointment Details Section */}
          <div className="bg-foreground p-6 rounded-lg shadow-card">
            <h2 className="sub-header">Chi tiết cuộc hẹn</h2>
            <p><strong>Bác sĩ:</strong> Dr. {appointment.primaryPhysician}</p>
            <p><strong>Ngày & Giờ:</strong> {new Date(appointment.schedule).toLocaleString()}</p>
            <p><strong>Lý do khám:</strong> {appointment.reason}</p>
            <p><strong>Ghi chú của bệnh nhân:</strong> {appointment.note || "N/A"}</p>
          </div>

          {/* Clinical Notes Section */}
          <div className="bg-foreground p-6 rounded-lg shadow-card">
            <h2 className="sub-header">Ghi chú lâm sàng</h2>
            <ClinicalNotesForm
              appointmentId={appointment.$id}
              initialNotes={appointment.clinicalNotes}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAppointmentDetails;