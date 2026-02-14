import { Paper, Typography } from "@mui/material";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

function StatCard({ label, value, icon, colorClass }: StatCardProps) {
  return (
    <Paper className="p-6 !rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className={`absolute right-[-10px] top-[-10px] opacity-5 group-hover:opacity-10 transition-opacity ${colorClass}`}>
        {icon}
      </div>
      <Typography variant="caption" className="!font-black !text-slate-400 !uppercase !tracking-widest">
        {label}
      </Typography>
      <div className="flex items-baseline gap-2 mt-1">
        <Typography variant="h4" className={`!font-black ${colorClass}`}>
          {value}
        </Typography>
      </div>
    </Paper>
  );
}

export default StatCard;