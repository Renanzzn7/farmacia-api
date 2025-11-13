import type { ClienteDTO } from "../interface/ClienteDTO.js";
import Cliente from "../model/Cliente.js";
import type { Request, Response } from "express";

/**
 * Classe responsável por receber a requisição do cliente, processar essa requisição e devolver a resposta ao cliente.
 * 
 * Trata apenas de requisições relacionadas ao recurso Cliente (Farmácia Vida Saudável)
 */
class ClienteController extends Cliente {

    /**
     * Retorna a lista de todos os clientes cadastrados
     */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listaClientes = await Cliente.listarClientes();
            return res.status(200).json(listaClientes);
        } catch (error) {
            console.error(`Erro ao consultar modelo. ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível acessar a lista de clientes." });
        }
    }

    /**
     * Cadastra um novo cliente
     */
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidosCliente: ClienteDTO = req.body;

            // Validação básica
            if (!dadosRecebidosCliente.nome || !dadosRecebidosCliente.cpf || !dadosRecebidosCliente.telefone) {
                return res.status(400).json({ mensagem: "Preencha todos os campos obrigatórios: nome, cpf e telefone." });
            }

            const respostaModelo = await Cliente.cadastrarCliente(dadosRecebidosCliente);

            if (respostaModelo) {
                return res.status(201).json({ mensagem: "Cliente cadastrado com sucesso." });
            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastrar cliente." });
            }
        } catch (error) {
            console.error(`Erro no modelo. ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível inserir o cliente." });
        }
    }

    /**
     * Retorna os dados de um cliente específico pelo ID
     */
    static async cliente(req: Request, res: Response): Promise<Response> {
        try {
            const idCliente: number = parseInt(req.params.idCliente as string);

            if (isNaN(idCliente) || idCliente <= 0) {
                return res.status(400).json({ mensagem: "ID inválido." });
            }

            const respostaModelo = await Cliente.listarCliente(idCliente);

            if (respostaModelo === null) {
                return res.status(200).json({ mensagem: "Nenhum cliente encontrado com o ID fornecido." });
            }

            return res.status(200).json(respostaModelo);
        } catch (error) {
            console.error(`Erro ao acessar o modelo. ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível recuperar o cliente." });
        }
    }

    /**
     * Retorna os dados de um cliente específico pelo CPF
     */
    static async clientePorCpf(req: Request, res: Response): Promise<Response> {
        try {
            const cpf = req.query.cpf as string;

if (!cpf) {
    return res.status(400).json({ mensagem: "CPF não informado." });
}

const cliente = await Cliente.listarClientePorCpf(cpf);


            if (!cpf) {
                return res.status(400).json({ mensagem: "CPF é obrigatório." });
            }

            const respostaModelo = await Cliente.listarClientePorCpf(cpf);

            if (respostaModelo === null) {
                return res.status(200).json({ mensagem: "Nenhum cliente encontrado com o CPF fornecido." });
            }

            return res.status(200).json(respostaModelo);
        } catch (error) {
            console.error(`Erro ao acessar o modelo por CPF. ${error}`);
            return res.status(500).json({ mensagem: "Não foi possível recuperar o cliente." });
        }
    }
}

export default ClienteController;
export { ClienteController };
