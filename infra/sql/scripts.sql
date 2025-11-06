CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(15),
    situacao BOOLEAN DEFAULT TRUE
);

CREATE TABLE medicamentos (
    id_medicamento SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    fabricante VARCHAR(100),
    preco NUMERIC(10,2) NOT NULL,
    estoque INT DEFAULT 0,
    situacao BOOLEAN DEFAULT TRUE
);

CREATE TABLE pedidos (
    id_pedido SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    data_pedido DATE NOT NULL,
    valor_total NUMERIC(10,2) NOT NULL,
    CONSTRAINT fk_pedidos_clientes FOREIGN KEY (id_cliente)
        REFERENCES clientes (id_cliente)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- ====== CLIENTES ======
INSERT INTO clientes (nome, cpf, telefone) VALUES
('Maria da Silva', '123.456.789-00', '(16) 99999-1111'),
('João Pereira', '987.654.321-00', '(16) 98888-2222'),
('Ana Souza', '321.654.987-00', '(16) 97777-3333'),
('Carlos Oliveira', '456.789.123-00', '(16) 96666-4444'),
('Fernanda Lima', '789.123.456-00', '(16) 95555-5555');

-- ====== MEDICAMENTOS ======
INSERT INTO medicamentos (nome, fabricante, preco, estoque) VALUES
('Paracetamol 500mg', 'EMS', 9.99, 100),
('Amoxicilina 500mg', 'Medley', 25.50, 60),
('Dipirona 1g', 'Neo Química', 7.49, 150),
('Ibuprofeno 400mg', 'Cimed', 18.90, 80),
('Losartana 50mg', 'Aché', 22.30, 120);

-- ====== PEDIDOS ======
INSERT INTO pedidos (id_cliente, data_pedido, valor_total) VALUES
(1, '2025-11-04', 35.49),
(2, '2025-11-03', 9.99),
(3, '2025-11-02', 25.50),
(4, '2025-11-01', 18.90),
(5, '2025-10-31', 57.79);
