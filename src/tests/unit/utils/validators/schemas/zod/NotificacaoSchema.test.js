import { NotificacaoSchema } from '../../../../../../utils/validators/schemas/zod/NotificacaoSchema.js';
import mongoose from 'mongoose';

describe('NotificacaoSchema', () => {
    it('valida um objeto válido', () => {
        const data = {
            mensagem: 'Mensagem válida',
            usuario: new mongoose.Types.ObjectId().toString(),
            visualizada: false,
            dataLeitura: new Date(),
            dataExpiracao: new Date()
        };
        const parsed = NotificacaoSchema.parse(data);
        expect(parsed.mensagem).toBe(data.mensagem);
        expect(parsed.usuario).toBe(data.usuario);
        expect(parsed.visualizada).toBe(false);
        expect(parsed.dataLeitura).toBeInstanceOf(Date);
        expect(parsed.dataExpiracao).toBeInstanceOf(Date);
    });

    it('define visualizada como false por padrão', () => {
        const data = {
            mensagem: 'Mensagem padrão',
            usuario: new mongoose.Types.ObjectId().toString(),
        };
        const parsed = NotificacaoSchema.parse(data);
        expect(parsed.visualizada).toBe(false);
    });

    it('aceita dataLeitura como string ISO', () => {
        const data = {
            mensagem: 'Mensagem',
            usuario: new mongoose.Types.ObjectId().toString(),
            dataLeitura: new Date().toISOString()
        };
        const parsed = NotificacaoSchema.parse(data);
        expect(parsed.dataLeitura).toBeInstanceOf(Date);
    });

    it('falha se mensagem for vazia', () => {
        const data = {
            mensagem: '',
            usuario: new mongoose.Types.ObjectId().toString(),
        };
        expect(() => NotificacaoSchema.parse(data)).toThrow();
    });

    it('falha se mensagem for muito longa', () => {
        const data = {
            mensagem: 'a'.repeat(501),
            usuario: new mongoose.Types.ObjectId().toString(),
        };
        expect(() => NotificacaoSchema.parse(data)).toThrow();
    });

    it('falha se usuario for um id inválido', () => {
        const data = {
            mensagem: 'Mensagem',
            usuario: 'id_invalido',
        };
        expect(() => NotificacaoSchema.parse(data)).toThrow(/ID de usuário inválido/);
    });

    it('aceita usuario vazio', () => {
        const data = {
            mensagem: 'Mensagem',
            usuario: '',
        };
        const parsed = NotificacaoSchema.parse(data);
        expect(parsed.usuario).toBe('');
    });

    it('falha se visualizada não for boolean', () => {
        const data = {
            mensagem: 'Mensagem',
            usuario: new mongoose.Types.ObjectId().toString(),
            visualizada: 'sim',
        };
        expect(() => NotificacaoSchema.parse(data)).toThrow();
    });

    it('aceita dataLeitura e dataExpiracao ausentes', () => {
        const data = {
            mensagem: 'Mensagem',
            usuario: new mongoose.Types.ObjectId().toString(),
        };
        const parsed = NotificacaoSchema.parse(data);
        expect(parsed.dataLeitura).toBeUndefined();
        expect(parsed.dataExpiracao).toBeUndefined();
    });

    it('falha se dataExpiracao não for data', () => {
        const data = {
            mensagem: 'Mensagem',
            usuario: new mongoose.Types.ObjectId().toString(),
            dataExpiracao: 'not-a-date',
        };
        expect(() => NotificacaoSchema.parse(data)).toThrow();
    });
});