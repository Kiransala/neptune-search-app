interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
}

export default function LoadingSpinner({ size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return <div className={`animate-spin rounded-full border-2 border-white/30 border-t-white ${sizeClasses[size]}`} />
}
