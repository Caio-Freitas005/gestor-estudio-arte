import { useState } from "react";
import { apiBase } from "@/services/apiBase";
import { Button, CircularProgress } from "@mui/material";
import { CloudSync } from "@mui/icons-material"; // Um ícone bonito de nuvem
import toast from "react-hot-toast";

export default function BackupButton() {
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleBackup = async () => {
    setIsBackingUp(true);
    
    await toast.promise(
      apiBase.post("backup/", {}),
      {
        loading: "Gerando backup...",
        success: (response: any) => response.success || "Backup salvo com sucesso!",
        error: (err: any) => err.detail || "Erro ao gerar backup.",
      }
    );

    setIsBackingUp(false);
  };

  return (
    <Button
      onClick={handleBackup}
      disabled={isBackingUp}
      startIcon={isBackingUp ? <CircularProgress size={16} color="inherit" /> : <CloudSync />}
      className="!text-slate-500 hover:!text-pink-600 hover:!bg-pink-50 !justify-start !px-4 !py-2 !w-full"
      disableElevation
    >
      {isBackingUp ? "Salvando..." : "Fazer Backup"}
    </Button>
  );
}