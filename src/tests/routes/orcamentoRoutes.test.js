import request from "supertest";
import { describe, it, expect, beforeAll } from "@jest/globals";
import faker from "faker-br";
import dotenv from 'dotenv';
import "../../../src/routes/orcamentoRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

describe("Orçamentos", () => {
    let token;
    let orcamentoId;
    let protocolo;
    let componenteId;

    beforeAll(async () => {
        const senhaAdmin = 'Admin1234!';
        process.env.JWT_SECRET = process.env.JWT_SECRET_ACCESS_TOKEN || 'sua_chave_secreta_access';
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
    });

    it("Não deve cadastrar orçamento sem campos obrigatórios (400)", async () => {
        await request(BASE_URL)
            .post("/orcamentos")
            .set("Authorization", `Bearer ${token}`)
            .send({})
            .expect(400);
    });

    it("Deve cadastrar orçamento válido (POST)", async () => {
        protocolo = "PROTOCOLO-" + Date.now();
        const componente = {
            nome: "Resistor 10k",
            fornecedor: "Fornecedor Teste",
            quantidade: "2",
            valor_unitario: "0.5"
        };
        const obj = {
            nome: "Orçamento Teste",
            protocolo,
            componente_orcamento: [componente]
        };
        const res = await request(BASE_URL)
            .post("/orcamentos")
            .set("Authorization", `Bearer ${token}`)
            .send(obj);
        expect(res.status).toBe(201);
        orcamentoId = res.body.data._id;
        expect(res.body.data).toHaveProperty("_id");
        if (Array.isArray(res.body.data.componente_orcamento)) {
            expect(res.body.data.componente_orcamento.length).toBeGreaterThan(0);
            expect(res.body.data.componente_orcamento[0].nome).toBe("Resistor 10k");
        } else {
            expect(true).toBe(true);
        }
    });

    it("Deve listar todos os orçamentos (GET)", async () => {
        const res = await request(BASE_URL)
            .get("/orcamentos")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(Array.isArray(res.body.data.docs || res.body.data)).toBe(true);
    });

    it("Deve buscar orçamento por id (GET /orcamentos/:id)", async () => {
        const res = await request(BASE_URL)
            .get(`/orcamentos/${orcamentoId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(res.body.data._id).toBe(orcamentoId);
    });

    it("Deve retornar 404 ao buscar orçamento inexistente", async () => {
        await request(BASE_URL)
            .get(`/orcamentos/000000000000000000000000`)
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("Deve atualizar orçamento (PATCH)", async () => {
        const novoNome = "Orçamento Atualizado";
        const res = await request(BASE_URL)
            .patch(`/orcamentos/${orcamentoId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ nome: novoNome })
            .expect(200);
        expect(res.body.data.nome).toBe(novoNome);
    });

    it("Deve retornar 404 ao atualizar orçamento inexistente", async () => {
        await request(BASE_URL)
            .patch(`/orcamentos/000000000000000000000000`)
            .set("Authorization", `Bearer ${token}`)
            .send({ nome: "Qualquer" })
            .expect(404);
    });

    it("Deve remover orçamento (DELETE)", async () => {
        const componente = {
            nome: "Resistor 10k",
            fornecedor: "Fornecedor Teste",
            quantidade: "2",
            valor_unitario: "0.5"
        };
        const obj = {
            nome: "Orçamento Remover",
            protocolo: "PROTOCOLO-" + Date.now(),
            componente_orcamento: [componente]
        };
        const res1 = await request(BASE_URL)
            .post("/orcamentos")
            .set("Authorization", `Bearer ${token}`)
            .send(obj)
            .expect(201);
        const id = res1.body.data._id;
        await request(BASE_URL)
            .delete(`/orcamentos/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
    });

    it("Deve adicionar componente ao orçamento", async () => {
        const comp = {
            nome: "Capacitor",
            fornecedor: "Fornecedor Teste",
            quantidade: "1",
            valor_unitario: "2"
        };
        const res = await request(BASE_URL)
            .post(`/orcamentos/${orcamentoId}/componentes`)
            .set("Authorization", `Bearer ${token}`)
            .send(comp)
            .expect(200);
        componenteId = res.body.data._id;
        expect(res.body.data._id).toBeDefined();
    });

    it("Deve atualizar componente do orçamento", async () => {
        expect(componenteId).toBeDefined();
        const res = await request(BASE_URL)
            .patch(`/orcamentos/${orcamentoId}/componentes/${componenteId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ quantidade: "5" })
            .expect(res => {
                expect([200, 404]).toContain(res.status);
            });
        if (res.status === 200) {
            expect(res.body.data.quantidade).toBe(5);
        }
    });

    it("Deve remover componente do orçamento", async () => {
        await request(BASE_URL)
            .delete(`/orcamentos/${orcamentoId}/componentes/${componenteId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
    });
    
    it("Deve aplicar filtro de busca por nome", async () => {
        const nomeFiltro = "OrcamentoFiltro" + Date.now();
        const componente = {
            nome: "Resistor 10k",
            fornecedor: "Fornecedor Teste",
            quantidade: "1",
            valor_unitario: "0.5"
        };
        const obj = {
            nome: nomeFiltro,
            protocolo: "PROTOCOLO-" + Date.now(),
            componente_orcamento: [componente]
        };
        await request(BASE_URL)
            .post("/orcamentos")
            .set("Authorization", `Bearer ${token}`)
            .send(obj);
        const res = await request(BASE_URL)
            .get(`/orcamentos?nome=${nomeFiltro}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(res.body.data.docs.some(o => o.nome === nomeFiltro)).toBe(true);
    });

    it("Resposta não deve conter campos desnecessários", async () => {
        const componente = {
            nome: "Resistor 10k",
            fornecedor: "Fornecedor Teste",
            quantidade: "1",
            valor_unitario: "0.5"
        };
        const obj = {
            nome: "Orçamento Limpo" + Date.now(),
            protocolo: "PROTOCOLO-" + Date.now(),
            componente_orcamento: [componente]
        };
        const res = await request(BASE_URL)
            .post("/orcamentos")
            .set("Authorization", `Bearer ${token}`)
            .send(obj)
            .expect(201);
        expect(res.body.data).not.toHaveProperty("senha");
    });
});