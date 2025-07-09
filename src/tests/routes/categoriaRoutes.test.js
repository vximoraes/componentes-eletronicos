import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import "../../../src/routes/categoriaRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

let token;

const criarCategoriaValida = async (override = {}) => {
    const unique = Date.now() + '-' + Math.floor(Math.random() * 10000);
    const nome = `Categoria Teste ${unique}`;
    return {
        nome,
        ...override
    };
};

describe('Rotas de Categoria', () => {
    let categoriaId;

    beforeAll(async () => {
        try {
            await request(BASE_URL).get('/');
        } catch (err) {}
        const senhaAdmin = 'Senha@123';
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

    describe('POST /categorias', () => {
        it('deve cadastrar categoria válida', async () => {
            const dados = await criarCategoriaValida();
            const res = await request(BASE_URL).post('/categorias').set('Authorization', `Bearer ${token}`).send(dados);
            expect([200, 201]).toContain(res.status);
            expect(res.body.data).toHaveProperty('_id');
            categoriaId = res.body.data._id;
        });
        it('deve falhar ao cadastrar sem nome', async () => {
            const res = await request(BASE_URL).post('/categorias').set('Authorization', `Bearer ${token}`).send({});
            expect([400, 422]).toContain(res.status);
        });
        it('deve falhar ao cadastrar com nome já existente', async () => {
            const dados = await criarCategoriaValida();
            await request(BASE_URL).post('/categorias').set('Authorization', `Bearer ${token}`).send(dados);
            const res = await request(BASE_URL).post('/categorias').set('Authorization', `Bearer ${token}`).send(dados);
            expect([400, 409, 422]).toContain(res.status);
        });
    });

    describe('GET /categorias', () => {
        it('deve listar todas as categorias', async () => {
            const res = await request(BASE_URL).get('/categorias').set('Authorization', `Bearer ${token}`);
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

    describe('GET /categorias/:id', () => {
        it('deve retornar categoria por id', async () => {
            const dados = await criarCategoriaValida();
            const catRes = await request(BASE_URL).post('/categorias').set('Authorization', `Bearer ${token}`).send(dados);
            const id = catRes.body.data._id;
            const res = await request(BASE_URL).get(`/categorias/${id}`).set('Authorization', `Bearer ${token}`);
            expect([200, 201]).toContain(res.status);
            expect(res.body.data).toHaveProperty('_id', id);
        });
        it('deve retornar 404 para categoria inexistente', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(BASE_URL).get(`/categorias/${id}`).set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(404);
        });
    });

    describe('PATCH /categorias/:id', () => {
        it('deve atualizar nome da categoria', async () => {
            const dados = await criarCategoriaValida();
            const catRes = await request(BASE_URL).post('/categorias').set('Authorization', `Bearer ${token}`).send(dados);
            const id = catRes.body.data._id;
            const novoNome = dados.nome + ' Atualizado';
            const res = await request(BASE_URL).patch(`/categorias/${id}`).set('Authorization', `Bearer ${token}`).send({ nome: novoNome });
            expect([200, 201]).toContain(res.status);
            expect(res.body.data.nome).toBe(novoNome);
        });
        it('deve falhar ao atualizar para nome já existente', async () => {
            const dados1 = await criarCategoriaValida();
            const dados2 = await criarCategoriaValida();
            const cat1 = await request(BASE_URL).post('/categorias').set('Authorization', `Bearer ${token}`).send(dados1);
            const cat2 = await request(BASE_URL).post('/categorias').set('Authorization', `Bearer ${token}`).send(dados2);
            const res = await request(BASE_URL).patch(`/categorias/${cat2.body.data._id}`).set('Authorization', `Bearer ${token}`).send({ nome: dados1.nome });
            expect([400, 409, 422]).toContain(res.status);
        });
        it('deve retornar 404 ao atualizar categoria inexistente', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(BASE_URL).patch(`/categorias/${id}`).set('Authorization', `Bearer ${token}`).send({ nome: 'Qualquer' });
            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /categorias/:id', () => {
        it('deve remover categoria existente', async () => {
            const dados = await criarCategoriaValida();
            const catRes = await request(BASE_URL).post('/categorias').set('Authorization', `Bearer ${token}`).send(dados);
            const id = catRes.body.data._id;
            const res = await request(BASE_URL).delete(`/categorias/${id}`).set('Authorization', `Bearer ${token}`);
            expect([200, 201, 204]).toContain(res.status);
        });
        it('deve retornar 404 ao remover categoria inexistente', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(BASE_URL).delete(`/categorias/${id}`).set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(404);
        });
    });
});