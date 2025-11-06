import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

/**
 * Classe que representa o modelo de banco de dados.
 * Responsável por gerenciar a conexão com o PostgreSQL.
 */
export class DatabaseModel {
    
    /**
     * Configuração de conexão com o banco de dados.
     */
    private _config: pg.PoolConfig;

    /**
     * Pool de conexões com o banco de dados.
     */
    private _pool: pg.Pool;

    /**
     * Cliente individual de conexão (usado para teste).
     */
    private _client: pg.Client;

    /**
     * Construtor da classe DatabaseModel.
     */
    constructor() {
        this._config = {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT),
            max: 10,
            idleTimeoutMillis: 10000
        };

        // Inicializa o pool e o client
        this._pool = new pg.Pool(this._config);
        this._client = new pg.Client(this._config);
    }

    /**
     * Testa a conexão com o banco de dados.
     * Retorna true se estiver conectando corretamente.
     */
    public async testarConexao(): Promise<boolean> {
        try {
            await this._client.connect();
            console.log("✅ Banco de dados conectado com sucesso!");
            this._client.end();
            return true;
        } catch (erro) {
            console.error("❌ Erro ao conectar no banco de dados:");
            console.error(erro);
            this._client.end();
            return false;
        }
    }

    /**
     * Retorna o pool de conexões para uso nas consultas.
     */
    public get pool(): pg.Pool {
        return this._pool;
    }
}
