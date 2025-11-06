import type { PedidoDTO } from "../interface/PedidoDTO.js";
import Pedido from "../model/Pedido.js";
import type { Request, Response } from "express";

/**
 * Classe responsável por tratar requisições relacionadas a Pedidos
 */
class PedidoController extends Pedido {

    /**
     * Retorna todos os pedidos
     */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listaPedidos = await Pedido.listarPedidos();
            return res.status(200).json(listaPedidos);
        } catch (error) {
            console.error(`Erro ao consultar pedidos: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao listar pedidos." });
        }
    }

    /**
     * Cadastra um novo pedido
     */
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidos: PedidoDTO = req.body;
            const respostaModelo = await Pedido.cadastrarPedido(dadosRecebidos);

            if (respostaModelo) {
                return res.status(201).json({ mensagem: "Pedido cadastrado com sucesso." });
            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastrar pedido." });
            }
        } catch (error) {
            console.error(`Erro ao cadastrar pedido: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno ao cadastrar pedido." });
        }
    }

    /**
     * Retorna um pedido específico pelo ID
     */
    static async pedido(req: Request, res: Response): Promise<Response> {
        try {
            const idPedido: number = parseInt(req.params.idPedido as string);

            if (isNaN(idPedido) || idPedido <= 0) {
                return res.status(400).json({ mensagem: "ID inválido." });
            }

            const respostaModelo = await Pedido.listarPedido(idPedido);

            if (respostaModelo === null) {
                return res.status(200).json({ mensagem: "Nenhum pedido encontrado com o ID fornecido." });
            }

            return res.status(200).json(respostaModelo);
        } catch (error) {
            console.error(`Erro ao buscar pedido: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao acessar dados do pedido." });
        }
    }
}

export default PedidoController;
