import { fakeMappings } from "./globalFakeMapping.js";
import Fornecedor from "../models/Fornecedor.js";

export default async function fornecedorSeed() {
    await Fornecedor.deleteMany({});

    for (let i = 0; i < 10; i++) {
        const fornecedor = {
            nome: fakeMappings.Fornecedor.nome.apply()
        };

        await Fornecedor.create(fornecedor);
    }
}