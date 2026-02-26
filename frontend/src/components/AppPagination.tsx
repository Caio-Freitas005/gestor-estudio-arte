import { TablePagination } from "@mui/material";
import { useSearchParams } from "react-router";

interface AppPaginationProps {
  total: number;
}

function AppPagination({ total }: AppPaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 0;
  const limit = Number(searchParams.get("limit")) || 10;

  const handleChangePage = (_: any, newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchParams((prev) => {
      prev.set("limit", event.target.value);
      prev.set("page", "0"); // Reseta para a primeira página ao mudar o limite
      return prev;
    });
  };

  return (
    <TablePagination
      component="div"
      count={total}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={limit}
      onRowsPerPageChange={handleChangeRowsPerPage}
      labelRowsPerPage="Linhas por página:"
      labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
    />
  );
}

export default AppPagination;
