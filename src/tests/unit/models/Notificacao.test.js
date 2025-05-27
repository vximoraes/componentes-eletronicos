import mongoose from 'mongoose';
import Notificacao from '../../../../src/models/Notificacao.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    jest.clearAllMocks();
    await Notificacao.deleteMany({});
});

describe('Modelo de Notificacao', () => {
    it('deve criar uma notificacao com dados válidos', async () => {
        const usuarioId = new mongoose.Types.ObjectId();
        const notificacaoData = {
            mensagem: 'Nova mensagem',
            usuario: usuarioId
        };
        const notificacao = new Notificacao(notificacaoData);
        await notificacao.save();
        const saved = await Notificacao.findById(notificacao._id);
        expect(saved.mensagem).toBe(notificacaoData.mensagem);
        expect(saved.usuario.toString()).toBe(usuarioId.toString());
        expect(saved.data_hora).toBeInstanceOf(Date);
        expect(saved.visualizacao).toBeInstanceOf(Date);
    });

    it('não deve criar notificacao sem campos obrigatórios', async () => {
        const notificacao = new Notificacao({});
        await expect(notificacao.save()).rejects.toThrow();
    });

    it('deve usar data_hora e visualizacao padrão se não fornecidos', async () => {
        const usuarioId = new mongoose.Types.ObjectId();
        const notificacao = new Notificacao({
            mensagem: 'Teste padrão',
            usuario: usuarioId
        });
        await notificacao.save();
        const saved = await Notificacao.findById(notificacao._id);
        expect(saved.data_hora).toBeInstanceOf(Date);
        expect(saved.visualizacao).toBeInstanceOf(Date);
    });

    it('deve permitir buscar notificacoes por usuario', async () => {
        const usuarioId = new mongoose.Types.ObjectId();
        const outraPessoa = new mongoose.Types.ObjectId();
        await Notificacao.create([
            { mensagem: 'Msg 1', usuario: usuarioId },
            { mensagem: 'Msg 2', usuario: usuarioId },
            { mensagem: 'Msg 3', usuario: outraPessoa }
        ]);
        const notificacoes = await Notificacao.find({ usuario: usuarioId });
        expect(notificacoes.length).toBe(2);
        const mensagens = notificacoes.map(n => n.mensagem);
        expect(mensagens).toContain('Msg 1');
        expect(mensagens).toContain('Msg 2');
    });

    it('deve permitir paginar notificacoes', async () => {
        const usuarioId = new mongoose.Types.ObjectId();
        const notificacoesData = Array.from({ length: 15 }, (_, i) => ({
            mensagem: `Notificação ${i + 1}`,
            usuario: usuarioId
        }));
        await Notificacao.insertMany(notificacoesData);
        const result = await Notificacao.paginate({ usuario: usuarioId }, { limit: 10, page: 1 });
        expect(result.docs.length).toBe(10);
        expect(result.totalDocs).toBe(15);
        expect(result.page).toBe(1);
    });

    it('deve atualizar o campo visualizacao', async () => {
        const usuarioId = new mongoose.Types.ObjectId();
        const notificacao = new Notificacao({
            mensagem: 'Atualizar visualizacao',
            usuario: usuarioId
        });
        await notificacao.save();
        const novaData = new Date('2025-05-27T12:00:00Z');
        notificacao.visualizacao = novaData;
        await notificacao.save();
        const updated = await Notificacao.findById(notificacao._id);
        expect(updated.visualizacao.toISOString()).toBe(novaData.toISOString());
    });

    it('deve buscar notificacoes não visualizadas (visualizacao igual ao default)', async () => {
        const usuarioId = new mongoose.Types.ObjectId();
        const n1 = new Notificacao({ mensagem: 'Não lida', usuario: usuarioId });
        const n2 = new Notificacao({ mensagem: 'Lida', usuario: usuarioId, visualizacao: new Date('2025-05-27T12:00:00Z') });
        await n1.save();
        await n2.save();
        const notificacoes = await Notificacao.find({ usuario: usuarioId, mensagem: 'Não lida' });
        expect(notificacoes.length).toBe(1);
        expect(notificacoes[0].mensagem).toBe('Não lida');
    });

    it('deve remover uma notificacao', async () => {
        const usuarioId = new mongoose.Types.ObjectId();
        const notificacao = new Notificacao({ mensagem: 'Remover', usuario: usuarioId });
        await notificacao.save();
        await Notificacao.deleteOne({ _id: notificacao._id });
        const found = await Notificacao.findById(notificacao._id);
        expect(found).toBeNull();
    });

    it('não deve criar notificacao com tipos errados', async () => {
        const usuarioId = new mongoose.Types.ObjectId();
        const notificacao = new Notificacao({ mensagem: 12345, usuario: usuarioId }); 
        await notificacao.save();
        const saved = await Notificacao.findById(notificacao._id);
        expect(typeof saved.mensagem).toBe('string');
        expect(saved.mensagem).toBe('12345'); 
    });

    it('não deve criar notificacao com usuario inválido', async () => {
        const notificacao = new Notificacao({ mensagem: 'Usuário inválido', usuario: 'id_invalido' });
        await expect(notificacao.save()).rejects.toThrow();
    });
});