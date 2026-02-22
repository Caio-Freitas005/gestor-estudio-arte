import { useState } from "react";
import { useSubmit, useFetcher } from "react-router";
import { ItemPedidoInput, PedidoPublic } from "../../../types/pedido.types";
import { cleanFormData, parseBrazilianNumber } from "../../../utils/form.utils";
import { FILE_UPLOAD_PREFIX } from "../../../utils/constants";

export function useOrderManager(
  defaultValues?: PedidoPublic,
  isEditing?: boolean,
) {
  const submit = useSubmit();
  const fetcher = useFetcher();

  // Estado para novos itens (criação)
  const [localItems, setLocalItems] = useState<ItemPedidoInput[]>([]);

  // Estado para arquivos que esperam a criação do pedido
  const [pendingFiles, setPendingFiles] = useState<Map<number, File>>(
    new Map(),
  );

  const addItem = (newItem: ItemPedidoInput) => {
    if (isEditing) {
      fetcher.submit(
        { intent: "add_item", ...newItem },
        { method: "post", encType: "application/json" },
      );
    } else {
      setLocalItems((prev) => [...prev, newItem]);
    }
  };

  const removeItem = (produto_id: number) => {
    if (isEditing) {
      if (confirm("Deseja remover este item do pedido?")) {
        fetcher.submit(
          { intent: "remove_item", produto_id },
          { method: "post", encType: "application/json" },
        );
      }
    } else {
      setLocalItems((prev) =>
        prev.filter((it) => it.produto_id !== produto_id),
      );
    }
  };

  const updateItem = (updatedItem: any) => {
    if (isEditing) {
      fetcher.submit(
        { intent: "update_item", ...updatedItem },
        { method: "post", encType: "application/json" },
      );
    } else {
      setLocalItems((prev) =>
        prev.map((it) =>
          it.produto_id === updatedItem.produto_id ? updatedItem : it,
        ),
      );
    }
  };

  const saveOrder = (formData: FormData) => {
    const headerData = cleanFormData<any>(formData);

    // Cria o objeto base com as conversões necessárias
    const processedData = {
      ...headerData,
      cliente_id: Number(headerData.cliente_id),
      desconto: parseBrazilianNumber(headerData.desconto),
    };

    if (isEditing) {
      submit(processedData, { method: "post", encType: "application/json" });
    } else {
      const finalData = new FormData();
      finalData.append(
        "orderData",
        JSON.stringify({
          ...processedData,
          itens: localItems.map(({ caminho_arte, ...rest }) => rest),
        }),
      );

      pendingFiles.forEach((file, id) =>
        finalData.append(`${FILE_UPLOAD_PREFIX}${id}`, file),
      );
      
      submit(finalData, { method: "post", encType: "multipart/form-data" });
    }
  };

  const handleUpload = (file: File, produto_id: number) => {
    if (isEditing) {
      const fd = new FormData();
      fd.append("file", file);
      fetcher.submit(fd, {
        method: "post",
        action: `/pedidos/${defaultValues?.id}/itens/${produto_id}/upload-arte`,
        encType: "multipart/form-data",
      });
    } else {
      const previewUrl = URL.createObjectURL(file);
      setPendingFiles(new Map(pendingFiles.set(produto_id, file)));
      setLocalItems((prev) =>
        prev.map((it) =>
          it.produto_id === produto_id
            ? { ...it, caminho_arte: previewUrl }
            : it,
        ),
      );
    }
  };

  return {
    localItems,
    addItem,
    removeItem,
    updateItem,
    saveOrder,
    handleUpload,
  };
}
