import type { MedicamentoDTO } from "../interface/MedicamentoDTO.js";
import Medicamento from "../model/Medicamento.js";
import type { Request, Response } from "express";

/**
 * Classe responsável por tratar requisições relacionadas a Medicamentos
 */
class MedicamentoController extends Medicamento {

    /**
     * Retorna todos os medicamentos
     */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listaMedicamentos = await Medicamento.listarMedicamentos();
            return res.status(200).json(listaMedicamentos);
        } catch (error) {
            console.error(`Erro ao consultar medicamentos: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao listar medicamentos." });
        }
    }

    /**
     * Cadastra um novo medicamento
     */
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidos: MedicamentoDTO = req.body;

            if (!dadosRecebidos.nome || !dadosRecebidos.fabricante || dadosRecebidos.preco === undefined || dadosRecebidos.quantidade === undefined) {
                return res.status(400).json({ mensagem: "Preencha todos os campos obrigatórios: nome, fabricante, preço e quantidade." });
            }

            const respostaModelo = await Medicamento.cadastrarMedicamento(dadosRecebidos);

            if (respostaModelo) {
                return res.status(201).json({ mensagem: "Medicamento cadastrado com sucesso." });
            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastrar medicamento." });
            }
        } catch (error) {
            console.error(`Erro ao cadastrar medicamento: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno ao cadastrar medicamento." });
        }
    }

    /**
     * Retorna um medicamento específico pelo ID
     */
    static async medicamento(req: Request, res: Response): Promise<Response> {
        try {
            const idMedicamento: number = parseInt(req.params.idMedicamento as string);

            if (isNaN(idMedicamento) || idMedicamento <= 0) {
                return res.status(400).json({ mensagem: "ID inválido." });
            }

            const respostaModelo = await Medicamento.listarMedicamento(idMedicamento);

            if (!respostaModelo) {
                return res.status(200).json({ mensagem: "Nenhum medicamento encontrado com o ID fornecido." });
            }

            return res.status(200).json(respostaModelo);
        } catch (error) {
            console.error(`Erro ao buscar medicamento: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao acessar dados do medicamento." });
        }
    }

    /**
     * Busca medicamentos por princípio ativo
     */
    static async porPrincipioAtivo(req: Request, res: Response): Promise<Response> {
        try {
            const principioAtivo = req.params.principioAtivo;
            if (!principioAtivo) {
                return res.status(400).json({ mensagem: "Princípio ativo é obrigatório." });
            }

            const listaMedicamentos = await Medicamento.listarMedicamentosPorPrincipio(principioAtivo);


            if (!listaMedicamentos || listaMedicamentos.length === 0) {
                return res.status(200).json({ mensagem: "Nenhum medicamento encontrado com o princípio ativo fornecido." });
            }

            return res.status(200).json(listaMedicamentos);
        } catch (error) {
            console.error(`Erro ao buscar medicamentos por princípio ativo: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao acessar medicamentos." });
        }
    }
}

export default MedicamentoController;
export { MedicamentoController };
