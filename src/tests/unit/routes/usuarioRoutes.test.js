import request from 'supertest';

it("Deve retornar usuário existente", async() => {
    const resposta = await 
        request('http://localhost:5011')
        .get('/usuarios')
        expect(resposta.status).toBe(200)
});