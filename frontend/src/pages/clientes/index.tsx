import { useState } from "react";
import { ClientePublic } from "../../types/cliente.types";
import { Link, useLoaderData, useFetcher } from "react-router";
import { formatPhone,formatDate } from "../../utils/format.utils";

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
  const clients = (useLoaderData() as ClientePublic[]) || [];
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
        buttonLabel="Novo CLiente"
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
              <TableCell
                align="center"
                className="!font-bold text-gray-400 !text-[10px] !uppercase !tracking-wider"
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.length === 0 ? (
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
              clients.map((client) => (
                <TableRow
                  key={client.cd_cliente}
                  className="hover:bg-pink-50/10 transition-colors group border-b border-gray-50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-pink-100 group-hover:text-pink-500 transition-colors">
                        <PersonOutline fontSize="small" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 leading-tight">
                          {client.nm_cliente}
                        </span>
                        <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">
                          ID #{client.cd_cliente}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {client.cd_telefone && (
                        <div className="flex items-center text-sm text-gray-600 font-medium">
                          <WhatsApp
                            fontSize="inherit"
                            className="me-2 text-green-500"
                          />
                          {formatPhone(client.cd_telefone)}
                        </div>
                      )}
                      {client.nm_email && (
                        <div className="flex items-center text-sm text-gray-600 italic">
                          <Email
                            fontSize="inherit"
                            className="me-2 text-pink-400"
                          />
                          {client.nm_email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 font-medium text-sm">
                    {client.dt_nascimento
                      ? formatDate(client.dt_nascimento)
                      : "-"}
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex justify-center gap-1">
                      <Tooltip title="Editar">
                        <IconButton
                          component={Link}
                          to={`${client.cd_cliente}`}
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
                          onClick={() => setDeleteId(client.cd_cliente)}
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
        content="Tem certeza que deseja remover esse cliente? Essa ação não pode ser desfeita."
        onConfirm={confirmDelete}
      ></DeleteDialog>
    </div>
  );
}

export default ClientsListPage;
