import { fakeMappings } from "./globalFakeMapping.js";
import Movimentacao from "../models/Movimentacao.js";
import Fornecedor from "../models/Fornecedor.js";
import Componente from "../models/Componente.js";

export default async function movimentacaoSeed() {
    const componenteList = await Componente.find({});
    const fornecedorList = await Fornecedor.find({});

    await Movimentacao.deleteMany({});

    for (let i = 0; i < 10; i++) {
        const tipo = fakeMappings.Movimentacao.tipo.apply();
        const componenteRandom = componenteList[Math.floor(Math.random() * componenteList.length)];
        const fornecedorRandom = tipo === "entrada" ? fornecedorList[Math.floor(Math.random() * fornecedorList.length)] : null;

        const movimentacao = {
            tipo,
            data_hora: fakeMappings.Movimentacao.data_hora.apply(),
            quantidade: fakeMappings.Movimentacao.quantidade.apply(),
            componente: componenteRandom._id,
            fornecedor: fornecedorRandom ? fornecedorRandom._id : undefined,
        };

        await Movimentacao.create(movimentacao);
    };
};