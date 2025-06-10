import fakebr from 'faker-br';
import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
// import TokenUtil from '../utils/TokenUtil.js';
import loadModels from './loadModels.js';
import TokenUtil from '../utils/TokenUtil.js';

export const fakeMappings = {
    common: {
        nome: () => `${fakebr.name.firstName()} ${fakebr.name.lastName()} ${fakebr.name.lastName()}`,
        descricao: () => fakebr.lorem.sentence(),
        data_hora: () => new Date().toISOString(),
        quantidade: () => fakebr.random.number({ min: 1, max: 100 }),
        valor_unitario: () => fakebr.commerce.price(1, 1000, 2),
        categoria: () => new mongoose.Types.ObjectId().toString(),
        localizacao: () => new mongoose.Types.ObjectId().toString(),
        rota: () => fakebr.lorem.word(10),
        dominio: () => fakebr.internet.url(),
        ativo: () => fakebr.random.boolean(),
        buscar: () => fakebr.random.boolean(),
        enviar: () => fakebr.random.boolean(),
        substituir: () => fakebr.random.boolean(),
        modificar: () => fakebr.random.boolean(),
        excluir: () => fakebr.random.boolean(),
    },

    Usuario: {
        nome: () => `${fakebr.name.firstName()} ${fakebr.name.lastName()} ${fakebr.name.lastName()}`,
        email: () => fakebr.internet.email(),
        senha: () => fakebr.internet.password(),
        ativo: () => fakebr.random.boolean(),
        tokenUnico: () => TokenUtil.generateAccessToken(new mongoose.Types.ObjectId().toString()),
        refreshtoken: () => TokenUtil.generateRefreshToken(new mongoose.Types.ObjectId().toString()),
        accesstoken: () => TokenUtil.generateAccessToken(new mongoose.Types.ObjectId().toString()),
    },

    Notificacao: {
        mensagem: () => {
            const dispositivo = fakeMappings.Componente.nome();
            const quantidade = fakebr.random.number({ min: 1, max: 50 });
            return `${dispositivo} está com estoque baixo (${quantidade} unidades)`;
        },
        data_hora: () => new Date().toISOString(),
        visualizada: () => fakebr.random.boolean(),
        usuario: () => new mongoose.Types.ObjectId().toString(),
    },

    Categoria: {
        categorias: ["Sensores", "Cabos", "Microcontroladores"],
        nome(index) {
            return this.categorias[index];
        }
    },

    Localizacao: {
        nome: () => `${String.fromCharCode(65 + fakebr.random.number({ min: 0, max: 25 }))}${fakebr.random.number({ min: 1, max: 100 })}`,
    },

    Componente: {
        nomesFixos: [
            "Placa Arduino Uno",
            "Sensor de Movimento",
            "Display LCD 16x2",
            "Módulo Relé 4 Canais",
            "Módulo Wifi ESP8266",
            "Kit Jumpers 120 peças"
        ],
        nome: () => fakebr.helpers.randomize(fakeMappings.Componente.nomesFixos),
        quantidade: () => fakebr.random.number({ min: 0, max: 100 }),
        estoque_minimo: () => fakebr.random.number({ min: 1, max: 20 }),
        valor_unitario: () => fakebr.commerce.price(1, 1000, 2),
        descricao: () => fakebr.lorem.sentence(),
        imagem: () => fakebr.image.imageUrl(),
        categoria: () => new mongoose.Types.ObjectId().toString(),
        localizacao: () => new mongoose.Types.ObjectId().toString(),
        ativo: () => fakebr.random.boolean(),
    },

    Fornecedor: {
        nome: () => fakebr.company.companyName(),
    },

    Movimentacao: {
        tipos: ["entrada", "saida"],
        tipo: () => fakebr.helpers.randomize(fakeMappings.Movimentacao.tipos),
        data_hora: () => new Date().toISOString(),
        quantidade: () => fakebr.random.number({ min: 1, max: 10 }),
        componente: () => new mongoose.Types.ObjectId().toString(),
        fornecedor: () => new mongoose.Types.ObjectId().toString(),
    },

    ComponenteOrcamento: {
        nomesFixos: [
            "Placa Arduino Uno",
            "Sensor de Movimento",
            "Display LCD 16x2",
            "Módulo Relé 4 Canais",
            "Módulo Wifi ESP8266",
            "Kit Jumpers 120 peças"
        ],
        nome: () => fakebr.helpers.randomize(fakeMappings.Componente.nomesFixos),
        fornecedor: () => fakebr.company.companyName(),
        quantidade: () => fakebr.random.number({ min: 0, max: 100 }),
        estoque_minimo: () => fakebr.random.number({ min: 1, max: 20 }),
        valor_unitario: () => fakebr.commerce.price(1, 1000, 2),
        subtotal: () => fakebr.commerce.price(1, 1000, 2),
        descricao: () => fakebr.lorem.sentence(),
        imagem: () => fakebr.image.imageUrl(),
        categoria: () => new mongoose.Types.ObjectId().toString(),
        localizacao: () => new mongoose.Types.ObjectId().toString(),
        ativo: () => fakebr.random.boolean(),
    },

    Orcamento: {
        produtoNome: () => fakebr.commerce.productName(),
        adjetivoNome: () => fakebr.lorem.word(),
        nome: () => `Projeto ${fakeMappings.Orcamento.adjetivoNome()} - ${fakeMappings.Orcamento.produtoNome()}`,
        protocolo: () => uuid(),
        descricao: () => fakebr.lorem.sentence(),
        componentes: () => {
            const nomesFixos = fakeMappings.ComponenteOrcamento.nomesFixos;
            const quantidade = fakebr.random.number({ min: 1, max: nomesFixos.length });
            const nomesSelecionados = fakebr.helpers.shuffle(nomesFixos).slice(0, quantidade);
            return nomesSelecionados.map(nome => {
                const quantidade = fakebr.random.number({ min: 1, max: 100 });
                const valor_unitario = Number(fakebr.commerce.price(1, 1000, 2));
                const subtotal = Number((quantidade * valor_unitario).toFixed(2));
                return {
                    _id: new mongoose.Types.ObjectId(),
                    nome,
                    fornecedor: fakebr.company.companyName(),
                    quantidade,
                    valor_unitario,
                    subtotal,
                };
            });
        },
        valor: () => 0, 
    },
};

