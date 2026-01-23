import { useState, useEffect } from "react";
import { useSubmit, useFetcher } from "react-router";
import { ItemPedidoInput, PedidoPublic } from "../../../types/pedido.types"

export function useOrderManager(defaultValues?: PedidoPublic, isEditing?: boolean) {
  const submit = useSubmit();
  const fetcher = useFetcher();
  
  // Estado para novos itens (criação)
  const [localItems, setLocalItems] = useState<ItemPedidoInput[]>([]);
  
  // Estado para arquivos que esperam a criação do pedido
  const [pendingFiles, setPendingFiles] = useState<Map<number, File>>(new Map());

  // Sincroniza itens ao editar
  useEffect(() => {
    if (!isEditing && defaultValues?.itens) {
      setLocalItems(defaultValues.itens.map(it => ({ ...it })));
    }
  }, [defaultValues, isEditing]);

  const handleUpload = (file: File, cd_produto: number) => {
    if (isEditing) {
      // Edição: Envia logo para o servidor
      const fd = new FormData();
      fd.append("file", file);
      fetcher.submit(fd, { 
        method: "post", 
        action: `/pedidos/${defaultValues?.cd_pedido}/itens/${cd_produto}/upload-arte`,
        encType: "multipart/form-data" 
      });
    } else {
      // Criação: Preview local e guarda para depois
      const previewUrl = URL.createObjectURL(file);
      setPendingFiles(new Map(pendingFiles.set(cd_produto, file)));
      setLocalItems(prev => prev.map(it => 
        it.cd_produto === cd_produto ? { ...it, ds_caminho_arte: previewUrl } : it
      ));
    }
  };

  return { localItems, setLocalItems, pendingFiles, handleUpload, fetcher, submit };
}