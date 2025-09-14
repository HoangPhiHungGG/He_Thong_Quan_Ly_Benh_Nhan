// components/forms/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import SubmitButton from "../SubmitButton";
import { FormFieldType } from "./PatientForm";
import CustomFormField from "../CustomFormFeild"; // Sửa lại tên import cho đúng
import { loginUser } from "@/lib/actions/user.actions";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

interface LoginFormProps {
  userType: "doctor" | "admin";
}

const LoginForm = ({ userType }: LoginFormProps) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Thêm isLoading state

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(""); // Reset lỗi mỗi khi submit

    try {
      const session = await loginUser(values);
      if (session) {
        if (userType === "doctor") {
          router.push("/doctors/dashboard");
        } else {
          router.push("/admin");
        }
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (e) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Login submit error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="email@example.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="password"
          label="Password"
          placeholder="********"
          type="password" 
          iconSrc="/assets/icons/lock.svg" // Thêm icon khóa
          iconAlt="password"
        />
        {error && <p className="text-destructive text-sm">{error}</p>}
        <SubmitButton isLoading={isLoading}>Login</SubmitButton>
      </form>
    </Form>
  );
};
export default LoginForm;