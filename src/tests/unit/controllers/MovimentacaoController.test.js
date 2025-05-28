import MovimentacaoController from '../../../controllers/MovimentacaoController.js';
import MovimentacaoService from '../../../services/MovimentacaoService.js';
import { MovimentacaoQuerySchema, MovimentacaoIdSchema } from '../../../utils/validators/schemas/zod/querys/MovimentacaoQuerySchema.js';
import { MovimentacaoSchema, MovimentacaoUpdateSchema } from '../../../utils/validators/schemas/zod/MovimentacaoSchema.js';
import { CommonResponse, CustomError, HttpStatusCodes } from '../../../utils/helpers/index.js';

jest.mock('../../../utils/validators/schemas/zod/querys/MovimentacaoQuerySchema.js');
jest.mock('../../../utils/validators/schemas/zod/MovimentacaoSchema.js');

jest.mock('../../../services/MovimentacaoService.js');

describe('MovimentacaoController', () => {
    let controller;
    let mockReq;
    let mockRes;
    let mockService;

    beforeEach(() => {
        jest.clearAllMocks();

        mockService = {
            criar: jest.fn(),
            listar: jest.fn()
        };
        MovimentacaoService.mockImplementation(() => mockService);

        MovimentacaoSchema.parse = jest.fn().mockImplementation(data => data);
        MovimentacaoQuerySchema.parseAsync = jest.fn().mockResolvedValue({});
        MovimentacaoIdSchema.parse = jest.fn().mockImplementation(id => id);

        mockReq = {
            body: {},
            params: {},
            query: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.spyOn(CommonResponse, 'success');
        jest.spyOn(CommonResponse, 'created');

        controller = new MovimentacaoController();
    });

    describe('método criar', () => {
        it('deve criar uma movimentação com dados válidos', async () => {
            const movimentacaoData = {
                componente: '64f234a0c781a7b30c2fe445',
                tipo: 'entrada',
                quantidade: 10,
                data: new Date(),
                fornecedor: '64f234a0c781a7b30c2fe446'
            };
            mockReq.body = movimentacaoData;

            const movimentacaoResult = {
                _id: '64f234a0c781a7b30c2fe447',
                ...movimentacaoData,
                toObject: jest.fn().mockReturnValue({
                    _id: '64f234a0c781a7b30c2fe447',
                    ...movimentacaoData
                })
            };

            mockService.criar.mockResolvedValue(movimentacaoResult);

            await controller.criar(mockReq, mockRes);

            expect(MovimentacaoSchema.parse).toHaveBeenCalledWith(movimentacaoData);
            expect(mockService.criar).toHaveBeenCalledWith(movimentacaoData);
            expect(CommonResponse.created).toHaveBeenCalledWith(mockRes, expect.objectContaining({
                _id: '64f234a0c781a7b30c2fe447'
            }));
        });

        it('deve lançar erro se os dados da movimentação forem inválidos', async () => {
            const movimentacaoData = {
                tipo: 'entrada'
            };
            mockReq.body = movimentacaoData;

            const validationError = new Error('Validation error');
            MovimentacaoSchema.parse.mockImplementation(() => {
                throw validationError;
            });

            await expect(controller.criar(mockReq, mockRes)).rejects.toThrow();
        }); it('deve lançar erro se o serviço falhar', async () => {
            const movimentacaoData = {
                componente: '64f234a0c781a7b30c2fe445',
                tipo: 'entrada',
                quantidade: 10,
                data: new Date(),
                fornecedor: '64f234a0c781a7b30c2fe446'
            };
            mockReq.body = movimentacaoData; const serviceError = new CustomError('Erro no serviço', HttpStatusCodes.INTERNAL_SERVER_ERROR);
            mockService.criar.mockRejectedValue(serviceError);

            await expect(controller.criar(mockReq, mockRes)).rejects.toThrow(serviceError);
        });
    });

    describe('método listar', () => {
        it('deve listar todas as movimentações quando não há parâmetros', async () => {
            const movimentacoes = [
                {
                    _id: '64f234a0c781a7b30c2fe447',
                    componente: '64f234a0c781a7b30c2fe445',
                    tipo: 'entrada',
                    quantidade: 10,
                    data: new Date(),
                    fornecedor: '64f234a0c781a7b30c2fe446'
                },
                {
                    _id: '64f234a0c781a7b30c2fe448',
                    componente: '64f234a0c781a7b30c2fe445',
                    tipo: 'saida',
                    quantidade: 5,
                    data: new Date()
                }
            ]; mockService.listar.mockResolvedValue(movimentacoes);

            await controller.listar(mockReq, mockRes);

            expect(mockService.listar).toHaveBeenCalledWith(mockReq);
            expect(CommonResponse.success).toHaveBeenCalledWith(mockRes, movimentacoes);
        }); it('deve validar o ID quando fornecido nos parâmetros', async () => {
            const movimentacaoId = '64f234a0c781a7b30c2fe447';
            mockReq.params = { id: movimentacaoId };

            const movimentacao = {
                _id: movimentacaoId,
                componente: '64f234a0c781a7b30c2fe445',
                tipo: 'entrada',
                quantidade: 10,
                data: new Date(),
                fornecedor: '64f234a0c781a7b30c2fe446'
            }; mockService.listar.mockResolvedValue(movimentacao);

            await controller.listar(mockReq, mockRes);

            expect(MovimentacaoIdSchema.parse).toHaveBeenCalledWith(movimentacaoId);
            expect(mockService.listar).toHaveBeenCalledWith(mockReq);
            expect(CommonResponse.success).toHaveBeenCalledWith(mockRes, movimentacao);
        }); it('deve validar os query params quando fornecidos', async () => {
            const queryParams = {
                tipo: 'entrada',
                componente: '64f234a0c781a7b30c2fe445'
            };
            mockReq.query = queryParams;

            const movimentacoes = [
                {
                    _id: '64f234a0c781a7b30c2fe447',
                    componente: '64f234a0c781a7b30c2fe445',
                    tipo: 'entrada',
                    quantidade: 10,
                    data: new Date(),
                    fornecedor: '64f234a0c781a7b30c2fe446'
                }
            ]; mockService.listar.mockResolvedValue(movimentacoes);

            await controller.listar(mockReq, mockRes);

            expect(MovimentacaoQuerySchema.parseAsync).toHaveBeenCalledWith(queryParams);
            expect(mockService.listar).toHaveBeenCalledWith(mockReq);
            expect(CommonResponse.success).toHaveBeenCalledWith(mockRes, movimentacoes);
        }); it('deve lançar erro se a validação de ID falhar', async () => {
            const invalidId = 'invalid-id';
            mockReq.params = { id: invalidId }; const validationError = new Error('ID inválido');
            MovimentacaoIdSchema.parse.mockImplementation(() => {
                throw validationError;
            });

            await expect(controller.listar(mockReq, mockRes)).rejects.toThrow(validationError);
        }); it('deve lançar erro se a validação de query params falhar', async () => {
            const invalidQuery = {
                tipo: 'tipo_invalido'
            };
            mockReq.query = invalidQuery; const validationError = new Error('Query inválida');
            MovimentacaoQuerySchema.parseAsync.mockRejectedValue(validationError);

            await expect(controller.listar(mockReq, mockRes)).rejects.toThrow(validationError);
        }); it('deve lançar erro se o serviço falhar', async () => {
            const serviceError = new CustomError('Erro no serviço', HttpStatusCodes.INTERNAL_SERVER_ERROR);
            mockService.listar.mockRejectedValue(serviceError);

            await expect(controller.listar(mockReq, mockRes)).rejects.toThrow(serviceError);
        });
    });
});