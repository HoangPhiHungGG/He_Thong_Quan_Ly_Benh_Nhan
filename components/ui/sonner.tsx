

"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
           toast:
            "group toast group-[.toaster]:bg-foreground group-[.toaster]:text-text-primary group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          title: "group-[.toast]:text-text-primary group-[.toast]:font-semibold", // Thêm class cho tiêu đề
          description: "group-[.toast]:text-text-secondary", // Màu chữ phụ
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
            
          // Thêm style cho các loại toast khác nhau
          success: "group-[.toast]:bg-success/10 group-[.toast]:text-success group-[.toast]:border-success/20",
          error: "group-[.toast]:bg-destructive/10 group-[.toast]:text-destructive group-[.toast]:border-destructive/20",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }