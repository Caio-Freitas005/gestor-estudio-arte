import { useState } from "react";
import { Link, useLoaderData, useFetcher } from "react-router";
import { DeleteOutline, Edit, SellOutlined } from "@mui/icons-material";
import { ProdutoPaginated } from "../../types/produto.types";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import PageHeader from "../../components/PageHeader";
import DeleteDialog from "../../components/DeleteDialog";
import AppPagination from "../../components/AppPagination";
import Searchbar from "../../components/Searchbar";
import RangeFilter from "../../components/RangeFilter";

function ProductsListPage() {
  const { produtos } = useLoaderData() as {
    produtos: ProdutoPaginated;
  };
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
                  Catálogo vazio.
                </TableCell>
              </TableRow>
            ) : (
              produtos.dados.map((produto) => (
                <TableRow
                  key={produto.id}
                  className="hover:bg-pink-50/10 transition-colors group border-b border-gray-50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-pink-50 rounded-xl text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-all shadow-sm shadow-pink-50">
                        <SellOutlined fontSize="small" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 leading-tight">
                          {produto.nome}
                        </span>
                        <span className="text-[10px] text-gray-400 italic">
                          {produto.descricao || "Sem descrição"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={produto.unidade_medida || "UN"}
                      size="small"
                      className="!bg-gray-100 !text-gray-600 !font-black !text-[9px] !rounded-md"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <span className="font-mono font-bold text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-50 text-sm">
                      R$ {Number(produto.preco_base).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex justify-center gap-1">
                      <Tooltip title="Editar">
                        <IconButton
                          component={Link}
                          to={`${produto.id}`}
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
                          onClick={() => setDeleteId(produto.id)}
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
