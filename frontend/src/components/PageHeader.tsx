import { Typography, Button } from "@mui/material";
import { Link } from "react-router";

interface PageHeaderProps {
  title: string;
  highlight: string;
  subtitle: string;
  buttonLabel: string;
  buttonTo: string;
}

function PageHeader({ title, highlight, subtitle, buttonLabel, buttonTo }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-end border-b border-gray-100 pb-4">
      <div className="flex flex-col">
        <Typography variant="h5" className="!font-black text-gray-800 tracking-tight">
          {title} <span className="text-pink-500">{highlight}</span>
        </Typography>
        <Typography variant="caption" className="text-gray-400 uppercase tracking-widest font-bold">
          {subtitle}
        </Typography>
      </div>
      <Button
        component={Link}
        to={buttonTo}
        variant="contained"
        className="!bg-pink-500 !font-bold !rounded-xl shadow-md px-6 py-2"
        disableElevation
      >
        {buttonLabel}
      </Button>
    </div>
  );
}

export default PageHeader;