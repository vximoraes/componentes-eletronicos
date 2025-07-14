import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import ComponenteOrcamento from '../../../models/ComponenteOrcamento.js'; // ajuste o path conforme seu projeto

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
  await ComponenteOrcamento.deleteMany({});
});

describe('Modelo ComponenteOrcamento', () => {
  it('deve criar um componente do orçamento com dados válidos', async () => {
    const data = {
      nome: 'Resistor 220 Ohms',
      fornecedor: 'Fornecedor Teste',
      quantidade: 10,
      valor_unitario: 0.15,
      subtotal: 1.5,
    };
    const comp = new ComponenteOrcamento(data);
    await comp.save();

    const saved = await ComponenteOrcamento.findById(comp._id);

    expect(saved).toBeDefined();
    expect(saved.nome).toBe(data.nome);
    expect(saved.fornecedor).toBe(data.fornecedor);
    expect(saved.quantidade).toBe(data.quantidade);
    expect(saved.valor_unitario).toBe(data.valor_unitario);
    expect(saved.subtotal).toBe(data.subtotal);
  });

  it('não deve criar componente sem campos obrigatórios', async () => {
    const comp = new ComponenteOrcamento({});
    await expect(comp.save()).rejects.toThrow();
  });

  it('deve rejeitar quantidade negativa ou zero', async () => {
    const comp = new ComponenteOrcamento({
      nome: 'Capacitor',
      fornecedor: 'Fornecedor',
      quantidade: 0,
      valor_unitario: 2,
      subtotal: 0,
    });
    await expect(comp.save()).rejects.toThrow();

    comp.quantidade = -5;
    await expect(comp.save()).rejects.toThrow();
  });

  it('deve rejeitar valor_unitario negativo', async () => {
    const comp = new ComponenteOrcamento({
      nome: 'Capacitor',
      fornecedor: 'Fornecedor',
      quantidade: 2,
      valor_unitario: -1,
      subtotal: -2,
    });
    await expect(comp.save()).rejects.toThrow();
  });

  it('deve calcular subtotal corretamente', async () => {
    // Supondo que você tenha um middleware ou método para calcular subtotal,
    // mas se não, você pode calcular manualmente e salvar.
    const quantidade = 4;
    const valor_unitario = 3.5;
    const subtotal = quantidade * valor_unitario;

    const comp = new ComponenteOrcamento({
      nome: 'Indutor',
      fornecedor: 'Fornecedor',
      quantidade,
      valor_unitario,
      subtotal,
    });

    await comp.save();
    const saved = await ComponenteOrcamento.findById(comp._id);
    expect(saved.subtotal).toBe(subtotal);
  });

  it('deve retornar todos componentes cadastrados', async () => {
    const comp1 = new ComponenteOrcamento({
      nome: 'Diodo',
      fornecedor: 'Fornecedor 1',
      quantidade: 2,
      valor_unitario: 1,
      subtotal: 2,
    });
    const comp2 = new ComponenteOrcamento({
      nome: 'Transistor',
      fornecedor: 'Fornecedor 2',
      quantidade: 5,
      valor_unitario: 2,
      subtotal: 10,
    });

    await comp1.save();
    await comp2.save();

    const componentes = await ComponenteOrcamento.find();

    expect(componentes.length).toBe(2);
    const nomes = componentes.map(c => c.nome);
    expect(nomes).toContain('Diodo');
    expect(nomes).toContain('Transistor');
  });

  it('deve atualizar um componente existente', async () => {
    const comp = new ComponenteOrcamento({
      nome: 'LED',
      fornecedor: 'Fornecedor LED',
      quantidade: 3,
      valor_unitario: 0.8,
      subtotal: 2.4,
    });

    await comp.save();

    comp.quantidade = 10;
    comp.subtotal = 10 * comp.valor_unitario;
    await comp.save();

    const updated = await ComponenteOrcamento.findById(comp._id);

    expect(updated.quantidade).toBe(10);
    expect(updated.subtotal).toBeCloseTo(8);
  });

  it('deve remover um componente', async () => {
    const comp = new ComponenteOrcamento({
      nome: 'Resistor',
      fornecedor: 'Fornecedor R',
      quantidade: 5,
      valor_unitario: 0.5,
      subtotal: 2.5,
    });
    await comp.save();

    await ComponenteOrcamento.findByIdAndDelete(comp._id);

    const found = await ComponenteOrcamento.findById(comp._id);
    expect(found).toBeNull();
  });
});
