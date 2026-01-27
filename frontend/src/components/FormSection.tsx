import { ReactNode } from "react";
import { Typography } from "@mui/material";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  className?: string; 
}

function FormSection({ title, children, className = "" }: FormSectionProps) {
  return (
    <div className="p-6 !rounded-2xl bg-white relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-pink-500"></div>
      <Typography
        variant="subtitle2"
        className="!mb-6 !font-bold !text-pink-600 uppercase tracking-wider"
      >
        {title}
      </Typography>

      <div className={className}>{children}</div>
    </div>
  );
}

export default FormSection;
