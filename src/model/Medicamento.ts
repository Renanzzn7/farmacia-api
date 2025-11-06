import type { MedicamentoDTO } from "../interfaces/MedicamentoDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

/**
 * Classe que representa o modelo Medicamento
 */
class Medicamento {

    // Atributos
    private idMedicamento: number = 0;
    private nome: string;
    private fabricante: string;
    private preco: number;
    private quantidade: number;

    constructor(
        _nome: string,
        _fabricante: string,
        _preco: number,
        _quantidade: number
    ) {
        this.nome = _nome;
        this.fabricante = _fabricante;
        this.preco = _preco;
        this.quantidade = _quantidade;
    }

    public getIdMedicamento(): number {
        return this.idMedicamento;
    }

    public setIdMedicamento(idMedicamento: number): void {
        this.idMedicamento = idMedicamento;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(nome: string): void {
        this.nome = nome;
    }

    public getFabricante(): string {
        return this.fabricante;
    }

    public setFabricante(fabricante: string): void {
        this.fabricante = fabricante;
    }

    public getPreco(): number {
        return this.preco;
    }

    public setPreco(preco: number): void {
        this.preco = preco;
    }

    public getQuantidade(): number {
        return this.quantidade;
    }

    public setQuantidade(quantidade: number): void {
        this.quantidade = quantidade;
    }

    /**
     * Retorna todos os medicamentos cadastrados
     */
    static async listarMedicamentos(): Promise<Array<Medicamento> | null> {
        try {
            const listaMedicamentos: Array<Medicamento> = [];

            const querySelect = `SELECT * FROM medicamentos;`;
            const respostaBD = await database.query(querySelect);

            respostaBD.rows.forEach((medicamentoBD) => {
                const novoMedicamento = new Medicamento(
                    medicamentoBD.nome,
                    medicamentoBD.fabricante,
                    medicamentoBD.preco,
                    medicamentoBD.quantidade
                );
                novoMedicamento.setIdMedicamento(medicamentoBD.id_medicamento);
                listaMedicamentos.push(novoMedicamento);
            });

            return listaMedicamentos;
        } catch (error) {
            console.error(`Erro ao listar medicamentos: ${error}`);
            return null;
        }
    }

    /**
     * Insere um novo medicamento
     */
    static async cadastrarMedicamento(medicamento: MedicamentoDTO): Promise<boolean> {
        try {
            const queryInsert = `
                INSERT INTO medicamentos (nome, fabricante, preco, quantidade)
                VALUES ($1, $2, $3, $4)
                RETURNING id_medicamento;
            `;

            const respostaBD = await database.query(queryInsert, [
                medicamento.nome.toUpperCase(),
                medicamento.fabricante,
                medicamento.preco,
                medicamento.quantidade
            ]);

            if (respostaBD.rows.length > 0) {
                console.info(`Medicamento cadastrado com sucesso. ID: ${respostaBD.rows[0].id_medicamento}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao cadastrar medicamento: ${error}`);
            return false;
        }
    }

    /**
     * Retorna um medicamento específico pelo ID
     */
    static async listarMedicamento(idMedicamento: number): Promise<Medicamento | null> {
        try {
            const querySelect = `SELECT * FROM medicamentos WHERE id_medicamento = $1;`;
            const respostaBD = await database.query(querySelect, [idMedicamento]);

            if (respostaBD.rowCount != 0) {
                const medicamento = new Medicamento(
                    respostaBD.rows[0].nome,
                    respostaBD.rows[0].fabricante,
                    respostaBD.rows[0].preco,
                    respostaBD.rows[0].quantidade
                );
                medicamento.setIdMedicamento(respostaBD.rows[0].id_medicamento);
                return medicamento;
            }

            return null;
        } catch (error) {
            console.error(`Erro ao buscar medicamento: ${error}`);
            return null;
        }
    }
}

export default Medicamento;
