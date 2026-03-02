import { useEffect, useState } from "react";
import { useAppToast } from "@/hooks/useAppToast";
import { useLoaderData, useFetcher, useSearchParams } from "react-router";
import { ProdutoPaginated } from "@/types/produto.types";

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
import RangeFilter from "@/components/RangeFilter";
import ProductTableRow from "./components/ProductTableRow"; // REFATORAÇÃO: O novo componente

function ProductsListPage() {
  const { produtos } = useLoaderData() as {
    produtos: ProdutoPaginated;
  };
  const fetcher = useFetcher();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useAppToast(fetcher.data);

  const confirmDelete = () => {
    if (deleteId) {
      fetcher.submit(null, {
        method: "post",
        action: `${deleteId}/excluir`,
      });
    }
  };

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setDeleteId(null);
    }
  }, [fetcher.state, fetcher.data]);

  const [searchParams] = useSearchParams();
  const hasFilter =
    searchParams.get("q") ||
    searchParams.get("min_preco") ||
    searchParams.get("max_preco");

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <PageHeader
        title="Catálogo de"
        highlight="Produtos"
        subtitle="Itens e Personalizáveis"
        buttonLabel="Novo Produto"
        buttonTo="cadastrar"
      ></PageHeader>

      <Searchbar placeholder="Buscar por nome, descrição ou unidade de medida">
        <RangeFilter label="Preço" paramMin="min_preco" paramMax="max_preco" />
      </Searchbar>

      <TableContainer className="!border-none !shadow-none overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <Table sx={{ minWidth: 650 }}>
          <TableHead className="bg-gray-50/50">
            <TableRow>
              <TableCell className="!font-bold text-gray-400 !text-[10px] !uppercase !tracking-wider">
                Produto
              </TableCell>
              <TableCell className="!font-bold text-gray-400 !text-[10px] !uppercase !tracking-wider">
                Unidade
              </TableCell>
              <TableCell
                align="right"
                className="!font-bold text-gray-400 !text-[10px] !uppercase !tracking-wider"
              >
                Valor Base
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
            {produtos.dados.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  className="py-20 text-gray-400 italic"
                >
                  {hasFilter
                    ? "Nenhum resultado encontrado para esta busca."
                    : "Catálogo vazio. Cadastre algum produto."}
                </TableCell>
              </TableRow>
            ) : (
              produtos.dados.map((produto) => (
                <ProductTableRow 
                  key={produto.id} 
                  produto={produto} 
                  onDelete={setDeleteId} 
                />
              ))
            )}
          </TableBody>
        </Table>
        <AppPagination total={produtos.total} />
      </TableContainer>

      <DeleteDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Excluir Produto"
        content="Tem certeza que deseja remover esse produto? Essa ação não pode ser desfeita."
        onConfirm={confirmDelete}
      ></DeleteDialog>
    </div>
  );
}

export default ProductsListPage;