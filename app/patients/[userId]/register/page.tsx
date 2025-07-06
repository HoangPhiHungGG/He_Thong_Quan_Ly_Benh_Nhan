import PatientForm from "@/components/forms/PatientForm";
import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);

  return (
    <div className="flex h-screen max-h-screen">
      {/*TODO: OTP Vertication | Passkey*/}
      <section className="remove-scrollbar container ">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-1">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />
          {/*  Biểu mẫu bệnh lý*/}
          {/* <PatientForm/> */}
          <RegisterForm user={user} />
          {/*  */}
          <p className="copy-right py-12">© 2025 CarePulse</p>
          {/* <div className="text-14-regular mt-20 flex justify-between">
            <Link href="/?admin=true " className="text-green-600">
              Admin
            </Link>
          </div> */}
        </div>
      </section>
      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;
