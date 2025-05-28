import { fakeMappings } from './globalFakeMapping.js';
import ComponenteOrcamento from '../models/ComponenteOrcamento.js';

export default async function componenteOrcamentoSeed() {
    await ComponenteOrcamento.deleteMany({});

    const nomesFixos = fakeMappings.ComponenteOrcamento.nomesFixos;
    for (let nome of nomesFixos) {
        const componente = {
            nome,
            fornecedor: fakeMappings.ComponenteOrcamento.fornecedor.apply(),
            quantidade: fakeMappings.ComponenteOrcamento.quantidade.apply(),
            valor_unitario: fakeMappings.ComponenteOrcamento.valor_unitario.apply(),
            subtotal: fakeMappings.ComponenteOrcamento.subtotal.apply(),
        };
        await ComponenteOrcamento.create(componente);
    };
};