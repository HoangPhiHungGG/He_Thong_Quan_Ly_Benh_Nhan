'use client'
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FormFieldType } from "./forms/PatientForm"
import { Control } from "react-hook-form"
import Image from "next/image"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import DatePicker from "react-datepicker";
import { E164Number } from 'libphonenumber-js';


import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Checkbox } from "./ui/checkbox"

interface CustomProps {
    control: Control<any>,
    fieldType: FormFieldType,
    name:string,
    label?:string,
    placeholder?: string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?:boolean,
    dateFormat?: string,
    showTimeSelect?: boolean,
    children?:React.ReactNode,
    renderSkeleton?: (field:any) => React.ReactNode
  
}

const RenderField = ({field, props} : {field:any ; props: CustomProps}) => {
    const {fieldType, iconSrc, iconAlt,placeholder, showTimeSelect,dateFormat, renderSkeleton} = props
    switch(fieldType) {
        case FormFieldType.INPUT:

        return(
            <div className="flex rounded-md border border-dark-500 bg-dark-400">
                {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              className="shad-input border-0"
            />
          </FormControl>
            </div>
        )
        // textarea
        case FormFieldType.TEXTAREA:
          return(
            <FormControl>
              <Textarea
                placeholder={placeholder}
                {...field}
                className="shad-textarea"
                disabled={props.disabled}
                />
            </FormControl>
          )
        // phone input
        case FormFieldType.PHONE_INPUT:
            return(
              <FormControl>
              <PhoneInput
                defaultCountry="VN"
                placeholder={props.placeholder}
                international
                withCountryCallingCode
                value={field.value as E164Number | undefined}
                onChange={field.onChange}
                className="input-phone"
              />
            </FormControl>
          )
        // datepicker
        case FormFieldType.DATE_PICKER:
          return(
            <div className="flex rounded-mb border border-dark-500 bg-dark-400">
              <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
              className="ml-2"
              />
              <FormControl>
              <DatePicker selected={field.value} onChange={(date) => field.onChange(date)}
              dateFormat={dateFormat ?? 'MM/dd/yyy'}
              showTimeSelect={showTimeSelect ?? false}
              timeInputLabel="Time:"
              wrapperClassName="date-picker" />
              </FormControl>
                
            </div>
          )
        //select  
          case FormFieldType.SELECT:
            return (
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="shad-select-trigger">
                      <SelectValue placeholder={props.placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="shad-select-content">
                    {props.children}
                  </SelectContent>
                </Select>
              </FormControl>
            );
        // skeleton

        case FormFieldType.SKELETON:
          return props.renderSkeleton ? props.renderSkeleton(field) : null 
        // checkbox
        case FormFieldType.CHECKBOX:
          return (
            <FormControl>
              <div className="flex items-center gap-4">
                <Checkbox
                  id={props.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
              </div>
            </FormControl>
          )
        default:
        break;
    }
}
const CustomFormFeild = (props: CustomProps) => {
    const {control,fieldType,name,label} = props
    
  return (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex-1">
            {fieldType !== FormFieldType.CHECKBOX && label &&(
                <FormLabel>
                    {label}
                </FormLabel>
            )}
            <RenderField field={field} props={props}/>
            <FormMessage className="shad-error"/>
         </FormItem>
        )}
          />
  )
}

export default CustomFormFeild