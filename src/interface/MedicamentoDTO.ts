export interface MedicamentoDTO {
    idMedicamento?: number,  // ID do medicamento (opcional)
    nome: string,            // Nome do medicamento
    fabricante: string,      // Fabricante
    preco: number,           // Preço
    quantidade: number       // Quantidade em estoque
}
