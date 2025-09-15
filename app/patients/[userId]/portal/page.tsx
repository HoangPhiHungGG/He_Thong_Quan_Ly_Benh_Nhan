// app/patients/[userId]/portal/page.tsx

import Image from "next/image";
import Link from "next/link";
import { getUser } from "@/lib/actions/patient.actions";
import { Button } from "@/components/ui/button";
import { CalendarPlus, History } from "lucide-react";

const PatientPortal = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        User not found.
      </div>
    );
  }

  return (
    <div className="flex h-screen max-h-screen items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-2xl flex-col items-center rounded-2xl bg-foreground p-8 text-center shadow-card md:p-12">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={150}
            width={150}
            alt="CarePulse logo"
            className="mb-8 h-10 w-fit"
          />
        </Link>

        <section className="mb-10">
          <h1 className="header text-4xl">Chào mừng, {user.name}!</h1>
          <p className="mt-2 text-text-secondary">
            Bạn muốn làm gì hôm nay?
          </p>
        </section>

        <section className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          {/* Lựa chọn 1: Đặt lịch hẹn mới */}
          <Link href={`/patients/${userId}/register`} className="w-full">
            <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-primary-light bg-primary-light p-8 text-primary transition-transform hover:scale-105 hover:shadow-lg">
              <CalendarPlus className="mb-4 h-12 w-12" />
              <h2 className="text-xl font-bold">Đặt lịch hẹn mới</h2>
              <p className="mt-1 text-sm text-primary/80">
                Điền thông tin của bạn và lên lịch hẹn.
              </p>
            </div>
          </Link>

          {/* Lựa chọn 2: Xem lịch sử */}
          <Link href={`/patients/${userId}/dashboard`} className="w-full">
            <div className="flex h-full flex-col items-center justify-center rounded-lg border p-8 text-text-secondary transition-transform hover:scale-105 hover:shadow-lg">
              <History className="mb-4 h-12 w-12" />
              <h2 className="text-xl font-bold text-text-primary">Xem lịch sử hẹn</h2>
              <p className="mt-1 text-sm">
                Kiểm tra trạng thái của các cuộc hẹn trong quá khứ và sắp tới.
              </p>
            </div>
          </Link>
        </section>
        
        <p className="copyright mt-12">© 2024 CarePulse</p>
      </div>
    </div>
  );
};

export default PatientPortal;