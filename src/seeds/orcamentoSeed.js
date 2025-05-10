import {fakeMappings} from './globalFakeMapping.js';
import Orcamento from '../models/Orcamento.js';

export default async function orcamentoSeed() {
    await Orcamento.deleteMany({});

    for (let i = 0; i < 5; i++) {
        const orcamento = {
            nome: fakeMappings.Orcamento.nome.apply(),
            protocolo: fakeMappings.Orcamento.protocolo.apply(),
            descricao: fakeMappings.Orcamento.descricao.apply(),
            valor: fakeMappings.Orcamento.valor.apply(),
        };

        await Orcamento.create(orcamento);
    }
}