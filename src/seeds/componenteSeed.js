import { fakeMappings } from "./globalFakeMapping.js";
import Componente from "../models/Componente.js";

export default async function categoriaSeed() {
    await Componente.deleteMany({});

    for (let i = 0; i < 10; i++) {
        const componente = {
            nome: fakeMappings.Componente.nome.apply(),
            codigo: fakeMappings.Componente.codigo.apply(),
            quantidade: fakeMappings.Componente.quantidade.apply(),
            estoque_minimo: fakeMappings.Componente.estoque_minimo.apply(),
            valor_unitario: fakeMappings.Componente.valor_unitario.apply(),
            descricao: fakeMappings.Componente.descricao.apply(),
            imagem: fakeMappings.Componente.imagem.apply(),
            categoria: fakeMappings.Componente.categoria.apply(),
            localizacao: fakeMappings.Componente.localizacao.apply(),
        };

        await Componente.create(componente);
    }
}