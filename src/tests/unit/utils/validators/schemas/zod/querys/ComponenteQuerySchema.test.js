import { ComponenteIdSchema, ComponenteQuerySchema } from '../../../../../../../utils/validators/schemas/zod/querys/ComponenteQuerySchema.js';
import mongoose from 'mongoose';

describe('ComponenteIdSchema', () => {
    it('deve validar um ObjectId correto', () => {
        const idValido = new mongoose.Types.ObjectId().toString();
        expect(() => ComponenteIdSchema.parse(idValido)).not.toThrow();
    });

    it('deve invalidar um ObjectId incorreto', () => {
        const idInvalido = '12345';
        expect(() => ComponenteIdSchema.parse(idInvalido)).toThrow('ID inválido');
    });
});

describe('ComponenteQuerySchema', () => {
    const consultaValida = {
        nome: 'Resistor',
        quantidade: '10',
        estoque_minimo: 'true',
        localizacao: 'A1',
        categoria: 'Eletrônica',
        ativo: 'false',
        page: '2',
        limite: '20',
    };

    it('deve validar um objeto de consulta correto', () => {
        expect(() => ComponenteQuerySchema.parse(consultaValida)).not.toThrow();
    });

    it('deve permitir campos opcionais ausentes', () => {
        expect(() => ComponenteQuerySchema.parse({})).not.toThrow();
    });

    it('deve remover espaços do nome e aceitar', () => {
        const consulta = { ...consultaValida, nome: '   Capacitor   ' };
        const resultado = ComponenteQuerySchema.parse(consulta);
        expect(resultado.nome).toBe('Capacitor');
    });

    it('deve invalidar nome vazio', () => {
        const consulta = { ...consultaValida, nome: '   ' };
        expect(() => ComponenteQuerySchema.parse(consulta)).toThrow('Nome não pode ser vazio');
    });

    it('deve permitir nome indefinido', () => {
        const consulta = { ...consultaValida };
        delete consulta.nome;
        expect(() => ComponenteQuerySchema.parse(consulta)).not.toThrow();
    });

    it('deve transformar quantidade em número', () => {
        const consulta = { ...consultaValida, quantidade: '15' };
        const resultado = ComponenteQuerySchema.parse(consulta);
        expect(resultado.quantidade).toBe(15);
    });

    it('deve invalidar quantidade não numérica', () => {
        const consulta = { ...consultaValida, quantidade: 'dez' };
        expect(() => ComponenteQuerySchema.parse(consulta)).toThrow('Quantidade deve ser um número inteiro');
    });

    it('deve permitir quantidade indefinida', () => {
        const consulta = { ...consultaValida };
        delete consulta.quantidade;
        expect(() => ComponenteQuerySchema.parse(consulta)).not.toThrow();
    });

    it('deve invalidar estoque_minimo diferente de true/false', () => {
        const consulta = { ...consultaValida, estoque_minimo: 'sim' };
        expect(() => ComponenteQuerySchema.parse(consulta)).toThrow("Estoque mínimo deve ser 'true' ou 'false'");
    });

    it('deve permitir estoque_minimo indefinido', () => {
        const consulta = { ...consultaValida };
        delete consulta.estoque_minimo;
        expect(() => ComponenteQuerySchema.parse(consulta)).not.toThrow();
    });

    it('deve remover espaços de localizacao e categoria', () => {
        const consulta = { ...consultaValida, localizacao: '  B2  ', categoria: '  Potência  ' };
        const resultado = ComponenteQuerySchema.parse(consulta);
        expect(resultado.localizacao).toBe('B2');
        expect(resultado.categoria).toBe('Potência');
    });

    it('deve invalidar ativo diferente de true/false', () => {
        const consulta = { ...consultaValida, ativo: 'sim' };
        expect(() => ComponenteQuerySchema.parse(consulta)).toThrow("Ativo deve ser 'true' ou 'false'");
    });

    it('deve permitir ativo indefinido', () => {
        const consulta = { ...consultaValida };
        delete consulta.ativo;
        expect(() => ComponenteQuerySchema.parse(consulta)).not.toThrow();
    });

    it('deve invalidar valor não numérico para page', () => {
        const consulta = { ...consultaValida, page: 'abc' };
        expect(() => ComponenteQuerySchema.parse(consulta)).toThrow('Page deve ser um número inteiro maior que 0');
    });

    it('deve invalidar page menor que 1', () => {
        const consulta = { ...consultaValida, page: '0' };
        expect(() => ComponenteQuerySchema.parse(consulta)).toThrow('Page deve ser um número inteiro maior que 0');
    });

    it('deve definir page como 1 se não fornecido', () => {
        const consulta = { ...consultaValida };
        delete consulta.page;
        const resultado = ComponenteQuerySchema.parse(consulta);
        expect(resultado.page).toBe(1);
    });

    it('deve invalidar limite maior que 100', () => {
        const consulta = { ...consultaValida, limite: '101' };
        expect(() => ComponenteQuerySchema.parse(consulta)).toThrow('Limite deve ser um número inteiro entre 1 e 100');
    });

    it('deve invalidar limite menor que 1', () => {
        const consulta = { ...consultaValida, limite: '0' };
        expect(() => ComponenteQuerySchema.parse(consulta)).toThrow('Limite deve ser um número inteiro entre 1 e 100');
    });

    it('deve definir limite como 10 se não fornecido', () => {
        const consulta = { ...consultaValida };
        delete consulta.limite;
        const resultado = ComponenteQuerySchema.parse(consulta);
        expect(resultado.limite).toBe(10);
    });
});
