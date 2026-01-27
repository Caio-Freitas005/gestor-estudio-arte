import { useState, useEffect } from "react";
import { useSubmit, useFetcher } from "react-router";
import { ItemPedidoInput, PedidoPublic } from "../../../types/pedido.types";
import { cleanFormData } from "../../../utils/form.utils";

export function useOrderManager(
  defaultValues?: PedidoPublic,
  isEditing?: boolean
) {
  const submit = useSubmit();
  const fetcher = useFetcher();

  // Estado para novos itens (criação)
  const [localItems, setLocalItems] = useState<ItemPedidoInput[]>([]);

  // Estado para arquivos que esperam a criação do pedido
  const [pendingFiles, setPendingFiles] = useState<Map<number, File>>(
    new Map()
  );

  // Sincroniza itens ao editar
  useEffect(() => {
    if (!isEditing && defaultValues?.itens) {
      setLocalItems(defaultValues.itens.map((it) => ({ ...it })));
    }
  }, [defaultValues, isEditing]);

  const addItem = (newItem: ItemPedidoInput) => {
    if (isEditing) {
      fetcher.submit(
        { intent: "add_item", ...newItem },
        { method: "post", encType: "application/json" }
      );
    } else {
      setLocalItems((prev) => [...prev, newItem]);
    }
  };

  const removeItem = (cd_produto: number) => {
    if (isEditing) {
      if (confirm("Deseja remover este item do pedido?")) {
        fetcher.submit(
          { intent: "remove_item", cd_produto },
          { method: "post", encType: "application/json" }
        );
      }
    } else {
      setLocalItems((prev) =>
        prev.filter((it) => it.cd_produto !== cd_produto)
      );
    }
  };

  const updateItem = (updatedItem: any) => {
    if (isEditing) {
      submit(
        { intent: "update_item", ...updatedItem },
        { method: "post", encType: "application/json" }
      );
    } else {
      setLocalItems((prev) =>
        prev.map((it) =>
          it.cd_produto === updatedItem.cd_produto ? updatedItem : it
        )
      );
    }
  };

  const saveOrder = (formData: FormData) => {
    const headerData = cleanFormData<any>(formData);
    if (isEditing) {
      submit(
        { ...headerData, cd_cliente: Number(headerData.cd_cliente) },
        { method: "post", encType: "application/json" }
      );
    } else {
      const finalData = new FormData();
      finalData.append(
        "orderData",
        JSON.stringify({
          ...headerData,
          cd_cliente: Number(headerData.cd_cliente),
          itens: localItems.map(({ ds_caminho_arte, ...rest }) => rest),
        })
      );
      pendingFiles.forEach((file, id) => finalData.append(`file_${id}`, file));
      submit(finalData, { method: "post", encType: "multipart/form-data" });
    }
  };

  const handleUpload = (file: File, cd_produto: number) => {
    if (isEditing) {
      const fd = new FormData();
      fd.append("file", file);
      fetcher.submit(fd, {
        method: "post",
        action: `/pedidos/${defaultValues?.cd_pedido}/itens/${cd_produto}/upload-arte`,
        encType: "multipart/form-data",
      });
    } else {
      const previewUrl = URL.createObjectURL(file);
      setPendingFiles(new Map(pendingFiles.set(cd_produto, file)));
      setLocalItems((prev) =>
        prev.map((it) =>
          it.cd_produto === cd_produto
            ? { ...it, ds_caminho_arte: previewUrl }
            : it
        )
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
