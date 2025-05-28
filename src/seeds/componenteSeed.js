import { fakeMappings } from "./globalFakeMapping.js";
import Componente from "../models/Componente.js";
import Categoria from "../models/Categoria.js";
import Localizacao from "../models/Localizacao.js";

export default async function componenteSeed() {
    const categoriaList = await Categoria.find({});
    const localizacaoList = await Localizacao.find({});

    await Componente.deleteMany({});

    const nomesFixos = fakeMappings.Componente.nomesFixos;
    for (let nome of nomesFixos) {
        const categoriaRandom = categoriaList[Math.floor(Math.random() * categoriaList.length)];
        const localizacaoRandom = localizacaoList[Math.floor(Math.random() * localizacaoList.length)];

        const componente = {
            nome,
            quantidade: fakeMappings.Componente.quantidade.apply(),
            estoque_minimo: fakeMappings.Componente.estoque_minimo.apply(),
            valor_unitario: fakeMappings.Componente.valor_unitario.apply(),
            descricao: fakeMappings.Componente.descricao.apply(),
            imagem: fakeMappings.Componente.imagem.apply(),
            categoria: categoriaRandom._id,
            localizacao: localizacaoRandom._id,
            ativo: fakeMappings.Componente.ativo.apply()
        };

        await Componente.create(componente);
    };
};