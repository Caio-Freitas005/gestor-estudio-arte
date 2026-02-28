import { useEffect } from "react";
import { useActionData } from "react-router";
import toast from "react-hot-toast";

export function useAppToast(specificData?: any) {
  const actionData = useActionData() as any;

  // Se o hook recebeu specificData (ex: fetcher.data), ele olha só para ele.
  // Se não recebeu nada, ele olha para o actionData da página.
  const isFetcher = specificData !== undefined;
  const dataToWatch = isFetcher ? specificData : actionData;

  useEffect(() => {
    if (!dataToWatch) return;

    if (dataToWatch.error) {
      toast.error(dataToWatch.error);
    } else if (dataToWatch.success) {
      const msg = typeof dataToWatch.success === "string" 
        ? dataToWatch.success 
        : "Operação realizada com sucesso!";
      toast.success(msg);
    }
  }, [dataToWatch]); 
}