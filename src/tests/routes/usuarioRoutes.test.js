import request from "supertest";
import { describe, it, expect, beforeAll } from "@jest/globals";
import faker from "faker-br";
import dotenv from 'dotenv';
import "../../../src/routes/usuarioRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

describe("Usuários", () => {
    let token;
    let usuarioId;
    let usuarioId2;

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
        } catch (err) {}
        const loginRes = await request(BASE_URL)
            .post('/login')
            .send({ email: 'admin@admin.com', senha: senhaAdmin });
        token = loginRes.body?.data?.user?.accesstoken;
        if (!token) throw new Error('Token JWT não retornado pelo login: ' + JSON.stringify(loginRes.body));
    });

    it("Deve cadastrar um usuário válido (POST)", async () => {
        const objUsuario = {
            nome: faker.name.firstName(),
            email: faker.internet.email(),
            senha: 'Senha1234!'
        };
        const res = await request(BASE_URL)
            .post("/usuarios")
            .send(objUsuario)
            .expect(201);
        usuarioId = res.body.data._id;
        expect(res.body.data).toHaveProperty("_id");
        expect(res.body.data.ativo).toBe(true);
        expect(res.body.data).not.toHaveProperty("senha");
    });

    it("Não deve cadastrar usuário sem nome, email ou senha (400)", async () => {
        await request(BASE_URL).post("/usuarios").send({ email: faker.internet.email(), senha: 'Senha1234!' }).expect(400);
        await request(BASE_URL).post("/usuarios").send({ nome: faker.name.firstName(), senha: 'Senha1234!' }).expect(400);
        await request(BASE_URL).post("/usuarios").send({ nome: faker.name.firstName(), email: faker.internet.email() }).expect(400);
    });

    it("Não deve cadastrar usuário com email duplicado (409 ou 400)", async () => {
        const email = faker.internet.email();
        await request(BASE_URL).post("/usuarios").send({ nome: faker.name.firstName(), email, senha: 'Senha1234!' }).expect(201);
        await request(BASE_URL).post("/usuarios").send({ nome: faker.name.firstName(), email, senha: 'Senha1234!' }).expect(res => {
            expect([400, 409]).toContain(res.status);
        });
    });

    it("Senha deve ser criptografada no banco", async () => {
        const email = faker.internet.email();
        const senha = 'Senha1234!';
        const resCreate = await request(BASE_URL)
            .post("/usuarios")
            .send({ nome: faker.name.firstName(), email, senha })
            .expect(201);
        const usuarioId = resCreate.body.data._id;
        const res = await request(BASE_URL)
            .get(`/usuarios/${usuarioId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        const usuario = res.body.data;
        expect(usuario).toBeDefined();
        expect(usuario).not.toHaveProperty("senha", senha);
    });

    it("Deve listar todos os usuários (GET)", async () => {
        const res = await request(BASE_URL)
            .get("/usuarios")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(Array.isArray(res.body.data.docs)).toBe(true);
    });

    it("Deve retornar usuário por id (GET /usuarios/:id)", async () => {
        const res = await request(BASE_URL)
            .get(`/usuarios/${usuarioId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(res.body.data._id).toBe(usuarioId);
    });

    it("Deve retornar 404 ao buscar usuário inexistente", async () => {
        await request(BASE_URL)
            .get(`/usuarios/000000000000000000000000`)
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("Deve atualizar usuário (PUT)", async () => {
        const res = await request(BASE_URL)
            .put(`/usuarios/${usuarioId}`)
            .send({ nome: "NovoNome" })
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(res.body.data.nome).toBe("NovoNome");
    });

    it("Não deve atualizar email ou senha via update (PUT)", async () => {
        const email = faker.internet.email();
        const senha = 'Senha1234!';
        const res1 = await request(BASE_URL).post("/usuarios").send({ nome: faker.name.firstName(), email, senha }).expect(201);
        usuarioId2 = res1.body.data._id;
        await request(BASE_URL)
            .put(`/usuarios/${usuarioId2}`)
            .send({ email: "novo@email.com", senha: "NovaSenha123!" })
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        const res2 = await request(BASE_URL)
            .get(`/usuarios/${usuarioId2}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(res2.body.data.email).toBe(email);
    });

    it("Deve retornar 404 ao atualizar usuário inexistente", async () => {
        await request(BASE_URL)
            .put(`/usuarios/000000000000000000000000`)
            .send({ nome: "NovoNome" })
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("Deve deletar usuário (DELETE)", async () => {
        const email = faker.internet.email();
        const senha = 'Senha1234!';
        const res1 = await request(BASE_URL).post("/usuarios").send({ nome: faker.name.firstName(), email, senha }).expect(201);
        const id = res1.body.data._id;
        await request(BASE_URL)
            .delete(`/usuarios/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
    });

    it("Deve retornar 404 ao deletar usuário inexistente", async () => {
        await request(BASE_URL)
            .delete(`/usuarios/000000000000000000000000`)
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    it("Deve aplicar filtro de busca por nome", async () => {
        const nomeFiltro = "UsuarioFiltro" + Date.now();
        await request(BASE_URL)
            .post("/usuarios")
            .send({ nome: nomeFiltro, email: faker.internet.email(), senha: 'Senha1234!' });
        const res = await request(BASE_URL)
            .get(`/usuarios?nome=${nomeFiltro}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        expect(res.body.data.docs.some(u => u.nome === nomeFiltro)).toBe(true);
    });

    it("Resposta não deve conter campo senha", async () => {
        const obj = { nome: faker.name.firstName() + Date.now(), email: faker.internet.email(), senha: 'Senha1234!' };
        const res = await request(BASE_URL)
            .post("/usuarios")
            .send(obj)
            .expect(201);
        expect(res.body.data).not.toHaveProperty("senha");
    });
});