// Retorna o mapping global, consolidando os mappings comuns e específicos.
// Nesta versão automatizada, carregamos os models e combinamos o mapping comum com o mapping específico de cada model.

export async function getGlobalFakeMapping() {
    const models = await loadModels();
    let globalMapping = { ...fakeMappings.common };

    models.forEach(({ name }) => {
        if (fakeMappings[name]) {
            globalMapping = {
                ...globalMapping,
                ...fakeMappings[name],
            };
        };
    });

    return globalMapping;
};

// Função auxiliar para extrair os nomes dos campos de um schema, considerando apenas os níveis superiores (campos aninhados são verificados pela parte antes do ponto).

function getSchemaFieldNames(schema) {
    const fieldNames = new Set();

    Object.keys(schema.paths).forEach((key) => {
        if (['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) return;
        const topLevel = key.split('.')[0];
        fieldNames.add(topLevel);
    });

    return Array.from(fieldNames);
};

// Valida se o mapping fornecido cobre todos os campos do model.
// Retorna um array com os nomes dos campos que estiverem faltando.

function validateModelMapping(model, modelName, mapping) {
    const fields = getSchemaFieldNames(model.schema);
    const missing = fields.filter((field) => !(field in mapping));

    if (missing.length > 0) {
        console.error(
            `Model ${modelName} está faltando mapeamento para os campos: ${missing.join(', ')}`
        );
    } else {
        console.log(`Model ${modelName} possui mapeamento para todos os campos.`);
    };

    return missing;
};

// Executa a validação para os models fornecidos, utilizando o mapping específico de cada um.

async function validateAllMappings() {
    const models = await loadModels();
    let totalMissing = {};

    models.forEach(({ model, name }) => {
        // Combina os campos comuns com os específicos de cada model.
        const mapping = {
            ...fakeMappings.common,
            ...(fakeMappings[name] || {}),
        };
        const missing = validateModelMapping(model, name, mapping);
        if (missing.length > 0) {
            totalMissing[name] = missing;
        };
    });

    if (Object.keys(totalMissing).length === 0) {
        console.log('globalFakeMapping cobre todos os campos de todos os models.');
        return true;
    } else {
        console.warn('Faltam mapeamentos para os seguintes models:', totalMissing);
        return false;
    };
};

// Executa a validação antes de prosseguir com o seeding ou outras operações.

validateAllMappings()
    .then((valid) => {
        if (valid) {
            console.log('Podemos acessar globalFakeMapping com segurança.');
            // Prossegue com o seeding ou outras operações.
        } else {
            throw new Error('globalFakeMapping não possui todos os mapeamentos necessários.');
        };
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })

export default getGlobalFakeMapping;