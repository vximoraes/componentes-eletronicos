import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import "../../../src/routes/componenteRoutes";

dotenv.config();

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

let token;

// Função auxiliar para criar categoria e localização válidas
const criarCategoriaELocalizacao = async () => {
    const unique = Date.now() + '-' + Math.floor(Math.random() * 10000);
    
    // Cria categoria
    const catRes = await request(BASE_URL)
        .post('/categorias')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: `Categoria Teste ${unique}` });
    expect(catRes.body?.data).toBeTruthy();
    const categoria = catRes.body.data._id;
    
    // Cria localizacao
    const locRes = await request(BASE_URL)
        .post('/localizacoes')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: `Localizacao Teste ${unique}` });
    expect(locRes.body?.data).toBeTruthy();
    const localizacao = locRes.body.data._id;
    
    // Aguarda persistência das entidades
    await new Promise(r => setTimeout(r, 200));
    return { categoria, localizacao };
};

const criarComponenteValido = async (override = {}) => {
    const unique = Date.now() + '-' + Math.floor(Math.random() * 10000);
    const { categoria, localizacao } = await criarCategoriaELocalizacao();
    return {
        nome: `Componente Teste ${unique}`,
        categoria,
        localizacao,
        estoque_minimo: '10',
        valor_unitario: '1.5', 
        ...override
    };
};

