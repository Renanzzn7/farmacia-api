import { server } from "./server.js"; // importa o servidor HTTP
import { DatabaseModel } from "./model/DatabaseModel.js";

const port: number = 3333; // define a porta que o servidor vai executar

// liga o servidor HTTP
new DatabaseModel().testarConexao().then((resbd: boolean) => {
    if (resbd) {
        server.listen(port, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${port}`);
        });
    } else {
        console.log("❌ Não foi possível conectar ao banco de dados");
    }
});
