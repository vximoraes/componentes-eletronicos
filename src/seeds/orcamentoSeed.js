import { fakeMappings } from './globalFakeMapping.js';
import Orcamento from '../models/Orcamento.js';

export default async function orcamentoSeed() {
    await Orcamento.deleteMany({});

    for (let i = 0; i < 5; i++) {
        const componentes = fakeMappings.Orcamento.componentes.apply();
        const valor = componentes.reduce((acc, comp) => acc + (comp.subtotal || 0), 0);
        const orcamento = {
            nome: fakeMappings.Orcamento.nome.apply(),
            protocolo: fakeMappings.Orcamento.protocolo.apply(),
            descricao: fakeMappings.Orcamento.descricao.apply(),
            valor: Number(valor.toFixed(2)),
            componentes
        };
        await Orcamento.create(orcamento);
    }
};