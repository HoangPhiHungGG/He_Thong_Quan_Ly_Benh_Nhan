// import Image from "next/image";
// import Link from "next/link";

// import { Button } from "@/components/ui/button";
// import { Doctors } from "@/constants";
// import { formatDateTime } from "@/lib/utils";
// import { getAppointment } from "@/lib/actions/apointment.actions";

// const RequestSuccess = async ({
//   searchParams,
//   params: { userId },
// }: SearchParamProps) => {
//   const appointmentId = (searchParams?.appointmentId as string) || "";
//   const appointment = await getAppointment(appointmentId);

//   const doctor = Doctors.find(
//     (doctor) => doctor.name === appointment.primaryPhysician,
//   );

//   return (
//     <div className=" flex h-screen max-h-screen px-[5%]">
//       <div className="success-img">
//         <Link href="/">
          
//         </Link>

//         <section className="flex flex-col items-center">
//           <Image
//             src="/assets/gifs/success.gif"
//             height={300}
//             width={280}
//             alt="success"
//           />
//           <h2 className="header mb-6 max-w-[600px] text-center">
//           <span className="text-green-500">Yêu cầu cuộc hẹn</span> của bạn đã
// được gửi thành công!

//           </h2>
//           <p>Chúng tôi sẽ liên hệ với bạn sớm để xác nhận.</p>
//         </section>

//         <section className="request-details">
//           <p>Chi tiết cuộc hẹn được yêu cầu: </p>
//           <div className="flex items-center gap-3">
//             <Image
//               src={doctor?.image!}
//               alt="doctor"
//               width={100}
//               height={100}
//               className="size-6"
//             />
//             <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
//           </div>
//           <div className="flex gap-2">
//             <Image
//               src="/assets/icons/calendar.svg"
//               height={24}
//               width={24}
//               alt="calendar"
//             />
//             <p> {formatDateTime(appointment.schedule).dateTime}</p>
//           </div>
//         </section>

//         <Button variant="outline" className="shad-primary-btn" asChild>
//           <Link href={`/patients/${userId}/new-appointment`}>
//             Đặt lịch hẹn mới
//           </Link>
//         </Button>

//         <p className="copyright">© 2024 CarePluse</p>
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
import { getAppointment } from "@/lib/actions/apointment.actions";
import { CheckCircle2 } from "lucide-react"; // Sử dụng icon từ thư viện cho gọn gàng

const RequestSuccess = async ({
  searchParams,
  params: { userId },
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);

  const doctor = Doctors.find(
    (doc) => doc.name === appointment.primaryPhysician,
  );

  return (
    <div className="flex h-screen max-h-screen items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-lg flex-col items-center rounded-2xl bg-foreground p-8 text-center shadow-card md:p-12">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="CarePulse logo"
            className="mb-8 h-10 w-fit"
          />
        </Link>

        {/* Phần nội dung chính */}
        <section className="flex flex-col items-center">
          {/* Icon thay cho GIF */}
          <CheckCircle2 className="mb-6 h-20 w-20 text-success" />

          <h2 className="header mb-4 text-3xl">
            Yêu cầu đã được gửi thành công!
          </h2>
          <p className="max-w-md text-text-secondary">
            Chúng tôi đã nhận được yêu cầu đặt lịch hẹn của bạn. Vui lòng kiểm tra
            tin nhắn SMS để nhận thông báo xác nhận từ chúng tôi.
          </p>
        </section>

        {/* Chi tiết cuộc hẹn */}
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

        {/* Nút hành động */}
        <Button asChild className="shad-primary-btn mt-10 w-full">
          <Link href={`/patients/${userId}/new-appointment`}>
            Đặt lịch hẹn mới
          </Link>
        </Button>

        <p className="copyright mt-12">© 2024 CarePulse</p>
      </div>
    </div>
  );
};

export default RequestSuccess;