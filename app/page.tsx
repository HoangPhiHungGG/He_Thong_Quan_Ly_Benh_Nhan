
import PatientForm from "@/components/forms/PatientForm";
import { PasskeyModal } from "@/components/PasskeyModal";
import Image from "next/image";
import Link from "next/link";

export default function Home({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams.admin === "true";

  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          

          <PatientForm />
          
          <div className="text-sm mt-20 flex justify-between items-center">
            <p className="copyright text-text-secondary">
              © 2024 CarePulse
            </p>
            <Link href="/?admin=true" className="text-primary hover:underline">
              Admin Login
            </Link>
            <Link href="/doctors/login" className="text-primary hover:underline">
                Doctor Login
              </Link>
          </div>
        </div>
      </section>

      
      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="A doctor smiling in a bright clinic"
        className="side-img max-w-[60%]"
      />
    </div>
  );
}