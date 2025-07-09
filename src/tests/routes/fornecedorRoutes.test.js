import request from "supertest";
import { describe, it, expect, beforeAll } from "@jest/globals";
import faker from "faker-br";
import dotenv from 'dotenv';
import "../../../src/routes/fornecedorRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

describe("Fornecedores", () => {
    let token;
    let fornecedorId;
    let fornecedorIdAtualizado;

    beforeAll(async () => {
        const senhaAdmin = 'Senha@123';
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
        } catch (err) {}

        const loginRes = await request(BASE_URL)
            .post('/login')
            .send({ email: 'admin@admin.com', senha: senhaAdmin });
        token = loginRes.body?.data?.user?.accesstoken;
        expect(token).toBeTruthy();
    });

    it("Deve retornar os fornecedores no GET - Caso de Sucesso", async () => {
        const dados = await request(BASE_URL)
            .get("/fornecedores")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(Array.isArray(dados.body.data.docs)).toBe(true);
    });

    it("Deve cadastrar um fornecedor no POST - Caso de Sucesso ", async () => {
        const objFornecedor = { nome: faker.name.firstName() }

        const dados = await request(BASE_URL)
            .post("/fornecedores")
            .send(objFornecedor)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .expect(201);
        fornecedorId = dados.body.data._id;
    })

    it("Deve Atualizar um fornecedor", async () => {
        const objFornecedorAtualizado = { nome: faker.name.firstName() }
        await request(BASE_URL)
            .patch(`/fornecedores/${fornecedorId}`)
            .send(objFornecedorAtualizado)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
    })

    it("Deve Delete um fornecedor", async () => {
        await request(BASE_URL)
            .delete(`/fornecedores/${fornecedorId}`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
    })

    it("Não deve cadastrar fornecedor sem nome (400)", async () => {
        const res = await request(BASE_URL)
            .post("/fornecedores")
            .send({})
            .set("Authorization", `Bearer ${token}`)
            .expect(400);
        expect(res.body).toHaveProperty("message");
    });

    it("Não deve cadastrar fornecedor com nome duplicado (400)", async () => {
        const nomeDuplicado = faker.name.firstName() + Date.now();
        await request(BASE_URL)
            .post("/fornecedores")
            .send({ nome: nomeDuplicado })
            .set("Authorization", `Bearer ${token}`)
            .expect(201);
        const res = await request(BASE_URL)
            .post("/fornecedores")
            .send({ nome: nomeDuplicado })
            .set("Authorization", `Bearer ${token}`)
            .expect(400);
        expect(res.body).toHaveProperty("message");
    });

    it("Deve retornar fornecedor por id (GET /fornecedores/:id)", async () => {
        const obj = { nome: faker.name.firstName() + Date.now() };
        const create = await request(BASE_URL)
            .post("/fornecedores")
            .send(obj)
            .set("Authorization", `Bearer ${token}`);
        const id = create.body.data._id;
        const res = await request(BASE_URL)
            .get(`/fornecedores/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(res.body.data._id).toBe(id);
    });

    it("Deve retornar 404 ao buscar fornecedor inexistente", async () => {
        const res = await request(BASE_URL)
            .get(`/fornecedores/000000000000000000000000`)
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
        expect(res.body).toHaveProperty("message");
    });

    it("Não deve atualizar fornecedor com nome duplicado (400)", async () => {
        const nome1 = faker.name.firstName() + Date.now();
        const nome2 = faker.name.firstName() + (Date.now() + 1);
        const f1 = await request(BASE_URL)
            .post("/fornecedores")
            .send({ nome: nome1 })
            .set("Authorization", `Bearer ${token}`);
        const f2 = await request(BASE_URL)
            .post("/fornecedores")
            .send({ nome: nome2 })
            .set("Authorization", `Bearer ${token}`);
        const res = await request(BASE_URL)
            .patch(`/fornecedores/${f2.body.data._id}`)
            .send({ nome: nome1 })
            .set("Authorization", `Bearer ${token}`)
            .expect(400);
        expect(res.body).toHaveProperty("message");
    });

    it("Deve retornar 404 ao atualizar fornecedor inexistente", async () => {
        const res = await request(BASE_URL)
            .patch(`/fornecedores/000000000000000000000000`)
            .send({ nome: faker.name.firstName() })
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
        expect(res.body).toHaveProperty("message");
    });

    it("Deve retornar 404 ao deletar fornecedor inexistente", async () => {
        const res = await request(BASE_URL)
            .delete(`/fornecedores/000000000000000000000000`)
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
        expect(res.body).toHaveProperty("message");
    });

    it("Deve aplicar filtro de busca por nome", async () => {
        const nomeFiltro = "FornecedorFiltro" + Date.now();
        await request(BASE_URL)
            .post("/fornecedores")
            .send({ nome: nomeFiltro })
            .set("Authorization", `Bearer ${token}`);
        const res = await request(BASE_URL)
            .get(`/fornecedores?nome=${nomeFiltro}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(res.body.data.docs.some(f => f.nome === nomeFiltro)).toBe(true);
    });

    it("Resposta não deve conter campos sensíveis ou desnecessários", async () => {
        const obj = { nome: faker.name.firstName() + Date.now() };
        const res = await request(BASE_URL)
            .post("/fornecedores")
            .send(obj)
            .set("Authorization", `Bearer ${token}`)
            .expect(201);
        expect(res.body.data).not.toHaveProperty("senha");
        expect(res.body.data).not.toHaveProperty("password");
    });
});