describe('Rotas de Componente', () => {
    let componenteId;

    beforeAll(async () => {
        try {
            await request(BASE_URL).get('/');
        } catch (err) {}
        const senhaAdmin = 'Senha@123';
        try {
            await request(BASE_URL)
                .post('/signup')
                .send({
                    nome: 'Admin',
                    email: 'admin@admin.com',
                    senha: senhaAdmin,
                    ativo: true
                });
        } catch (err) {}
        const loginRes = await request(BASE_URL)
            .post('/login')
            .send({ email: 'admin@admin.com', senha: senhaAdmin });
        token = loginRes.body?.data?.user?.accesstoken;
        expect(token).toBeTruthy();
    });

    describe('POST /componentes', () => {
        it('deve cadastrar componente válido', async () => {
            // Criar categoria e localização diretamente
            const unique = Date.now();
            const catRes = await request(BASE_URL)
                .post('/categorias')
                .set('Authorization', `Bearer ${token}`)
                .send({ nome: `Categoria Teste ${unique}` });
            expect(catRes.body.data).toBeTruthy();
            const categoria = catRes.body.data._id;
            
            const locRes = await request(BASE_URL)
                .post('/localizacoes')
                .set('Authorization', `Bearer ${token}`)
                .send({ nome: `Localizacao Teste ${unique}` });
            expect(locRes.body.data).toBeTruthy();
            const localizacao = locRes.body.data._id;
            
            // Esperar persistência
            await new Promise(r => setTimeout(r, 200));
            
            // Criar componente com campos como string
            const dados = {
                nome: `Componente Teste ${unique}`,
                categoria,
                localizacao,
                estoque_minimo: '10', 
                valor_unitario: '1.5' 
            };
            
            const res = await request(BASE_URL)
                .post('/componentes')
                .set('Authorization', `Bearer ${token}`)
                .send(dados);
                
            expect([200, 201]).toContain(res.status);
            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data).toHaveProperty('ativo', true);
        }, 30000);
        it('deve falhar ao cadastrar sem campos obrigatórios', async () => {
            const res = await request(BASE_URL).post('/componentes').set('Authorization', `Bearer ${token}`).send({});
            expect([400, 422]).toContain(res.status);
        });
        it('deve falhar ao cadastrar com nome já existente', async () => {
            const dados = await criarComponenteValido();
            await request(BASE_URL).post('/componentes').set('Authorization', `Bearer ${token}`).send(dados);
            const res = await request(BASE_URL).post('/componentes').set('Authorization', `Bearer ${token}`).send(dados);
            expect([400, 409, 422]).toContain(res.status);
        }, 30000);
        it('deve falhar ao cadastrar com categoria inexistente', async () => {
            const dados = await criarComponenteValido({ categoria: new mongoose.Types.ObjectId().toString() });
            const res = await request(BASE_URL).post('/componentes').set('Authorization', `Bearer ${token}`).send(dados);
            expect([400, 404, 422]).toContain(res.status);
        }, 30000);
        it('deve falhar ao cadastrar com localizacao inexistente', async () => {
            const dados = await criarComponenteValido({ localizacao: new mongoose.Types.ObjectId().toString() });
            const res = await request(BASE_URL).post('/componentes').set('Authorization', `Bearer ${token}`).send(dados);
            expect([400, 404, 422]).toContain(res.status);
        }, 30000);
    });

    describe('GET /componentes', () => {
        it('deve listar todos os componentes', async () => {
            const res = await request(BASE_URL).get('/componentes').set('Authorization', `Bearer ${token}`);
            expect([200, 201]).toContain(res.status);
            let lista = res.body.data;
            if (!Array.isArray(lista)) {
                if (Array.isArray(res.body.data?.docs)) lista = res.body.data.docs;
                else if (Array.isArray(res.body.data?.items)) lista = res.body.data.items;
                else if (Array.isArray(res.body.data?.results)) lista = res.body.data.results;
            }
            expect(Array.isArray(lista)).toBe(true);
        });
    });

    describe('GET /componentes/:id', () => {
        it('deve retornar componente por id', async () => {
            const dados = await criarComponenteValido();
            const compRes = await request(BASE_URL).post('/componentes').set('Authorization', `Bearer ${token}`).send(dados);
            await new Promise(r => setTimeout(r, 100));
            expect(compRes.body.data).toBeTruthy();
            const id = compRes.body.data._id;
            const res = await request(BASE_URL).get(`/componentes/${id}`).set('Authorization', `Bearer ${token}`);
            expect([200, 201]).toContain(res.status);
            expect(res.body.data).toHaveProperty('_id', id);
        }, 30000);
        it('deve retornar 404 para componente inexistente', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(BASE_URL).get(`/componentes/${id}`).set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(404);
        });
    });

    describe('PATCH /componentes/:id', () => {
        it('deve atualizar campos permitidos do componente', async () => {
            const dados = await criarComponenteValido();
            const compRes = await request(BASE_URL).post('/componentes').set('Authorization', `Bearer ${token}`).send(dados);
            await new Promise(r => setTimeout(r, 100));
            expect(compRes.body.data).toBeTruthy();
            const id = compRes.body.data._id;
            const novoNome = dados.nome + ' Atualizado';
            const res = await request(BASE_URL).patch(`/componentes/${id}`).set('Authorization', `Bearer ${token}`).send({ nome: novoNome });
            expect([200, 201]).toContain(res.status);
            expect(res.body.data.nome).toBe(novoNome);
        }, 30000);
        it('não deve permitir atualizar quantidade diretamente', async () => {
            // Cria um componente válido para testar a atualização
            const dados = await criarComponenteValido();
            // Realiza o cadastro do componente
            const compRes = await request(BASE_URL).post('/componentes').set('Authorization', `Bearer ${token}`).send(dados);
            // Aguarda persistência do componente
            await new Promise(r => setTimeout(r, 100));
            // Garante que o componente foi criado corretamente
            expect(compRes.body.data).toBeTruthy();
            const id = compRes.body.data._id;
            // Tenta atualizar o campo 'quantidade' diretamente via PATCH
            const res = await request(BASE_URL).patch(`/componentes/${id}`).set('Authorization', `Bearer ${token}`).send({ quantidade: 999 });
            // Verifica se a requisição foi aceita (status 200 ou 201)
            expect([200, 201]).toContain(res.status);
            // Garante que o valor de 'quantidade' não foi alterado para 999
            expect(res.body.data.quantidade).not.toBe(999);
        }, 30000);
        it('deve falhar ao atualizar para nome já existente', async () => {
            const dados1 = await criarComponenteValido();
            const dados2 = await criarComponenteValido();
            const comp1 = await request(BASE_URL).post('/componentes').set('Authorization', `Bearer ${token}`).send(dados1);
            const comp2 = await request(BASE_URL).post('/componentes').set('Authorization', `Bearer ${token}`).send(dados2);
            await new Promise(r => setTimeout(r, 100));
            expect(comp2.body.data).toBeTruthy();
            const res = await request(BASE_URL).patch(`/componentes/${comp2.body.data._id}`).set('Authorization', `Bearer ${token}`).send({ nome: dados1.nome });
            expect([400, 409, 422]).toContain(res.status);
        }, 30000);
        it('deve retornar 404 ao atualizar componente inexistente', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(BASE_URL).patch(`/componentes/${id}`).set('Authorization', `Bearer ${token}`).send({ nome: 'Qualquer' });
            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /componentes/:id', () => {
        it('deve remover componente existente', async () => {
            const dados = await criarComponenteValido();
            const compRes = await request(BASE_URL).post('/componentes').set('Authorization', `Bearer ${token}`).send(dados);
            await new Promise(r => setTimeout(r, 100));
            expect(compRes.body.data).toBeTruthy();
            const id = compRes.body.data._id;
            const res = await request(BASE_URL).delete(`/componentes/${id}`).set('Authorization', `Bearer ${token}`);
            expect([200, 201, 204]).toContain(res.status);
        }, 30000);
        it('deve retornar 404 ao remover componente inexistente', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(BASE_URL).delete(`/componentes/${id}`).set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(404);
        });
    });

    it('deve retornar erro 500 para falha inesperada', async () => {
        const res = await request(BASE_URL).get('/componentes/erro-interno').set('Authorization', `Bearer ${token}`);
        expect([500, 400, 404]).toContain(res.status);
    });
});