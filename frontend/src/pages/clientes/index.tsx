import { useEffect, useState } from "react";
import { useAppToast } from "@/hooks/useAppToast";
import { ClientePaginated } from "@/types/cliente.types";
import { useLoaderData, useFetcher, useSearchParams } from "react-router";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import PageHeader from "@/components/PageHeader";
import DeleteDialog from "@/components/DeleteDialog";
import AppPagination from "@/components/AppPagination";
import Searchbar from "@/components/Searchbar";
import ClientTableRow from "./components/ClientTableRow";

function ClientsListPage() {
  const { clientes } = useLoaderData() as {
    clientes: ClientePaginated;
  };

  const fetcher = useFetcher();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Passa os dados do fetcher para o hook ouvir as respostas de segundo plano
  useAppToast(fetcher.data);

  const confirmDelete = () => {
    if (deleteId) {
      fetcher.submit(null, {
        method: "post",
        action: `${deleteId}/excluir`,
      });
    }
  };

  // Para fechar o modal só quando a API responder
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setDeleteId(null);
    }
  }, [fetcher.state, fetcher.data]);

  // Para verificar se é uma busca de filtro
  const [searchParams] = useSearchParams();
  const hasFilter = searchParams.get("q");

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <PageHeader
        title="Meus"
        highlight="Clientes"
        subtitle="Relacionamento e Contato"
        buttonLabel="Novo Cliente"
        buttonTo="cadastrar"
      ></PageHeader>

      <Searchbar placeholder="Buscar por nome, email ou telefone" />

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
            {clientes.dados.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  className="py-20 text-gray-400 italic"
                >
                  {hasFilter
                    ? "Nenhum resultado encontrado para esta busca."
                    : "Nenhum cliente cadastrado. Cadastre algum cliente."}
                </TableCell>
              </TableRow>
            ) : (
              clientes.dados.map((cliente) => (
                <ClientTableRow
                  key={cliente.id}
                  cliente={cliente}
                  onDelete={setDeleteId}
                />
              ))
            )}
          </TableBody>
        </Table>
        <AppPagination total={clientes.total} />
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
