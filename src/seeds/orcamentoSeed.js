import { fakeMappings } from './globalFakeMapping.js';
import Orcamento from '../models/Orcamento.js';
import ComponenteOrcamento from '../models/ComponenteOrcamento.js';

export default async function orcamentoSeed() {
    await Orcamento.deleteMany({});

    const componentes = await ComponenteOrcamento.find({});
    const componentesIds = componentes.map(c => c._id);
    
    for (let i = 0; i < 5; i++) {
        const orcamento = {
            nome: fakeMappings.Orcamento.nome.apply(),
            protocolo: fakeMappings.Orcamento.protocolo.apply(),
            descricao: fakeMappings.Orcamento.descricao.apply(),
            valor: fakeMappings.Orcamento.valor.apply(),
            componentes: componentesIds.splice(0, 3)
        };
        
        await Orcamento.create(orcamento);
    }
}