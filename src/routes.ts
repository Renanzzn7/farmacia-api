import { Router } from "express";
import type { Request, Response } from "express";
import ClienteController from "./controllers/ClienteController.js";
import MedicamentoController from "./controllers/MedicamentoController.js";

const router = Router();

/**
 * ======= ROTA INICIAL =======
 */
router.get("/api", (req: Request, res: Response) => {
    res.status(200).json({ mensagem: "💊 API Farmácia Vida Saudável - Bem-vindo!" });
});

/**
 * ======= CLIENTES =======
 */
// Retorna todos os clientes
router.get("/api/clientes", ClienteController.todos);

// Cadastra um novo cliente
router.post("/api/clientes", ClienteController.novo);

// Retorna um cliente específico pelo ID
router.get("/api/clientes/:idCliente", ClienteController.cliente);

/**
 * ======= MEDICAMENTOS =======
 */
// Retorna todos os medicamentos
router.get("/api/medicamentos", MedicamentoController.todos);

// Cadastra um novo medicamento
router.post("/api/medicamentos", MedicamentoController.novo);

// Retorna um medicamento específico pelo ID
router.get("/api/medicamentos/:idMedicamento", MedicamentoController.medicamento);

export { router };
