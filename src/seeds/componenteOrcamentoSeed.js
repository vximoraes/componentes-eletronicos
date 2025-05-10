import {fakeMappings} from './globalFakeMapping.js';
import ComponenteOrcamento from '../models/ComponenteOrcamento.js';
import Orcamento from '../models/Orcamento.js';

export default async function componenteOrcamentoSeed() {
    const orcamentos = await Orcamento.find({});
    await ComponenteOrcamento.deleteMany({});

    for (let i = 0; i < 10; i++) {
        const orcamentoRandom = orcamentos[Math.floor(Math.random() * orcamentos.length)];

        const componente = {
            nome: fakeMappings.ComponenteOrcamento.nome.apply(),
            fornecedor: fakeMappings.ComponenteOrcamento.fornecedor.apply(),
            quantidade: fakeMappings.ComponenteOrcamento.quantidade.apply(),
            valor_unitario: fakeMappings.ComponenteOrcamento.subtotal.apply(),
            subtotal: fakeMappings.ComponenteOrcamento.subtotal.apply(),
            orcamento: orcamentoRandom._id,

        };

        await ComponenteOrcamento.create(componente);

    }
    
}