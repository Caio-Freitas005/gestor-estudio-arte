import { Typography } from "@mui/material";
import { Cake } from "@mui/icons-material";
import FormSection from "@/components/FormSection";
import { ClientePublic } from "@/types/cliente.types";

interface BirthdayWidgetProps {
  clientes: ClientePublic[];
}

function BirthdayWidget({ clientes }: BirthdayWidgetProps) {
  return (
    <FormSection title="Aniversariantes do Mês">
      {clientes.length === 0 ? (
        <Typography variant="body2" className="text-gray-400 italic">
          Nenhum aniversariante este mês.
        </Typography>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {clientes.map((cliente) => (
            <div
              key={cliente.id}
              className="flex items-center gap-3 p-3 bg-pink-50/50 rounded-xl border border-pink-100"
            >
              <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white shadow-sm">
                <Cake fontSize="small" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-800 text-sm">
                  {cliente.nome}
                </span>
                <span className="text-[11px] text-pink-600 font-medium">
                  Dia {new Date(cliente.data_nascimento!).getUTCDate()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </FormSection>
  );
}

export default BirthdayWidget;
