import { NotificacaoQuerySchema, NotificacaoIdSchema } from '../../../../../../../utils/validators/schemas/zod/querys/NotificacaoQuerySchema.js';
import mongoose from 'mongoose';

describe('NotificacaoQuerySchema', () => {
    it('valida um objeto válido com todos os campos', () => {
        const data = {
            usuario: new mongoose.Types.ObjectId().toString(),
            visualizada: 'true',
            dataInicial: new Date(),
            dataFinal: new Date()
        };
        const parsed = NotificacaoQuerySchema.parse(data);
        expect(parsed.usuario).toBe(data.usuario);
        expect(parsed.visualizada).toBe('true');
        expect(parsed.dataInicial).toBeInstanceOf(Date);
        expect(parsed.dataFinal).toBeInstanceOf(Date);
    });

    it('valida sem campos opcionais', () => {
        const data = {};
        const parsed = NotificacaoQuerySchema.parse(data);
        expect(parsed).toEqual({});
    });

    it('aceita visualizada como false', () => {
        const data = { visualizada: 'false' };
        const parsed = NotificacaoQuerySchema.parse(data);
        expect(parsed.visualizada).toBe('false');
    });

    it('aceita usuario vazio', () => {
        const data = { usuario: '' };
        const parsed = NotificacaoQuerySchema.parse(data);
        expect(parsed.usuario).toBe('');
    });

    it('falha se usuario for id inválido', () => {
        const data = { usuario: 'id_invalido' };
        expect(() => NotificacaoQuerySchema.parse(data)).toThrow(/ID de usuário inválido/);
    });

    it('falha se visualizada for valor inválido', () => {
        const data = { visualizada: 'sim' };
        expect(() => NotificacaoQuerySchema.parse(data)).toThrow(/Lida deve ser 'true' ou 'false'/);
    });

    it('falha se dataInicial não for data', () => {
        const data = { dataInicial: 'not-a-date' };
        expect(() => NotificacaoQuerySchema.parse(data)).toThrow();
    });

    it('falha se dataFinal não for data', () => {
        const data = { dataFinal: 'not-a-date' };
        expect(() => NotificacaoQuerySchema.parse(data)).toThrow();
    });
});

describe('NotificacaoIdSchema', () => {
    it('valida um id válido', () => {
        const id = new mongoose.Types.ObjectId().toString();
        expect(NotificacaoIdSchema.parse(id)).toBe(id);
    });

    it('falha para id inválido', () => {
        expect(() => NotificacaoIdSchema.parse('id_invalido')).toThrow(/ID inválido/);
    });
});