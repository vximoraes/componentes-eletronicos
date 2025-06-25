import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import "../../../src/routes/movimentacaoRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

let token;

const TIMEOUT = 20000;
const criarMovimentacaoValida = async (tipo = 'entrada', override = {}) => {
    // Gera nomes únicos para categoria e localizacao
    const unique = Date.now() + '-' + Math.floor(Math.random() * 10000);
    const categoriaNome = `Categoria Teste ${unique}`;
    const localizacaoNome = `Localizacao Teste ${unique}`;
    // Cria categoria
    const catRes = await request(BASE_URL)
        .post('/categorias')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: categoriaNome });
    const categoria = catRes.body?.data?._id;
    expect(categoria).toBeTruthy();
    // Cria localizacao
    const locRes = await request(BASE_URL)
        .post('/localizacoes')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: localizacaoNome });
    const localizacao = locRes.body?.data?._id;
    expect(localizacao).toBeTruthy();
    // Cria componente com todos os campos obrigatórios
    const componenteNome = `Resistor ${unique}`;
    const compRes = await request(BASE_URL)
        .post('/componentes')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            nome: componenteNome, 
            categoria, 
            quantidade: 100, 
            estoque_minimo: "10", 
            valor_unitario: "0.5", 
            localizacao
        });
    const componente = compRes.body?.data?._id;
    expect(componente).toBeTruthy();
    let fornecedor = null;
    if (tipo === 'entrada') {
        const fornecedorNome = `Fornecedor Teste ${unique}`;
        const fornRes = await request(BASE_URL)
            .post('/fornecedores')
            .set('Authorization', `Bearer ${token}`)
            .send({ nome: fornecedorNome, cnpj: '12345678000199' });
        const fornecedorId = fornRes.body?.data?._id;
        expect(fornecedorId).toBeTruthy();
        fornecedor = fornecedorId;
    }
    return {
        componente,
        tipo,
        quantidade: "10",
        data: new Date(),
        ...(fornecedor && { fornecedor }),
        ...override,
    };
};

describe('Rotas de Movimentação', () => {
    let movimentacaoId;

    beforeAll(async () => {
        // Testa se o servidor está online
        try {
            await request(BASE_URL).get('/');
        } catch (err) {
            // Se o servidor não estiver rodando, o teste falhará naturalmente
        }
        // Cria usuário admin e faz login
        const senhaAdmin = 'Admin1234!';
        try {
            await request(BASE_URL)
                .post('/usuarios')
                .send({
                    nome: 'Admin',
                    email: 'admin@admin.com',
                    senha: senhaAdmin,
                    ativo: true
                });
        } catch (err) { }
        const loginRes = await request(BASE_URL)
            .post('/login')
            .send({ email: 'admin@admin.com', senha: senhaAdmin });
        token = loginRes.body?.data?.user?.accesstoken;
        expect(token).toBeTruthy();
    }, TIMEOUT);

    describe('POST /movimentacoes', () => {
        it('deve cadastrar movimentação válida', async () => {
            const dados = await criarMovimentacaoValida();
            const res = await request(BASE_URL).post('/movimentacoes').set('Authorization', `Bearer ${token}`).send(dados);
            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data._id).toBeTruthy();
            movimentacaoId = res.body.data._id;
        }, TIMEOUT);
        it('deve falhar ao cadastrar sem campos obrigatórios', async () => {
            const res = await request(BASE_URL).post('/movimentacoes').set('Authorization', `Bearer ${token}`).send({});
            expect([400, 422]).toContain(res.status);
        }, TIMEOUT);
        it('deve exigir fornecedor em movimentação de entrada', async () => {
            const dados = await criarMovimentacaoValida('entrada', { fornecedor: undefined });
            const res = await request(BASE_URL).post('/movimentacoes').set('Authorization', `Bearer ${token}`).send(dados);
            expect([400, 422]).toContain(res.status);
        }, TIMEOUT);
        it('deve falhar ao cadastrar com fornecedor inexistente', async () => {
            const dados = await criarMovimentacaoValida('entrada', { fornecedor: new mongoose.Types.ObjectId() });
            const res = await request(BASE_URL).post('/movimentacoes').set('Authorization', `Bearer ${token}`).send(dados);
            expect([400, 404, 422]).toContain(res.status);
        }, TIMEOUT);
    });

    describe('GET /movimentacoes', () => {
        it('deve listar todas as movimentações', async () => {
            const dados = await criarMovimentacaoValida();
            await request(BASE_URL).post('/movimentacoes').set('Authorization', `Bearer ${token}`).send(dados);
            const res = await request(BASE_URL).get('/movimentacoes').set('Authorization', `Bearer ${token}`);
            expect([200, 201]).toContain(res.status);
            let lista = res.body.data;
            if (!Array.isArray(lista)) {
                if (Array.isArray(res.body.data?.docs)) lista = res.body.data.docs;
                else if (Array.isArray(res.body.data?.items)) lista = res.body.data.items;
                else if (Array.isArray(res.body.data?.results)) lista = res.body.data.results;
            }
            expect(Array.isArray(lista)).toBe(true);
            expect(lista.length).toBeGreaterThan(0);
        }, TIMEOUT);
    });
    describe('GET /movimentacoes/:id', () => {
        it('deve retornar movimentação por id', async () => {
            const dados = await criarMovimentacaoValida();
            const movRes = await request(BASE_URL).post('/movimentacoes').set('Authorization', `Bearer ${token}`).send(dados);
            expect(movRes.body.data).toBeTruthy();
            const id = movRes.body.data._id;
            const res = await request(BASE_URL).get(`/movimentacoes/${id}`).set('Authorization', `Bearer ${token}`);
            expect([200, 201]).toContain(res.status);
            expect(res.body.data).toHaveProperty('_id', id);
        }, TIMEOUT);
        it('deve retornar 404 para movimentação inexistente', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(BASE_URL).get(`/movimentacoes/${id}`).set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(404);
        }, TIMEOUT);
    });
});