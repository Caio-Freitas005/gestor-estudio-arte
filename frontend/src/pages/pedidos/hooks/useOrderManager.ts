import { useState } from "react";
import { useAppToast } from "@/hooks/useAppToast";
import { useSubmit, useFetcher } from "react-router";
import { ItemPedidoInput, PedidoPublic } from "@/types/pedido.types";
import { cleanFormData, parseBrazilianNumber } from "@/utils/form.utils";
import { FILE_UPLOAD_PREFIX } from "@/utils/constants";
import toast from "react-hot-toast";

export function useOrderManager(
  defaultValues?: PedidoPublic,
  isEditing?: boolean,
) {
  const submit = useSubmit();
  const fetcher = useFetcher();

  // Substitui o useEffect anterior, escutando em segundo plano e trazendo erros
  useAppToast(fetcher.data);

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
      setLocalItems((prev) => {
        // Verifica se o item já existe na lista temporária
        const itemExistente = prev.find(
          (it) => it.produto_id === newItem.produto_id,
        );

        if (itemExistente) {
          // Se existir, cria uma nova lista atualizando os dados

          // Dispara o Toast
          toast.success("Item atualizado com sucesso!");
          return prev.map((it) =>
            it.produto_id === newItem.produto_id
              ? {
                  ...it,
                  quantidade:
                    Number(it.quantidade) + Number(newItem.quantidade),
                  // Se existir, cria uma nova lista atualizando os dados
                  preco_unitario: newItem.preco_unitario,
                  // Se digitou uma nova observação, substitui. Se deixou em branco, mantém a antiga.
                  observacoes: newItem.observacoes
                    ? newItem.observacoes
                    : it.observacoes,
                }
              : it,
          );
        }
        // Se não existir, adiciona normalmente
        toast.success("Item adicionado ao pedido!");
        return [...prev, newItem];
      });
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
      if (confirm("Deseja remover este item do pedido?")) {
        setLocalItems((prev) => {
          // Se o item tinha uma arte temporária (blob), limpa da RAM antes de remover
          const itemToRemove = prev.find((it) => it.produto_id === produto_id);
          if (itemToRemove?.caminho_arte?.startsWith("blob:")) {
            URL.revokeObjectURL(itemToRemove.caminho_arte);
          }
          return prev.filter((it) => it.produto_id !== produto_id);
        });

        // Remove também dos arquivos pendentes
        setPendingFiles((prev) => {
          const newMap = new Map(prev);
          newMap.delete(produto_id);
          return newMap;
        });

        toast.success("Item removido com sucesso.");
      }
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
      toast.success("Item atualizado com sucesso!");
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

      // Assim que enviar para o backend, limpa todas as URLs temporárias da RAM
      localItems.forEach((item) => {
        if (item.caminho_arte?.startsWith("blob:")) {
          URL.revokeObjectURL(item.caminho_arte);
        }
      });
    }
  };

  const handleUpload = (file: File, produto_id: number) => {
    // Validação de UX (fail fast)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Formato inválido! Por favor, selecione apenas imagens (JPG, JPEG, PNG ou WEBP).",
      );
      return; // Para a execução e não envia nada para o backend
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error(
        "A imagem é muito pesada! O tamanho máximo permitido é 15MB.",
      );
      return;
    }

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
      setLocalItems((prev) => {
        // 🧹 LIMPEZA 3: Se já existia uma imagem para este produto e ela foi substituída, limpa a antiga
        const itemExistente = prev.find((it) => it.produto_id === produto_id);
        if (itemExistente?.caminho_arte?.startsWith("blob:")) {
          URL.revokeObjectURL(itemExistente.caminho_arte);
        }
        return prev.map((it) =>
          it.produto_id === produto_id
            ? { ...it, caminho_arte: previewUrl }
            : it,
        );
      });

      setPendingFiles(new Map(pendingFiles.set(produto_id, file)));
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
