import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import "../../../src/routes/localizacaoRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

let token;

const criarLocalizacaoValida = async (override = {}) => {
    const unique = Date.now() + '-' + Math.floor(Math.random() * 10000);
    const nome = `Localizacao Teste ${unique}`;
    return {
        nome,
        ...override
    };
};

describe('Rotas de Localização', () => {
    let localizacaoId;

    beforeAll(async () => {
        // Testa se o servidor está online
        try {
            await request(BASE_URL).get('/');
        } catch (err) {}
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
        } catch (err) {}
        const loginRes = await request(BASE_URL)
            .post('/login')
            .send({ email: 'admin@admin.com', senha: senhaAdmin });
        token = loginRes.body?.data?.user?.accesstoken;
        expect(token).toBeTruthy();
    });

    describe('POST /localizacoes', () => {
        it('deve cadastrar localização válida', async () => {
            const dados = await criarLocalizacaoValida();
            const res = await request(BASE_URL).post('/localizacoes').set('Authorization', `Bearer ${token}`).send(dados);
            expect([200, 201]).toContain(res.status);
            expect(res.body.data).toHaveProperty('_id');
            localizacaoId = res.body.data._id;
        });
        it('deve falhar ao cadastrar sem nome', async () => {
            const res = await request(BASE_URL).post('/localizacoes').set('Authorization', `Bearer ${token}`).send({});
            expect([400, 422]).toContain(res.status);
        });
        it('deve falhar ao cadastrar com nome já existente', async () => {
            const dados = await criarLocalizacaoValida();
            // Cadastra uma vez
            await request(BASE_URL).post('/localizacoes').set('Authorization', `Bearer ${token}`).send(dados);
            // Tenta cadastrar novamente
            const res = await request(BASE_URL).post('/localizacoes').set('Authorization', `Bearer ${token}`).send(dados);
            expect([400, 409, 422]).toContain(res.status);
        });
    });

    describe('GET /localizacoes', () => {
        it('deve listar todas as localizações', async () => {
            const res = await request(BASE_URL).get('/localizacoes').set('Authorization', `Bearer ${token}`);
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

    describe('GET /localizacoes/:id', () => {
        it('deve retornar localização por id', async () => {
            const dados = await criarLocalizacaoValida();
            const locRes = await request(BASE_URL).post('/localizacoes').set('Authorization', `Bearer ${token}`).send(dados);
            const id = locRes.body.data._id;
            const res = await request(BASE_URL).get(`/localizacoes/${id}`).set('Authorization', `Bearer ${token}`);
            expect([200, 201]).toContain(res.status);
            expect(res.body.data).toHaveProperty('_id', id);
        });
        it('deve retornar 404 para localização inexistente', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(BASE_URL).get(`/localizacoes/${id}`).set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(404);
        });
    });

    describe('PATCH /localizacoes/:id', () => {
        it('deve atualizar nome da localização', async () => {
            const dados = await criarLocalizacaoValida();
            const locRes = await request(BASE_URL).post('/localizacoes').set('Authorization', `Bearer ${token}`).send(dados);
            const id = locRes.body.data._id;
            const novoNome = dados.nome + ' Atualizado';
            const res = await request(BASE_URL).patch(`/localizacoes/${id}`).set('Authorization', `Bearer ${token}`).send({ nome: novoNome });
            expect([200, 201]).toContain(res.status);
            expect(res.body.data.nome).toBe(novoNome);
        });
        it('deve falhar ao atualizar para nome já existente', async () => {
            const dados1 = await criarLocalizacaoValida();
            const dados2 = await criarLocalizacaoValida();
            const loc1 = await request(BASE_URL).post('/localizacoes').set('Authorization', `Bearer ${token}`).send(dados1);
            const loc2 = await request(BASE_URL).post('/localizacoes').set('Authorization', `Bearer ${token}`).send(dados2);
            const res = await request(BASE_URL).patch(`/localizacoes/${loc2.body.data._id}`).set('Authorization', `Bearer ${token}`).send({ nome: dados1.nome });
            expect([400, 409, 422]).toContain(res.status);
        });
        it('deve retornar 404 ao atualizar localização inexistente', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(BASE_URL).patch(`/localizacoes/${id}`).set('Authorization', `Bearer ${token}`).send({ nome: 'Qualquer' });
            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /localizacoes/:id', () => {
        it('deve remover localização existente', async () => {
            const dados = await criarLocalizacaoValida();
            const locRes = await request(BASE_URL).post('/localizacoes').set('Authorization', `Bearer ${token}`).send(dados);
            const id = locRes.body.data._id;
            const res = await request(BASE_URL).delete(`/localizacoes/${id}`).set('Authorization', `Bearer ${token}`);
            expect([200, 201, 204]).toContain(res.status);
        });
        it('deve retornar 404 ao remover localização inexistente', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(BASE_URL).delete(`/localizacoes/${id}`).set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(404);
        });
    });
});