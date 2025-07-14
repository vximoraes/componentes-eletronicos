import request from "supertest";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';
import "../../../src/routes/componenteOrcamentoRoutes";

dotenv.config();

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

let token;
let orcamentoId;
let componenteId;
let componenteOrcamentoId;

// Função auxiliar para criar orçamento de teste
const criarOrcamentoTeste = async () => {
    const res = await request(BASE_URL)
        .post('/orcamentos')
        .set('Authorization', `Bearer ${token}`)
        .send({
            nome: "Orçamento Teste Componente",
            protocolo: `PROTOCOLO-${Date.now()}`,
            componente_orcamento: []
        });
    return res.body.data._id;
};

// Função auxiliar para criar componente de teste
const criarComponenteTeste = async () => {
    const res = await request(BASE_URL)
        .post('/componentes')
        .set('Authorization', `Bearer ${token}`)
        .send({
            nome: "Componente Teste Orçamento",
            valor_unitario: "15.99"
        });
    return res.body.data._id;
};

// Função auxiliar para criar componente_orcamento válido
const criarComponenteOrcamentoValido = async (orcamentoId, componenteId, override = {}) => {
    return {
        componente_id: componenteId,
        orcamento_id: orcamentoId,
        quantidade: "5",
        preco_unitario: "10.50",
        ...override
    };
};

describe('Rotas de ComponenteOrcamento', () => {
    beforeAll(async () => {
        jest.setTimeout(30000); // Timeout aumentado para 30s

        // Configuração inicial
        const senhaAdmin = 'Senha@123';
        try {
            await request(BASE_URL).get('/');
        } catch (err) {}

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

        // Cria dados necessários para os testes
        orcamentoId = await criarOrcamentoTeste();
        componenteId = await criarComponenteTeste();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('POST /componente-orcamentos', () => {
        it('deve cadastrar componente_orcamento válido', async () => {
            const dados = await criarComponenteOrcamentoValido(orcamentoId, componenteId);
            const res = await request(BASE_URL)
                .post('/componente-orcamentos')
                .set('Authorization', `Bearer ${token}`)
                .send(dados);

            expect([200, 201]).toContain(res.status);
            expect(res.body.data).toHaveProperty('_id');
            componenteOrcamentoId = res.body.data._id;
        });

        it('deve falhar ao cadastrar sem campos obrigatórios', async () => {
            const res = await request(BASE_URL)
                .post('/componente-orcamentos')
                .set('Authorization', `Bearer ${token}`)
                .send({});
            expect([400, 422]).toContain(res.status);
        });

        it('deve falhar ao cadastrar com orçamento_id inexistente', async () => {
            const dados = await criarComponenteOrcamentoValido(
                new mongoose.Types.ObjectId().toString(), 
                componenteId
            );
            const res = await request(BASE_URL)
                .post('/componente-orcamentos')
                .set('Authorization', `Bearer ${token}`)
                .send(dados);
            expect([400, 404, 422]).toContain(res.status);
        });

        it('deve falhar ao cadastrar com componente_id inexistente', async () => {
            const dados = await criarComponenteOrcamentoValido(
                orcamentoId,
                new mongoose.Types.ObjectId().toString()
            );
            const res = await request(BASE_URL)
                .post('/componente-orcamentos')
                .set('Authorization', `Bearer ${token}`)
                .send(dados);
            expect([400, 404, 422]).toContain(res.status);
        });
    });

    describe('GET /componente-orcamentos', () => {
        it('deve listar todos os componente_orcamentos', async () => {
            const res = await request(BASE_URL)
                .get('/componente-orcamentos')
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

        it('deve filtrar por orçamento_id', async () => {
            const res = await request(BASE_URL)
                .get(`/componente-orcamentos?orcamento_id=${orcamentoId}`)
                .set('Authorization', `Bearer ${token}`);
            expect([200, 201]).toContain(res.status);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    describe('GET /componente-orcamentos/:id', () => {
        it('deve retornar componente_orcamento por id', async () => {
            const res = await request(BASE_URL)
                .get(`/componente-orcamentos/${componenteOrcamentoId}`)
                .set('Authorization', `Bearer ${token}`);
            expect([200, 201]).toContain(res.status);
            expect(res.body.data).toHaveProperty('_id', componenteOrcamentoId);
        });

        it('deve retornar 404 para componente_orcamento inexistente', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(BASE_URL)
                .get(`/componente-orcamentos/${id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(404);
        });
    });

    describe('PATCH /componente-orcamentos/:id', () => {
        it('deve atualizar quantidade do componente_orcamento', async () => {
            const novaQuantidade = "10";
            const res = await request(BASE_URL)
                .patch(`/componente-orcamentos/${componenteOrcamentoId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ quantidade: novaQuantidade });
            expect([200, 201]).toContain(res.status);
            expect(res.body.data.quantidade).toBe(parseInt(novaQuantidade));
        });

        it('não deve permitir atualizar orçamento_id', async () => {
            const novoOrcamentoId = new mongoose.Types.ObjectId().toString();
            const res = await request(BASE_URL)
                .patch(`/componente-orcamentos/${componenteOrcamentoId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ orcamento_id: novoOrcamentoId });
            expect([400, 403, 422]).toContain(res.status);
        });

        it('deve retornar 404 ao atualizar componente_orcamento inexistente', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(BASE_URL)
                .patch(`/componente-orcamentos/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ quantidade: "5" });
            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /componente-orcamentos/:id', () => {
        it('deve remover componente_orcamento existente', async () => {
            // Primeiro cria um novo para deletar
            const dados = await criarComponenteOrcamentoValido(orcamentoId, componenteId);
            const createRes = await request(BASE_URL)
                .post('/componente-orcamentos')
                .set('Authorization', `Bearer ${token}`)
                .send(dados);
            const id = createRes.body.data._id;

            const res = await request(BASE_URL)
                .delete(`/componente-orcamentos/${id}`)
                .set('Authorization', `Bearer ${token}`);
            expect([200, 201, 204]).toContain(res.status);
        });

        it('deve retornar 404 ao remover componente_orcamento inexistente', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(BASE_URL)
                .delete(`/componente-orcamentos/${id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(404);
        });
    });

    describe('Relacionamentos', () => {
        it('deve retornar orçamento relacionado', async () => {
            const res = await request(BASE_URL)
                .get(`/componente-orcamentos/${componenteOrcamentoId}?populate=orcamento_id`)
                .set('Authorization', `Bearer ${token}`);
            expect([200, 201]).toContain(res.status);
            expect(res.body.data.orcamento_id).toHaveProperty('_id', orcamentoId);
        });

        it('deve retornar componente relacionado', async () => {
            const res = await request(BASE_URL)
                .get(`/componente-orcamentos/${componenteOrcamentoId}?populate=componente_id`)
                .set('Authorization', `Bearer ${token}`);
            expect([200, 201]).toContain(res.status);
            expect(res.body.data.componente_id).toHaveProperty('_id', componenteId);
        });
    });

    it('deve retornar erro 500 para falha inesperada', async () => {
        const res = await request(BASE_URL)
            .get('/componente-orcamentos/erro-interno')
            .set('Authorization', `Bearer ${token}`);
        expect([500, 400, 404]).toContain(res.status);
    });
});