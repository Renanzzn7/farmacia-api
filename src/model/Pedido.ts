import type { PedidoDTO } from "../interface/PedidoDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

/**
 * Classe que representa o modelo Pedido
 */
class Pedido {

    // Atributos
    private idPedido: number = 0;
    private idCliente: number;
    private dataPedido: string;
    private valorTotal: number;

    constructor(
        _idCliente: number,
        _dataPedido: string,
        _valorTotal: number
    ) {
        this.idCliente = _idCliente;
        this.dataPedido = _dataPedido;
        this.valorTotal = _valorTotal;
    }

    public getIdPedido(): number {
        return this.idPedido;
    }

    public setIdPedido(idPedido: number): void {
        this.idPedido = idPedido;
    }

    public getIdCliente(): number {
        return this.idCliente;
    }

    public setIdCliente(idCliente: number): void {
        this.idCliente = idCliente;
    }

    public getDataPedido(): string {
        return this.dataPedido;
    }

    public setDataPedido(dataPedido: string): void {
        this.dataPedido = dataPedido;
    }

    public getValorTotal(): number {
        return this.valorTotal;
    }

    public setValorTotal(valorTotal: number): void {
        this.valorTotal = valorTotal;
    }

    /**
     * Retorna todos os pedidos cadastrados
     */
    static async listarPedidos(): Promise<Array<Pedido> | null> {
        try {
            const listaPedidos: Array<Pedido> = [];

            const querySelect = `
                SELECT * FROM pedidos ORDER BY id_pedido DESC;
            `;
            const respostaBD = await database.query(querySelect);

            respostaBD.rows.forEach((pedidoBD) => {
                const novoPedido = new Pedido(
                    pedidoBD.id_cliente,
                    pedidoBD.data_pedido,
                    pedidoBD.valor_total
                );
                novoPedido.setIdPedido(pedidoBD.id_pedido);
                listaPedidos.push(novoPedido);
            });

            return listaPedidos;
        } catch (error) {
            console.error(`Erro ao listar pedidos: ${error}`);
            return null;
        }
    }

    /**
     * Insere um novo pedido
     */
    static async cadastrarPedido(pedido: PedidoDTO): Promise<boolean> {
        try {
            const queryInsert = `
                INSERT INTO pedidos (id_cliente, data_pedido, valor_total)
                VALUES ($1, $2, $3)
                RETURNING id_pedido;
            `;

            const respostaBD = await database.query(queryInsert, [
                pedido.idCliente,
                pedido.dataPedido,
                pedido.valorTotal
            ]);

            if (respostaBD.rows.length > 0) {
                console.info(`Pedido cadastrado com sucesso. ID: ${respostaBD.rows[0].id_pedido}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao cadastrar pedido: ${error}`);
            return false;
        }
    }

    /**
     * Retorna um pedido específico pelo ID
     */
    static async listarPedido(idPedido: number): Promise<Pedido | null> {
        try {
            const querySelect = `SELECT * FROM pedidos WHERE id_pedido = $1;`;
            const respostaBD = await database.query(querySelect, [idPedido]);

            if (respostaBD.rowCount != 0) {
                const pedido = new Pedido(
                    respostaBD.rows[0].id_cliente,
                    respostaBD.rows[0].data_pedido,
                    respostaBD.rows[0].valor_total
                );
                pedido.setIdPedido(respostaBD.rows[0].id_pedido);
                return pedido;
            }

            return null;
        } catch (error) {
            console.error(`Erro ao buscar pedido: ${error}`);
            return null;
        }
    }
}

export default Pedido;
