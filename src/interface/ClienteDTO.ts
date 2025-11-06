/**
 * Interface para Cliente
 * 
 * DTO => Data Transfer Object
 * 
 * Usado para transportar dados entre camadas da aplicação.
 */
export interface ClienteDTO {
    idCliente?: number,       // ID do cliente (opcional)
    nome: string,             // Nome completo
    cpf: string,              // CPF do cliente
    dataNascimento: string,   // Data de nascimento (AAAA-MM-DD)
    telefone: string,         // Telefone para contato
    email: string,            // E-mail do cliente
    situacao?: boolean        // Situação (ativo/inativo)
}
