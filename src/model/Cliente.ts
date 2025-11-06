import type { ClienteDTO } from "../interface/ClienteDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

/*
* Classe Cliente representa um modelo de cliente com seus atributos principais (nome, cpf, data de nascimento, telefone e e-mail).
* Permite criar objetos de cliente, acessar e modificar seus dados, e consultar informações no banco de dados.
* Inclui métodos estáticos para listar, buscar e cadastrar clientes no banco de dados.
*/
class Cliente {

    // Atributos
    private idCliente: number = 0;
    private nome: string;
    private cpf: string;
    private dataNascimento: string;
    private telefone: string;
    private email: string;

    /**
     * Construtor da classe Cliente
     * @param _nome Nome do cliente
     * @param _cpf CPF do cliente
     * @param _dataNascimento Data de nascimento do cliente
     * @param _telefone Telefone do cliente
     * @param _email E-mail do cliente
     */
    constructor(
        _nome: string,
        _cpf: string,
        _dataNascimento: string,
        _telefone: string,
        _email: string
    ) {
        this.nome = _nome;
        this.cpf = _cpf;
        this.dataNascimento = _dataNascimento;
        this.telefone = _telefone;
        this.email = _email;
    }

    // Getters e Setters
    public getIdCliente(): number {
        return this.idCliente;
    }

    public setIdCliente(idCliente: number): void {
        this.idCliente = idCliente;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(nome: string): void {
        this.nome = nome;
    }

    public getCpf(): string {
        return this.cpf;
    }

    public setCpf(cpf: string): void {
        this.cpf = cpf;
    }

    public getDataNascimento(): string {
        return this.dataNascimento;
    }

    public setDataNascimento(dataNascimento: string): void {
        this.dataNascimento = dataNascimento;
    }

    public getTelefone(): string {
        return this.telefone;
    }

    public setTelefone(telefone: string): void {
        this.telefone = telefone;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    /**
     * Retorna todos os clientes cadastrados
     */
    static async listarClientes(): Promise<Array<Cliente> | null> {
        try {
            const listaDeClientes: Array<Cliente> = [];
            const querySelectClientes = `SELECT * FROM clientes;`;
            const respostaBD = await database.query(querySelectClientes);

            respostaBD.rows.forEach((clienteBD) => {
                const novoCliente = new Cliente(
                    clienteBD.nome,
                    clienteBD.cpf,
                    clienteBD.data_nascimento,
                    clienteBD.telefone,
                    clienteBD.email
                );
                novoCliente.setIdCliente(clienteBD.id_cliente);
                listaDeClientes.push(novoCliente);
            });

            return listaDeClientes;
        } catch (error) {
            console.error(`Erro na consulta ao banco de dados. ${error}`);
            return null;
        }
    }

    /**
     * Cadastra um cliente
     */
    static async cadastrarCliente(cliente: ClienteDTO): Promise<boolean> {
        try {
            const queryInsertCliente = `
                INSERT INTO clientes (nome, cpf, data_nascimento, telefone, email)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id_cliente;
            `;

            const respostaBD = await database.query(queryInsertCliente, [
                cliente.nome.toUpperCase(),
                cliente.cpf,
                cliente.dataNascimento,
                cliente.telefone,
                cliente.email
            ]);

            if (respostaBD.rows.length > 0) {
                console.info(`Cliente cadastrado com sucesso. ID: ${respostaBD.rows[0].id_cliente}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao cadastrar cliente. ${error}`);
            return false;
        }
    }

    /**
     * Busca um cliente por ID
     */
    static async listarCliente(idCliente: number): Promise<Cliente | null> {
        try {
            const querySelectCliente = `SELECT * FROM clientes WHERE id_cliente=$1;`;
            const respostaBD = await database.query(querySelectCliente, [idCliente]);

            if (respostaBD.rowCount !== 0) {
                const cliente = new Cliente(
                    respostaBD.rows[0].nome,
                    respostaBD.rows[0].cpf,
                    respostaBD.rows[0].data_nascimento,
                    respostaBD.rows[0].telefone,
                    respostaBD.rows[0].email
                );
                cliente.setIdCliente(respostaBD.rows[0].id_cliente);
                return cliente;
            }

            return null;
        } catch (error) {
            console.error(`Erro ao buscar cliente. ${error}`);
            return null;
        }
    }
}

export default Cliente;
