"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { registerPatient } from "@/lib/actions/patient.actions";
import { PatientFormValidation } from "@/lib/validation";

import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import CustomFormFeild from "../CustomFormFeild";
import FileUploader from "../FileUploader";
import SubmitButton from "../SubmitButton";
import { FormFieldType } from "./PatientForm";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    // Store file info in form data as
    let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument?.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const patient = {
        userId: user.$id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationType: values.identificationType,
        identificationNumber: values.identificationNumber,
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
        privacyConsent: values.privacyConsent,
      };

      const newPatient = await registerPatient(patient);

      if (newPatient) {
        router.push(`/patients/${user.$id}/new-appointment`);
        // router.push(`/patients/${user.$id}/dashboard`);

      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-12"
      >
        <section className="space-y-4">
          <h1 className="header">Chào mừng 👋</h1>
          <p className="text-dark-700">Hãy cho chúng tôi biết thêm về bạn.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Thông tin cá nhân</h2>
          </div>

          {/* NAME */}

          <CustomFormFeild
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            placeholder="Họ Và Tên"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />

          {/* EMAIL & PHONE */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormFeild
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email"
              placeholder="johndoe@gmail.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
            />

            <CustomFormFeild
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="phone"
              label="Số điện thoại"
              placeholder="(555) 123-4567"
            />
          </div>

          {/* BirthDate & Gender */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormFeild
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="birthDate"
              label="Ngày sinh"
            />

            <CustomFormFeild
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="gender"
              label="Giới tính"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option, i) => (
                      <div key={option + i} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>

          {/* Address & Occupation */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormFeild
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="address"
              label="Địa chỉ"
              placeholder="14 street, New york, NY - 5101"
            />

            <CustomFormFeild
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="occupation"
              label="Nghề nghiệp"
              placeholder="Kỹ sư phần mềm"
            />
          </div>

          {/* Emergency Contact Name & Emergency Contact Number */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormFeild
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="emergencyContactName"
              label="Tên người liên hệ khẩn cấp"
              placeholder="Tên người giám hộ"
            />

            <CustomFormFeild
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="emergencyContactNumber"
              label="Số điện thoại liên hệ khẩn cấp"
              placeholder="(555) 123-4567"
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Thông tin y tế</h2>
          </div>

          {/* PRIMARY CARE PHYSICIAN */}
          <CustomFormFeild
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Bác sĩ chăm sóc chính"
            placeholder="Chọn bác sĩ"
          >
            {Doctors.map((doctor, i) => (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt="doctor"
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormFeild>

          {/* INSURANCE & POLICY NUMBER */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormFeild
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insuranceProvider"
              label="Nhà cung cấp bảo hiểm"
              placeholder="BlueCross BlueShield"
            />

            <CustomFormFeild
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insurancePolicyNumber"
              label="Số hợp đồng bảo hiểm"
              placeholder="ABC123456789"
            />
          </div>

          {/* ALLERGY & CURRENT MEDICATIONS */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormFeild
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="allergies"
              label="Dị ứng (nếu có)"
              placeholder="Đậu phộng, Penicillin, Phấn hoa"
            />

            <CustomFormFeild
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="currentMedication"
              label="Thuốc hiện tại (nếu có)"
              placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
            />
          </div>

          {/* FAMILY MEDICATION & PAST MEDICATIONS */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormFeild
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="familyMedicalHistory"
              label="Tiền sử bệnh tật gia đình (nếu có)"
              placeholder="Mẹ bị tim, Cha bị tăng huyết áp"
            />

            <CustomFormFeild
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="pastMedicalHistory"
              label="Tiền sử bệnh tật"
              placeholder="Phẫu thuật ruột thừa năm 2015, Chẩn đoán hen suyễn thời thơ ấu"
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Xác thực danh tính</h2>
          </div>

          <CustomFormFeild
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Loại giấy tờ tùy thân"
            placeholder="Chọn loại giấy tờ tùy thân"
          >
            {IdentificationTypes.map((type, i) => (
              <SelectItem key={type + i} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormFeild>

          <CustomFormFeild
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Số giấy tờ tùy thân"
            placeholder="123456789"
          />

          <CustomFormFeild
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Bản sao giấy tờ tùy thân đã quét"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Đồng ý các điều sau</h2>
          </div>

          <CustomFormFeild
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="Tôi đồng ý nhận điều trị cho tình trạng sức khỏe của mình."
          />

          <CustomFormFeild
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="Tôi đồng ý cho việc sử dụng và tiết lộ thông tin sức khỏe của mình cho mục đích điều trị."
          />

          <CustomFormFeild
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="Tôi xác nhận rằng tôi đã xem xét và đồng ý với chính sách bảo mật"
          />
        </section>

        <SubmitButton isLoading={isLoading}>Gửi và Tiếp tục</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
