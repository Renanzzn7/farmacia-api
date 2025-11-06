export interface PedidoDTO {
    idPedido?: number,        // ID do pedido (opcional)
    idCliente: number,        // ID do cliente (chave estrangeira)
    dataPedido: string,       // Data do pedido (formato YYYY-MM-DD)
    valorTotal: number        // Valor total do pedido
}
