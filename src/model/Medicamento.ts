import type { MedicamentoDTO } from "../interface/MedicamentoDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

/*
* Classe Medicamento representa um modelo de medicamento com seus atributos principais (nome, fabricante, preço e quantidade).
* Permite criar objetos de medicamento, acessar e modificar seus dados, e consultar informações no banco de dados.
* Inclui métodos estáticos para listar, buscar e cadastrar medicamentos no banco de dados.
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

    // Getters e Setters
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

            respostaBD.rows.forEach((medBD) => {
                const novoMedicamento = new Medicamento(
                    medBD.nome,
                    medBD.fabricante,
                    medBD.preco,
                    medBD.quantidade
                );
                novoMedicamento.setIdMedicamento(medBD.id_medicamento);
                listaMedicamentos.push(novoMedicamento);
            });

            return listaMedicamentos;
        } catch (error) {
            console.error(`Erro ao listar medicamentos: ${error}`);
            return null;
        }
    }

    /**
     * Cadastra um novo medicamento
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
            const querySelect = `SELECT * FROM medicamentos WHERE id_medicamento=$1;`;
            const respostaBD = await database.query(querySelect, [idMedicamento]);

            if (respostaBD.rowCount !== 0) {
                const med = new Medicamento(
                    respostaBD.rows[0].nome,
                    respostaBD.rows[0].fabricante,
                    respostaBD.rows[0].preco,
                    respostaBD.rows[0].quantidade
                );
                med.setIdMedicamento(respostaBD.rows[0].id_medicamento);
                return med;
            }

            return null;
        } catch (error) {
            console.error(`Erro ao buscar medicamento: ${error}`);
            return null;
        }
    }

    /**
     * Busca medicamentos por princípio ativo (nome)
     */
    static async listarMedicamentosPorPrincipio(principio: string): Promise<Array<Medicamento> | null> {
        try {
            const listaMedicamentos: Array<Medicamento> = [];
            const querySelect = `SELECT * FROM medicamentos WHERE nome ILIKE $1;`;
            const respostaBD = await database.query(querySelect, [`%${principio}%`]);

            respostaBD.rows.forEach((medBD) => {
                const novoMedicamento = new Medicamento(
                    medBD.nome,
                    medBD.fabricante,
                    medBD.preco,
                    medBD.quantidade
                );
                novoMedicamento.setIdMedicamento(medBD.id_medicamento);
                listaMedicamentos.push(novoMedicamento);
            });

            return listaMedicamentos;
        } catch (error) {
            console.error(`Erro ao buscar medicamentos por princípio ativo: ${error}`);
            return null;
        }
    }
}

export default Medicamento;
