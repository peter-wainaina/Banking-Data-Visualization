"use client"

import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "solid"
  size?: "icon" | "default"
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "outline",
  size = "default",
  className = "",
  ...props
}) => {
  const base = "inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variants = {
    outline: "border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-100",
    solid: "bg-blue-600 text-white hover:bg-blue-700 border border-blue-600",
  }
  const sizes = {
    icon: "h-9 w-9 p-0",
    default: "h-10 px-4 py-2",
  }
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
