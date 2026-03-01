import { useRouteError } from "react-router";
import { Button, Typography, Paper } from "@mui/material";
import { WarningAmber } from "@mui/icons-material";

function ErrorBoundary() {
  // Hook do React Router que apanha qualquer erro (de renderização, loaders ou actions)
  const error = useRouteError() as any;

  console.error("Erro capturado pelo React Router:", error);

  const handleReload = () => {
    // Em vez de recarregar a página quebrada, volta ao início por segurança
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Paper className="p-8 max-w-md w-full flex flex-col items-center text-center gap-4 rounded-2xl shadow-lg border border-red-100">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
          <WarningAmber fontSize="large" />
        </div>
        <Typography variant="h5" className="!font-black text-gray-800">
          Oops! Algo deu errado.
        </Typography>
        <Typography variant="body2" className="text-gray-500 mb-4">
          Ocorreu um erro inesperado no sistema. Por favor, volte à página
          inicial. Caso necessário, notifique o suporte.
        </Typography>

        {/* Mostra o erro técnico apenas em ambiente de desenvolvimento */}
        {import.meta.env.DEV && (
          <div className="bg-gray-100 p-3 rounded-lg w-full text-left overflow-auto mb-4">
            <Typography
              variant="caption"
              className="font-mono text-red-500 break-words"
            >
              {error?.message || error?.statusText || "Erro desconhecido"}
            </Typography>
          </div>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleReload}
          className="!py-3 !rounded-xl !text-base"
        >
          Voltar ao Início
        </Button>
      </Paper>
    </div>
  );
}

export default ErrorBoundary;
