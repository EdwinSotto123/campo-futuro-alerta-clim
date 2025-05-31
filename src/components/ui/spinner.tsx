import React from "react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Spinner = ({ className, ...props }: SpinnerProps) => {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-solid border-green-500 border-t-transparent ${className || 'w-8 h-8'}`}
      {...props}
    />
  );
}; 