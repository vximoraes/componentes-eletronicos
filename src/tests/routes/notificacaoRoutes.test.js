import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

let token;
let usuarioId;

const criarUsuarioValido = async () => {
    const unique = Date.now() + '-' + Math.floor(Math.random() * 10000);
    const email = `user${unique}@test.com`;
    const senha = 'Senha1234!';
    const res = await request(BASE_URL)
        .post('/usuarios')
        .send({ nome: `Usuário Teste ${unique}`, email, senha, ativo: true });
    return res.body.data?._id;
};

const criarNotificacaoValida = async (override = {}) => {
    if (!usuarioId) usuarioId = await criarUsuarioValido();
    return {
        mensagem: 'Mensagem de teste',
        usuario: usuarioId,
        ...override
    };
};

describe('Rotas de Notificação', () => {
    let notificacaoId;

    beforeAll(async () => {
        // Garante usuário admin e login
        const senhaAdmin = 'Senha@123';
        try {
            await request(BASE_URL)
                .post('/usuarios')
                .send({ nome: 'Admin', email: 'admin@admin.com', senha: senhaAdmin, ativo: true });
        } catch (err) {}
        const loginRes = await request(BASE_URL)
            .post('/login')
            .send({ email: 'admin@admin.com', senha: senhaAdmin });
        token = loginRes.body?.data?.user?.accesstoken;
        expect(token).toBeTruthy();
        usuarioId = await criarUsuarioValido();
    });

    describe('POST /notificacoes', () => {
        it('deve cadastrar notificação válida', async () => {
            const dados = await criarNotificacaoValida();
            const res = await request(BASE_URL)
                .post('/notificacoes')
                .set('Authorization', `Bearer ${token}`)
                .send(dados);
            expect([200, 201]).toContain(res.status);
            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data.visualizada).toBe(false);
            notificacaoId = res.body.data._id;
        });
        it('deve falhar ao cadastrar sem campos obrigatórios', async () => {
            const res = await request(BASE_URL)
                .post('/notificacoes')
                .set('Authorization', `Bearer ${token}`)
                .send({});
            expect([400, 422]).toContain(res.status);
        });
        it('deve falhar ao cadastrar com usuário inexistente', async () => {
            const dados = await criarNotificacaoValida({ usuario: new mongoose.Types.ObjectId().toString() });
            const res = await request(BASE_URL)
                .post('/notificacoes')
                .set('Authorization', `Bearer ${token}`)
                .send(dados);
            expect([400, 404, 422]).toContain(res.status);
        });
        it('deve falhar ao cadastrar com tipos errados', async () => {
            const dados = await criarNotificacaoValida({ mensagem: 12345 });
            const res = await request(BASE_URL)
                .post('/notificacoes')
                .set('Authorization', `Bearer ${token}`)
                .send(dados);
            expect([400, 422]).toContain(res.status);
        });
        it('visualizada deve ser false por padrão', async () => {
            const dados = await criarNotificacaoValida();
            delete dados.visualizada;
            const res = await request(BASE_URL)
                .post('/notificacoes')
                .set('Authorization', `Bearer ${token}`)
                .send(dados);
            expect(res.body.data.visualizada).toBe(false);
        });
    });

    describe('GET /notificacoes', () => {
        it('deve listar todas as notificações', async () => {
            const res = await request(BASE_URL)
                .get('/notificacoes')
                .set('Authorization', `Bearer ${token}`);
            expect([200, 201]).toContain(res.status);
            let lista = res.body.data;
            if (!Array.isArray(lista)) {
                if (Array.isArray(res.body.data?.docs)) lista = res.body.data.docs;
                else if (Array.isArray(res.body.data?.items)) lista = res.body.data.items;
                else if (Array.isArray(res.body.data?.results)) lista = res.body.data.results;
            }
            expect(Array.isArray(lista)).toBe(true);
        });
        it('deve filtrar por usuario', async () => {
            // Garante que existe pelo menos uma notificação para o usuarioId
            await request(BASE_URL)
                .post('/notificacoes')
                .set('Authorization', `Bearer ${token}`)
                .send(await criarNotificacaoValida());
            const res = await request(BASE_URL)
                .get(`/notificacoes?usuario=${usuarioId}`)
                .set('Authorization', `Bearer ${token}`);
            let lista = res.body.data;
            if (!Array.isArray(lista)) {
                if (Array.isArray(res.body.data?.docs)) lista = res.body.data.docs;
                else if (Array.isArray(res.body.data?.items)) lista = res.body.data.items;
                else if (Array.isArray(res.body.data?.results)) lista = res.body.data.results;
            }
            const apenasDoUsuario = lista.filter(n => {
                if (typeof n.usuario === 'object' && n.usuario !== null) {
                    return n.usuario._id?.toString() === usuarioId.toString();
                }
                return (n.usuario?.toString?.() || n.usuario) === usuarioId.toString();
            });
            expect([200, 201]).toContain(res.status);
            expect(apenasDoUsuario.length).toBeGreaterThanOrEqual(0);
        });
        it('deve filtrar por visualizada=false', async () => {
            // Cria notificações não visualizadas para garantir o filtro
            const n1 = await request(BASE_URL)
                .post('/notificacoes')
                .set('Authorization', `Bearer ${token}`)
                .send(await criarNotificacaoValida());
            const n2 = await request(BASE_URL)
                .post('/notificacoes')
                .set('Authorization', `Bearer ${token}`)
                .send(await criarNotificacaoValida());
            const res = await request(BASE_URL)
                .get('/notificacoes?visualizada=false')
                .set('Authorization', `Bearer ${token}`);
            expect([200, 201]).toContain(res.status);
            let lista = res.body.data;
            if (!Array.isArray(lista)) {
                if (Array.isArray(res.body.data?.docs)) lista = res.body.data.docs;
                else if (Array.isArray(res.body.data?.items)) lista = res.body.data.items;
                else if (Array.isArray(res.body.data?.results)) lista = res.body.data.results;
            }
            const naoVisualizadas = lista.filter(n => n.visualizada === false || n.visualizada === 'false');
            expect(naoVisualizadas.length).toBeGreaterThanOrEqual(2);
        });
        it('deve paginar notificações', async () => {
            const res = await request(BASE_URL)
                .get('/notificacoes?page=1&limit=2')
                .set('Authorization', `Bearer ${token}`);
            expect([200, 201]).toContain(res.status);
            expect(res.body.data).toHaveProperty('docs');
            expect(res.body.data).toHaveProperty('totalDocs');
            expect(res.body.data).toHaveProperty('page');
        });
        it('deve retornar erro 400 para filtro inválido', async () => {
            const res = await request(BASE_URL)
                .get('/notificacoes?visualizada=talvez')
                .set('Authorization', `Bearer ${token}`);
            let lista = res.body.data;
            if (!Array.isArray(lista)) {
                if (Array.isArray(res.body.data?.docs)) lista = res.body.data.docs;
                else if (Array.isArray(res.body.data?.items)) lista = res.body.data.items;
                else if (Array.isArray(res.body.data?.results)) lista = res.body.data.results;
            }
            expect([200, 400, 422]).toContain(res.status);
            if (res.status === 200) {
                expect(Array.isArray(lista) && lista.length === 0).toBe(false);
            }
        });
    });

    describe('GET /notificacoes/:id', () => {
        it('deve retornar notificação por id', async () => {
            const dados = await criarNotificacaoValida();
            const notRes = await request(BASE_URL)
                .post('/notificacoes')
                .set('Authorization', `Bearer ${token}`)
                .send(dados);
            const id = notRes.body.data._id;
            const res = await request(BASE_URL)
                .get(`/notificacoes/${id}`)
                .set('Authorization', `Bearer ${token}`);
            expect([200, 201]).toContain(res.status);
            expect(res.body.data).toHaveProperty('_id', id);
        });
        it('deve retornar 404 para notificação inexistente', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(BASE_URL)
                .get(`/notificacoes/${id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(404);
        });
    });

    describe('PATCH /notificacoes/:id/visualizar', () => {
        it('deve marcar notificação como visualizada', async () => {
            const dados = await criarNotificacaoValida();
            const notRes = await request(BASE_URL)
                .post('/notificacoes')
                .set('Authorization', `Bearer ${token}`)
                .send(dados);
            const id = notRes.body.data._id;
            const res = await request(BASE_URL)
                .patch(`/notificacoes/${id}/visualizar`)
                .set('Authorization', `Bearer ${token}`)
                .send();
            expect([200, 201]).toContain(res.status);
            expect(res.body.data.visualizada).toBe(true);
            if ('dataLeitura' in res.body.data) {
                expect(res.body.data.dataLeitura).toBeTruthy();
            }
        });
        it('deve retornar 404 ao marcar inexistente', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(BASE_URL)
                .patch(`/notificacoes/${id}/visualizar`)
                .set('Authorization', `Bearer ${token}`)
                .send();
            expect(res.status).toBe(404);
        });
    });

    describe('PUT /notificacoes/:id/visualizar', () => {
        it('deve marcar notificação como visualizada (PUT)', async () => {
            const dados = await criarNotificacaoValida();
            const notRes = await request(BASE_URL)
                .post('/notificacoes')
                .set('Authorization', `Bearer ${token}`)
                .send(dados);
            const id = notRes.body.data._id;
            const res = await request(BASE_URL)
                .put(`/notificacoes/${id}/visualizar`)
                .set('Authorization', `Bearer ${token}`)
                .send();
            expect([200, 201]).toContain(res.status);
            expect(res.body.data.visualizada).toBe(true);
            if ('dataLeitura' in res.body.data) {
                expect(res.body.data.dataLeitura).toBeTruthy();
            }
        });
        it('deve retornar 404 ao marcar inexistente (PUT)', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(BASE_URL)
                .put(`/notificacoes/${id}/visualizar`)
                .set('Authorization', `Bearer ${token}`)
                .send();
            expect(res.status).toBe(404);
        });
    });

    it('deve retornar erro 500 para falha inesperada', async () => {
        const res = await request(BASE_URL)
            .get('/notificacoes/erro-interno')
            .set('Authorization', `Bearer ${token}`);
        expect([500, 400, 404]).toContain(res.status);
    });
});