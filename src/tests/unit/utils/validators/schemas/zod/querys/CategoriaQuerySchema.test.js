import { CategoriaIdSchema, CategoriaQuerySchema } from '../../../../../../../utils/validators/schemas/zod/querys/CategoriaQuerySchema.js';
import mongoose from 'mongoose';

describe('CategoriaIdSchema', () => {
    it('deve validar um ObjectId correto', () => {
        const idValido = new mongoose.Types.ObjectId().toString();
        expect(() => CategoriaIdSchema.parse(idValido)).not.toThrow();
    });

    it('deve invalidar um ObjectId incorreto', () => {
        const idInvalido = '12345';
        expect(() => CategoriaIdSchema.parse(idInvalido)).toThrow('ID inválido');
    });
});

describe('CategoriaQuerySchema', () => {
    const consultaValida = {
        nome: 'Resistores',
        page: '2',
        limite: '20',
    };

    it('deve validar um objeto de consulta correto', () => {
        expect(() => CategoriaQuerySchema.parse(consultaValida)).not.toThrow();
    });

    it('deve permitir campos opcionais ausentes', () => {
        expect(() => CategoriaQuerySchema.parse({})).not.toThrow();
    });

    it('deve remover espaços do nome e aceitar', () => {
        const consulta = { ...consultaValida, nome: '   Capacitores   ' };
        const resultado = CategoriaQuerySchema.parse(consulta);
        expect(resultado.nome).toBe('Capacitores');
    });

    it('deve invalidar nome vazio', () => {
        const consulta = { ...consultaValida, nome: '   ' };
        expect(() => CategoriaQuerySchema.parse(consulta)).toThrow('Nome não pode ser vazio');
    });

    it('deve permitir nome indefinido', () => {
        const consulta = { ...consultaValida };
        delete consulta.nome;
        expect(() => CategoriaQuerySchema.parse(consulta)).not.toThrow();
    });

    it('deve invalidar valor não numérico para page', () => {
        const consulta = { ...consultaValida, page: 'abc' };
        expect(() => CategoriaQuerySchema.parse(consulta)).toThrow('Page deve ser um número inteiro maior que 0');
    });

    it('deve invalidar page menor que 1', () => {
        const consulta = { ...consultaValida, page: '0' };
        expect(() => CategoriaQuerySchema.parse(consulta)).toThrow('Page deve ser um número inteiro maior que 0');
    });

    it('deve definir page como 1 se não fornecido', () => {
        const consulta = { ...consultaValida };
        delete consulta.page;
        const resultado = CategoriaQuerySchema.parse(consulta);
        expect(resultado.page).toBe(1);
    });

    it('deve invalidar limite maior que 100', () => {
        const consulta = { ...consultaValida, limite: '101' };
        expect(() => CategoriaQuerySchema.parse(consulta)).toThrow('Limite deve ser um número inteiro entre 1 e 100');
    });

    it('deve invalidar limite menor que 1', () => {
        const consulta = { ...consultaValida, limite: '0' };
        expect(() => CategoriaQuerySchema.parse(consulta)).toThrow('Limite deve ser um número inteiro entre 1 e 100');
    });

    it('deve definir limite como 10 se não fornecido', () => {
        const consulta = { ...consultaValida };
        delete consulta.limite;
        const resultado = CategoriaQuerySchema.parse(consulta);
        expect(resultado.limite).toBe(10);
    });
});