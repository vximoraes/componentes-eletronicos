import request from "supertest";
import { describe, it, expect, beforeAll } from "@jest/globals";
import faker from "faker-br";
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;


describe("Fornecedores", () => {
    let token;
    let fornecedorId;
    let fornecedorIdAtualizado;

    beforeAll(async () => {
        const senhaAdmin = 'Admin1234!';
        try {
            // Tenta criar o usuário admin
            const signupRes = await request(BASE_URL)
                .post('/usuarios')
                .send({
                    nome: 'Admin',
                    email: 'admin@admin.com',
                    senha: senhaAdmin,
                    ativo: true
                });
            process.stdout.write('signupRes.body: ' + JSON.stringify(signupRes.body) + '\n');
        } catch (err) {
            process.stdout.write('Erro no cadastro de usuário: ' + err + '\n');
            // Continua para tentar login mesmo se o usuário já existir
        }

        // Tenta login
        const loginRes = await request(BASE_URL)
            .post('/login')
            .send({ email: 'admin@admin.com', senha: senhaAdmin });
        process.stdout.write('loginRes.body: ' + JSON.stringify(loginRes.body) + '\n');
        token = loginRes.body?.data?.user?.accesstoken;
        if (!token) throw new Error('Token JWT não retornado pelo login: ' + JSON.stringify(loginRes.body));
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
        //expect(dados.body.data.nome).toEqual(objFornecedor)
    })

    it("Deve Atualizar um fornecedor", async () => {
        const objFornecedorAtualizado = { nome: faker.name.firstName() }
        const dados = await request(BASE_URL)
            .patch(`/fornecedores/${fornecedorId}`)
            .send(objFornecedorAtualizado)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
    })

    it("Deve Delete um fornecedor", async () => {
        const dados = await request(BASE_URL)
            .delete(`/fornecedores/${fornecedorId}`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
    })
})