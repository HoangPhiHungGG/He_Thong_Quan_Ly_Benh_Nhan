
// import Image from "next/image";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Doctors } from "@/constants";
// import { formatDateTime } from "@/lib/utils";
// import { getAppointment } from "@/lib/actions/apointment.actions";
// import { CheckCircle2 } from "lucide-react"; // Sử dụng icon từ thư viện cho gọn gàng

// const RequestSuccess = async ({
//   searchParams,
//   params: { userId },
// }: SearchParamProps) => {
//   const appointmentId = (searchParams?.appointmentId as string) || "";
//   const appointment = await getAppointment(appointmentId);

//   const doctor = Doctors.find(
//     (doc) => doc.name === appointment.primaryPhysician,
//   );

//   return (
//     <div className="flex h-screen max-h-screen items-center justify-center bg-background px-4">
//       <div className="flex w-full max-w-lg flex-col items-center rounded-2xl bg-foreground p-8 text-center shadow-card md:p-12">
//         {/* Logo */}
//         <Link href="/">
//           <Image
//             src="/assets/icons/logo-full.svg"
//             height={1000}
//             width={1000}
//             alt="CarePulse logo"
//             className="mb-8 h-10 w-fit"
//           />
//         </Link>

//         {/* Phần nội dung chính */}
//         <section className="flex flex-col items-center">
//           {/* Icon thay cho GIF */}
//           <CheckCircle2 className="mb-6 h-20 w-20 text-success" />

//           <h2 className="header mb-4 text-3xl">
//             Yêu cầu đã được gửi thành công!
//           </h2>
//           <p className="max-w-md text-text-secondary">
//             Chúng tôi đã nhận được yêu cầu đặt lịch hẹn của bạn. Vui lòng kiểm tra
//             tin nhắn SMS để nhận thông báo xác nhận từ chúng tôi.
//           </p>
//         </section>

//         {/* Chi tiết cuộc hẹn */}
//         <section className="mt-8 w-full space-y-4 rounded-lg border border-border bg-background p-6 text-left">
//           <h3 className="text-lg font-semibold text-text-primary">
//             Chi tiết cuộc hẹn được yêu cầu:
//           </h3>
          
//           <div className="flex items-center gap-3">
//             <Image
//               src={doctor?.image!}
//               alt={`Photo of Dr. ${doctor?.name}`}
//               width={40}
//               height={40}
//               className="h-10 w-10 rounded-full object-cover"
//             />
//             <p className="font-medium text-text-primary">Dr. {doctor?.name}</p>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <Image
//               src="/assets/icons/calendar.svg"
//               height={24}
//               width={24}
//               alt="calendar icon"
//               className="h-6 w-6 text-text-secondary"
//             />
//             <p className="text-text-primary">
//               {formatDateTime(appointment.schedule).dateTime}
//             </p>
//           </div>
//         </section>

//         {/* Nút hành động */}
//         <Button asChild className="shad-primary-btn mt-10 w-full">
//           <Link href={`/patients/${userId}/new-appointment`}>
//             Đặt lịch hẹn mới
//           </Link>
//         </Button>

//         <p className="copyright mt-12">© 2024 CarePulse</p>
//       </div>
//     </div>
//   );
// };

// export default RequestSuccess;

// app/patients/[userId]/new-appointment/success/page.tsx

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { getAppointment } from "@/lib/actions/apointment.actions";

const RequestSuccess = async ({
  searchParams,
  params: { userId },
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);

  const doctor = Doctors.find(
    (doc) => doc.name === appointment.primaryPhysician
  );

  return (
    <div className="flex h-screen max-h-screen items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-lg flex-col items-center rounded-2xl bg-foreground p-8 text-center shadow-card md:p-12">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="CarePulse logo"
            className="mb-8 h-10 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          <CheckCircle2 className="mb-6 h-20 w-20 text-success" />

          <h2 className="header mb-4 text-3xl">
            Yêu cầu đã được gửi thành công!
          </h2>
          <p className="max-w-md text-text-secondary">
            Chúng tôi đã nhận được yêu cầu của bạn. Vui lòng kiểm tra
            tin nhắn SMS để nhận thông báo xác nhận từ phòng khám.
          </p>
        </section>

        <section className="mt-8 w-full space-y-4 rounded-lg border border-border bg-background p-6 text-left">
          <h3 className="text-lg font-semibold text-text-primary">
            Chi tiết cuộc hẹn được yêu cầu:
          </h3>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              alt={`Photo of Dr. ${doctor?.name}`}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <p className="font-medium text-text-primary">Dr. {doctor?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar icon"
              className="h-6 w-6 text-text-secondary"
            />
            <p className="text-text-primary">
              {formatDateTime(appointment.schedule).dateTime}
            </p>
          </div>
        </section>

        
        <div className="mt-10 flex w-full flex-col gap-4 sm:flex-row">
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/patients/${userId}/dashboard`}>
              Xem lịch sử hẹn
            </Link>
          </Button>
          <Button className="shad-primary-btn w-full" asChild>
            <Link href={`/patients/${userId}/new-appointment`}>
              Đặt lịch hẹn mới
            </Link>
          </Button>
        </div>

        <p className="copyright mt-12">© 2024 CarePulse</p>
      </div>
    </div>
  );
};

export default RequestSuccess;