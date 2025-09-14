"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import SubmitButton from "../SubmitButton";
import CustomFormField from "../CustomFormFeild";
import { FormFieldType } from "./PatientForm";
import { deleteClinicalNotes, updateClinicalNotes } from "@/lib/actions/apointment.actions";

// Schema để xác thực dữ liệu nhập vào
const formSchema = z.object({
  notes: z.string().min(1, "Notes cannot be empty."),
});

// Props của component
interface ClinicalNotesFormProps {
  appointmentId: string;
  initialNotes?: string | null;
}

const ClinicalNotesForm = ({
  appointmentId,
  initialNotes,
}: ClinicalNotesFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // State để quản lý chế độ xem/sửa
  const [isEditing, setIsEditing] = useState(!initialNotes);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { notes: initialNotes || "" },
  });

  // Hàm xử lý khi lưu/cập nhật ghi chú
  const handleSave = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        await updateClinicalNotes({
          appointmentId,
          notes: values.notes,
        });
        setIsEditing(false); // Chuyển về chế độ xem
        // router.refresh() sẽ được gọi gián tiếp qua revalidatePath
      } catch (error) {
        console.error("Failed to save notes:", error);
      }
    });
  };

  // Hàm xử lý khi xóa ghi chú
  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await deleteClinicalNotes(appointmentId);
        form.reset({ notes: "" });
        setIsEditing(true); // Chuyển sang chế độ sửa sau khi xóa
      } catch (error) {
        console.error("Failed to delete notes:", error);
      }
    });
  };
  
  // ============================================================
  // GIAO DIỆN KHI Ở CHẾ ĐỘ XEM (ĐÃ CÓ GHI CHÚ)
  // ============================================================
  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="prose max-w-full rounded-lg border bg-gray-50 p-4">
          <p className="whitespace-pre-wrap">{initialNotes}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(true)}>Chỉnh sửa ghi chú</Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Xoá ghi chú</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="shad-alert-dialog">
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể hoàn tác. Nó sẽ xóa vĩnh viễn ghi chú lâm sàng.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Huỷ</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isPending}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isPending ? "Deleting..." : "Yes, delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  }

  // ============================================================
  // GIAO DIỆN KHI Ở CHẾ ĐỘ SỬA (CHƯA CÓ GHI CHÚ HOẶC ĐANG SỬA)
  // ============================================================
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="notes"
          placeholder="Enter diagnosis, prescription, follow-up, etc..."
        />
        <div className="flex items-center gap-2">
          <SubmitButton isLoading={isPending}>
            {initialNotes ? "Cập nhật ghi chú" : "Lưu ghi chú"}
          </SubmitButton>

          {/* Nút Cancel chỉ hiển thị khi đang sửa một ghi chú đã có */}
          {initialNotes && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                form.reset({ notes: initialNotes }); // Hoàn tác thay đổi
                setIsEditing(false);
              }}
            >
              Huỷ
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default ClinicalNotesForm;