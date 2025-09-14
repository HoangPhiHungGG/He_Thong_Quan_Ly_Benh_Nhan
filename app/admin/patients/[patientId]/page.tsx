import Link from "next/link";
import Image from "next/image";
import { getPatient } from "@/lib/actions/patient.actions";
import { Button } from "@/components/ui/button";
import { redirect } from 'next/navigation'; // Import redirect

// Component con để hiển thị từng trường thông tin (không đổi)
const DetailField = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-3 border-b border-border">
    <dt className="font-medium text-text-secondary">{label}</dt>
    <dd className="md:col-span-2 text-text-primary">{value || "N/A"}</dd>
  </div>
);

const PatientDetailPage = async ({ params: { patientId } }: { params: { patientId: string } }) => {
  const patient = await getPatient(patientId);
  if (!patient) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-center p-4">
        <h1 className="text-3xl font-bold text-destructive">Không tìm thấy bệnh nhân</h1>
        <p className="mt-2 text-lg text-text-secondary">
          Không tìm thấy thông tin chi tiết bệnh nhân cho ID:
        </p>
        <p className="mt-1 font-mono text-sm text-text-secondary bg-gray-100 p-2 rounded">
          {patientId}
        </p>
        <Button asChild className="mt-6 shad-primary-btn">
          <Link href="/admin/patients">Quay lại danh sách bệnh nhân</Link>
        </Button>
      </div>
    );
  }

  // Nếu code chạy đến đây, chúng ta chắc chắn 100% rằng `patient` là một object hợp lệ.
  return (
    <div className="mx-auto flex max-w-4xl flex-col space-y-12 p-4 md:p-8">
      <header className="admin-header">
        <Link href="/admin/patients" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>
        <p className="text-lg font-semibold text-text-secondary">
          Hồ sơ bệnh nhân
        </p>
      </header>

      <main className="space-y-10">
        <section className="w-full">
          <div className="flex items-center gap-4 mb-8">
            <Image
              src="/assets/icons/user.svg"
              // Dòng này bây giờ đã hoàn toàn an toàn
              alt={patient.name}
              width={64}
              height={64}
              className="size-16 rounded-full bg-primary-light p-3"
            />
            <div>
              <h1 className="header text-3xl">{patient.name}</h1>
              <p className="text-text-secondary">{patient.email}</p>
            </div>
          </div>

          <div className="bg-foreground rounded-2xl shadow-card p-6 md:p-8">
            <h2 className="sub-header text-xl mb-6">Thông tin cá nhân</h2>
            <dl>
              <DetailField label="Full Name" value={patient.name} />
              <DetailField label="Email" value={patient.email} />
              <DetailField label="Phone Number" value={patient.phone} />
              <DetailField label="Date of Birth" value={new Date(patient.birthDate).toLocaleDateString()} />
              <DetailField label="Gender" value={patient.gender} />
              <DetailField label="Address" value={patient.address} />
              <DetailField label="Occupation" value={patient.occupation} />
            </dl>

            <h2 className="sub-header text-xl mt-10 mb-6">Emergency Contact</h2>
            <dl>
              <DetailField label="Contact Name" value={patient.emergencyContactName} />
              <DetailField label="Contact Number" value={patient.emergencyContactNumber} />
            </dl>

            <h2 className="sub-header text-xl mt-10 mb-6">Medical Information</h2>
            <dl>
              <DetailField label="Primary Physician" value={patient.primaryPhysician} />
              <DetailField label="Insurance Provider" value={patient.insuranceProvider} />
              <DetailField label="Insurance Policy #" value={patient.insurancePolicyNumber} />
              <DetailField label="Allergies" value={patient.allergies} />
              <DetailField label="Current Medication" value={patient.currentMedication} />
              <DetailField label="Family Medical History" value={patient.familyMedicalHistory} />
              <DetailField label="Past Medical History" value={patient.pastMedicalHistory} />
            </dl>

             <h2 className="sub-header text-xl mt-10 mb-6">Identification</h2>
             <dl>
                <DetailField label="ID Type" value={patient.identificationType} />
                <DetailField label="ID Number" value={patient.identificationNumber} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-3">
                    <dt className="font-medium text-text-secondary">ID Document</dt>
                    <dd className="md:col-span-2">
                        {patient.identificationDocumentUrl ? (
                            <Link href={patient.identificationDocumentUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline">View Document</Button>
                            </Link>
                        ) : "N/A"}
                    </dd>
                </div>
             </dl>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PatientDetailPage;