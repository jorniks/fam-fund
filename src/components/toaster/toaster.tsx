// Tremor Raw Toaster [v0.0.0]

"use client"

import { useToast } from "@/components/toaster/use-toast"

import { Toast, ToastProvider, ToastViewport } from "@/components/toaster/toast"

const Toaster = () => {
  const { toasts } = useToast()

  return (
    <ToastProvider swipeDirection="left">
      {toasts.map(({ id, ...props }) => {
        return <Toast key={id} {...props} />
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

export { Toaster }