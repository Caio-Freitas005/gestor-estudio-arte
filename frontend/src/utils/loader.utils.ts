export function getCommonParams(request: Request, extraKeys: string[] = []) {
  const url = new URL(request.url);

  // Parâmetros padrão de todas as listagens
  const params: Record<string, any> = {
    q: url.searchParams.get("q") || undefined,
    page: Number(url.searchParams.get("page")) || 0,
    limit: Number(url.searchParams.get("limit")) || 10,
  };

  // Calcula o skip automaticamente
  params.skip = params.page * params.limit;

  // Extrai chaves específicas da página (status, min_total, etc)
  extraKeys.forEach((key) => {
    params[key] = url.searchParams.get(key) || undefined;
  });

  return params;
}
