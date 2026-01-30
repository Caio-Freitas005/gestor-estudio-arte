import { useState } from "react";
import { ClientePublic } from "../../types/cliente.types";
import { Link, useLoaderData, useFetcher } from "react-router";
import { formatPhone, formatDate } from "../../utils/format.utils";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";

import {
  Edit,
  WhatsApp,
  Email,
  PersonOutline,
  DeleteOutline,
} from "@mui/icons-material";

import PageHeader from "../../components/PageHeader";
import DeleteDialog from "../../components/DeleteDialog";

function ClientsListPage() {
  const clientes = (useLoaderData() as ClientePublic[]) || [];
  const fetcher = useFetcher();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const confirmDelete = () => {
    if (deleteId) {
      fetcher.submit(null, {
        method: "post",
        action: `${deleteId}/excluir`,
      });
      setDeleteId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <PageHeader
        title="Meus"
        highlight="Clientes"
        subtitle="Relacionamento e Contato"
        buttonLabel="Novo Cliente"
        buttonTo="cadastrar"
      ></PageHeader>

      <TableContainer className="!border-none !shadow-none overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <Table sx={{ minWidth: 650 }}>
          <TableHead className="bg-gray-50/50">
            <TableRow>
              <TableCell className="!font-bold text-gray-400 !text-[10px] !uppercase !tracking-wider">
                Nome
              </TableCell>
              <TableCell className="!font-bold text-gray-400 !text-[10px] !uppercase !tracking-wider">
                Contato
              </TableCell>
              <TableCell className="!font-bold text-gray-400 !text-[10px] !uppercase !tracking-wider">
                Nascimento
              </TableCell>
              <TableCell className="!font-bold text-gray-400 !text-[10px] !uppercase !tracking-wider">
                Observações
              </TableCell>
              <TableCell
                align="center"
                className="!font-bold text-gray-400 !text-[10px] !uppercase !tracking-wider"
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  className="py-20 text-gray-400 italic"
                >
                  Nenhum cliente cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              clientes.map((cliente) => (
                <TableRow
                  key={cliente.id}
                  className="hover:bg-pink-50/10 transition-colors group border-b border-gray-50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-pink-100 group-hover:text-pink-500 transition-colors">
                        <PersonOutline fontSize="small" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 leading-tight">
                          {cliente.nome}
                        </span>
                        <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">
                          ID #{cliente.id}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {cliente.telefone && (
                        <div className="flex items-center text-sm text-gray-600 font-medium">
                          <WhatsApp
                            fontSize="inherit"
                            className="me-2 text-green-500"
                          />
                          {formatPhone(cliente.telefone)}
                        </div>
                      )}
                      {cliente.email && (
                        <div className="flex items-center text-sm text-gray-600 italic">
                          <Email
                            fontSize="inherit"
                            className="me-2 text-pink-400"
                          />
                          {cliente.email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 font-medium text-sm">
                    {cliente.data_nascimento
                      ? formatDate(cliente.data_nascimento)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-gray-600 font-medium !whitespace-pre-wrap !break-words text-sm">
                    {cliente.observacoes}
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex justify-center gap-1">
                      <Tooltip title="Editar">
                        <IconButton
                          component={Link}
                          to={`${cliente.id}`}
                          size="small"
                          className="opacity-0 group-hover:opacity-100 transition-all !text-pink-600 hover:!bg-pink-100"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          className="opacity-0 group-hover:opacity-100 transition-all !text-red-400 hover:!bg-red-50"
                          onClick={() => setDeleteId(cliente.id)}
                        >
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Excluir Cliente"
        content="Tem certeza que deseja remover esse clientee? Essa ação não pode ser desfeita."
        onConfirm={confirmDelete}
      ></DeleteDialog>
    </div>
  );
}

export default ClientsListPage;
