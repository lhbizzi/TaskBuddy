export function handleError(error) {
  if (!error) return "Erro desconhecido.";
  if (typeof error === "string") return error;
  // Se vier mensagem tratada do back-end, exibe ela
  if (error.message && typeof error.message === "string") {
    return error.message;
  }
  if (error.status) {
    switch (error.status) {
      case 404:
        return "Recurso não encontrado (404). Verifique se o endereço está correto.";
      case 500:
        return "Erro interno do servidor (500). Tente novamente mais tarde.";
      case 401:
        return "Não autorizado (401). Faça login para acessar.";
      case 400:
        return "Requisição inválida (400). Verifique os dados enviados.";
      case 403:
        return "Acesso proibido (403). Você não tem permissão para acessar este recurso.";
      case 408:
        return "Tempo de requisição esgotado (408). Tente novamente.";
      default:
        return `Erro ${error.status}: ${
          error.statusText || "Ocorreu um erro."
        }`;
    }
  }
  if (error.message) return error.message;
  return "Ocorreu um erro inesperado.";
}
