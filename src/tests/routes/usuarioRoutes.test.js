import request from 'supertest';
import app from '../../app';

import DbConnect from '../../config/DbConnect.js';
import mongoose from 'mongoose';

beforeAll(async () => {
    await DbConnect.conectar();
});

afterAll(async () => {
    await mongoose.connection.close();
});

it("Deve retornar usuário existente", async() => {
    const resposta = await 
        request(app)
        .get('/usuarios')
        expect(resposta.status).toBe(200)
});