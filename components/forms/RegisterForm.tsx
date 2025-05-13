"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {Form, FormControl} from "@/components/ui/form"
import CustomFormFeild from "../CustomFormFeild"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormVadiation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"


 

 
const RegisterForm = ({user}:{user: User}) => {
    const router = useRouter()
    const [isLoading, setisLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormVadiation>>({
    resolver: zodResolver(UserFormVadiation),
    defaultValues: {
      name: "",
      email:"",
      phone: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit({name,email,phone}: z.infer<typeof UserFormVadiation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setisLoading(true)

    try {
        const userData ={name,email,phone}
       const user = await createUser(userData)
       if(user) router.push(`/patients/${user.$id}/register`)
    }catch (error) {
        console.log(error)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className=" space-y-4">
            <h1 className="header ">Welcome 👋</h1>
            <p className="text-dark-700">Let us know more about yourself.</p>
        </section>
        <section className=" space-y-6">
            <div className="mb-9 space-y-1"></div>
            <h2 className="sub-header">Personal Information</h2>
        
        {/* name */}
        <CustomFormFeild 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="name"
        label="Full Name"
        placeholder="Hoang Phi Hung"
        iconSrc="/assets/icons/user.svg"
        iconAlt="user"
        />
        <div className="flex flex-col gap-6 xl:flex-row">
              {/* Email */}
        <CustomFormFeild 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="email"
        label="Email"
        placeholder="email@gmail.com"
        iconSrc="/assets/icons/email.svg"
        iconAlt="email"
        />
        {/* Phone */}
        <CustomFormFeild 
        fieldType={FormFieldType.PHONE_INPUT}
        control={form.control}
        name="phone"
        label="Phone Number"
        placeholder="(+84) 123 456 789"
        
        />
        </div>
        {/*  */}
        <div className="flex flex-col gap-6 xl:flex-row"> 
                 {/* BirthDate */}
        <CustomFormFeild 
        fieldType={FormFieldType.DATE_PICKER}
        control={form.control}
        name="birthDate"
        label="Date of Birth"
        
        />
        {/* Skeleton */}
        <CustomFormFeild 
        fieldType={FormFieldType.SKELETON}
        control={form.control}
        name="gender"
        label="Gender"
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
        {/*  Address & Occupation */}
        
        <div className="flex flex-col gap-6 xl:flex-row"> 
          <CustomFormFeild 
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="address"
          label="Address"
          placeholder="15 Nguyen Hue, Quan 1, Ho Chi Minh"
          
          />
          <CustomFormFeild 
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="occupation"
          label="Occupation"
          placeholder="Software Engineer"
          
          />
        </div>
        {/* Emergency Contact Name & Emergency Contact Number */}
        <div className="flex flex-col gap-6 xl:flex-row"> 
          <CustomFormFeild
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="emergencyContactName"
              label="Emergency contact name"
              placeholder="Guardian's name"
            />

            <CustomFormFeild
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="emergencyContactNumber"
              label="Emergency contact number"
              placeholder="(84) 123-4567"
            />
        </div>
        </section>
        {/* PRIMARY CARE PHYSICIAN */}
        <section className=" space-y-6">
            <div className="mb-9 space-y-1"></div>
            <h2 className="sub-header">Personal Information</h2>
          <CustomFormFeild
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="primaryPhysician"
                label="Primary care physician"
                placeholder="Select a physician"
                >
                  {Doctors.map((doctor) => (
                    <SelectItem key={doctor.name} value={doctor.name}>
                      <div className="flex cursor-pointer items-center gap-2">
                        <Image
                        src={doctor.image}
                        height={32}
                        width={32}
                        alt={doctor.name}
                        className="rounded-full border border-dark-500"
                        /> 
                        <p>
                          {doctor.name}
                        </p>

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
            label="Insurance provider"
            placeholder="BIC, VASS, MIC"
            
            />
            <CustomFormFeild 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="isurancePolicyNumber"
            label="Insurance policy number"
            placeholder="123456789"
            
            />
          </div>
          {/* ALLERGY & CURRENT MEDICATIONS */}
          <div className="flex flex-col gap-6 xl:flex-row"> 
            <CustomFormFeild 
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies"
            placeholder="Peanuts, Milk, Eggs"
            
            />
            <CustomFormFeild 
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current medication (If any)"
            placeholder="Aspirin, Ibuprofen"
            
            />
          </div>
          {/* FAMILY MEDICATION & PAST MEDICATIONS */}
          <div className="flex flex-col gap-6 xl:flex-row"> 
            <CustomFormFeild 
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="medicalFamilyHistory"
            label="Family medical history"
            placeholder="Mother had heart Diabetes...."
            
            />
            <CustomFormFeild 
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past medical history"
            placeholder="Pneumonia...."
            
            />
          </div>
        </section>
        {/* Identification and Verfication */}
        
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verfication</h2>
          </div>
          <CustomFormFeild
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="identificationType"
                label="Identification type"
                placeholder="Select an identification type"
                >
                  {IdentificationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                  
          </CustomFormFeild>
          <CustomFormFeild
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Identification Number"
            placeholder="123456789"
          />
          <CustomFormFeild
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Scanned Copy of Identification Document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />
        </section>
        {/* Consent and Privacy */}
        <section className=" space-y-6">
            <div className="mb-9 space-y-1"></div>
            <h2 className="sub-header">Consent and Privacy</h2>

          <CustomFormFeild
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition."
          />
          <CustomFormFeild
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health
            information for treatment purposes."
          />
          <CustomFormFeild
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the
            privacy policy."
          />
        </section>
        {/*  */}
        <SubmitButton isLoading={isLoading}> Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm

