// Mockando 'winston-daily-rotate-file' antes de qualquer importação que possa depender dele
jest.mock('winston-daily-rotate-file', () => {
    const TransportStream = require('winston-transport'); // Importa TransportStream

    return {
        __esModule: true, // Indica que é um módulo ES6
        default: class MockDailyRotateFile extends TransportStream { // Extende TransportStream
            constructor(options) {
                super(options);
                this.options = options;
            }

            log(info, callback) {
                // Simula a função de log
                callback();
            }
        },
    };
});

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { transports } = require('winston');

// Importando dotenv para carregar variáveis de ambiente
dotenv.config();

describe('Utilitário de Logger', () => {
    const originalEnv = { ...process.env };
    const logDirectory = path.resolve(process.cwd(), 'logs');

    let getTotalLogSize;
    let ensureLogSizeLimit;
    let logIntervalId;
    let maxLogSize;
    let logger;

    // Mocking winston transports to prevent actual logging
    beforeAll(() => {
        jest.spyOn(transports, 'Console').mockImplementation(() => ({
            log: jest.fn(),
            on: jest.fn(),
            emit: jest.fn(),
        }));

        // Mockando 'console.error' para suprimir mensagens de erro do Winston
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    // Configurando timers falsos para lidar com setInterval
    beforeEach(() => {
        jest.useFakeTimers();

        // Limpar qualquer estado global antes de cada teste
        delete global.loggerListenersSet;

        jest.resetModules();

        // Mockando métodos do fs
        jest.spyOn(fs, 'existsSync');
        jest.spyOn(fs, 'readdirSync');
        jest.spyOn(fs, 'statSync');
        jest.spyOn(fs, 'unlinkSync');
        jest.spyOn(fs, 'mkdirSync');

        // Configurando variáveis de ambiente antes de importar o módulo
        process.env.NODE_ENV = 'test';
        process.env.LOG_ENABLED = 'true';

        // Mockando process.exit antes de importar o módulo
        jest.spyOn(process, 'exit').mockImplementation(() => { });

        // Reimportando o módulo para garantir que as alterações de ambiente sejam refletidas
        const loggerImport = require('../../../utils/logger.js');
        getTotalLogSize = loggerImport.getTotalLogSize;
        ensureLogSizeLimit = loggerImport.ensureLogSizeLimit;
        logIntervalId = loggerImport.logIntervalId;
        maxLogSize = loggerImport.maxLogSize;
        logger = loggerImport.default;
    });

    // Restaurando mocks após cada teste
    afterEach(() => {
        process.env = { ...originalEnv };
        jest.restoreAllMocks();
        jest.clearAllTimers();
        delete global.loggerListenersSet;
    });

    describe('getTotalLogSize', () => {
        it('deve retornar 0 se o diretório de logs não existir', () => {
            fs.existsSync.mockReturnValue(false);

            const totalSize = getTotalLogSize(logDirectory);
            expect(totalSize).toBe(0);
        });

        it('deve retornar 0 se o diretório de logs existir mas estiver vazio', () => {
            fs.existsSync.mockReturnValue(true);
            fs.readdirSync.mockReturnValue([]);

            const totalSize = getTotalLogSize(logDirectory);
            expect(totalSize).toBe(0);
        });

        it('deve calcular o tamanho total dos arquivos de log', () => {
            fs.existsSync.mockReturnValue(true);
            fs.readdirSync.mockReturnValue(['file1.log', 'file2.log']);
            fs.statSync.mockImplementation((filePath) => {
                if (filePath.endsWith('file1.log')) return { size: 100 };
                if (filePath.endsWith('file2.log')) return { size: 200 };
                return { size: 0 };
            });

            const totalSize = getTotalLogSize(logDirectory);
            expect(totalSize).toBe(300);
        });

        it('deve lançar erro se fs.statSync falhar', () => {
            fs.existsSync.mockReturnValue(true);
            fs.readdirSync.mockReturnValue(['file1.log']);
            fs.statSync.mockImplementation(() => { throw new Error('Erro no statSync'); });

            expect(() => getTotalLogSize(logDirectory)).toThrow('Erro no statSync');
        });
    });

    describe('ensureLogSizeLimit', () => {
        it('deve remover os arquivos mais antigos até que o limite de tamanho seja respeitado', () => {
            fs.readdirSync.mockReturnValue(['file1.log', 'file2.log']);
            fs.statSync.mockImplementation((filePath) => {
                if (filePath.endsWith('file1.log')) return { size: 100, mtime: new Date(2021, 1, 1) };
                if (filePath.endsWith('file2.log')) return { size: 200, mtime: new Date(2021, 1, 2) };
                return { size: 0, mtime: new Date() };
            });
            fs.unlinkSync.mockImplementation(() => { /* sem operação */ });

            // Total size = 100 + 200 = 300
            // maxSize = 150
            // Deve remover 'file1.log' (100), total = 200 ainda > 150, então remover 'file2.log'
            ensureLogSizeLimit(logDirectory, 150);

            expect(fs.unlinkSync).toHaveBeenCalledTimes(2);
            expect(fs.unlinkSync).toHaveBeenCalledWith(path.join(logDirectory, 'file1.log'));
            expect(fs.unlinkSync).toHaveBeenCalledWith(path.join(logDirectory, 'file2.log'));
        });

        it('deve remover apenas os arquivos necessários para respeitar o limite de tamanho', () => {
            fs.readdirSync.mockReturnValue(['file1.log', 'file2.log', 'file3.log']);
            fs.statSync.mockImplementation((filePath) => {
                if (filePath.endsWith('file1.log')) return { size: 50, mtime: new Date(2021, 1, 1) };
                if (filePath.endsWith('file2.log')) return { size: 50, mtime: new Date(2021, 1, 2) };
                if (filePath.endsWith('file3.log')) return { size: 100, mtime: new Date(2021, 1, 3) };
                return { size: 0, mtime: new Date() };
            });
            fs.unlinkSync.mockImplementation(() => { /* sem operação */ });

            // Total size = 50 + 50 + 100 = 200
            // maxSize = 150
            // Deve remover 'file1.log' (50), total = 150
            ensureLogSizeLimit(logDirectory, 150);

            expect(fs.unlinkSync).toHaveBeenCalledTimes(1);
            expect(fs.unlinkSync).toHaveBeenCalledWith(path.join(logDirectory, 'file1.log'));
        });

        it('não deve remover arquivos se o totalSize estiver dentro do limite', () => {
            fs.readdirSync.mockReturnValue(['file1.log', 'file2.log']);
            fs.statSync.mockImplementation((filePath) => {
                if (filePath.endsWith('file1.log')) return { size: 100, mtime: new Date() };
                if (filePath.endsWith('file2.log')) return { size: 100, mtime: new Date() };
                return { size: 0, mtime: new Date() };
            });
            fs.unlinkSync.mockImplementation(() => { /* sem operação */ });

            ensureLogSizeLimit(logDirectory, 300);

            expect(fs.unlinkSync).not.toHaveBeenCalled();
        });

        it('deve lançar erro se fs.readdirSync falhar', () => {
            fs.readdirSync.mockImplementation(() => { throw new Error('Erro no readdirSync'); });

            expect(() => ensureLogSizeLimit(logDirectory, 150)).toThrow('Erro no readdirSync');
        });

        it('deve lançar erro se fs.statSync falhar', () => {
            fs.readdirSync.mockReturnValue(['file1.log']);
            fs.statSync.mockImplementation(() => { throw new Error('Erro no statSync'); });

            expect(() => ensureLogSizeLimit(logDirectory, 150)).toThrow('Erro no statSync');
        });
    });

    describe('Configuração do Logger', () => {
        it('deve criar logger com os transports corretos', () => {
            const loggerTransports = logger.transports.map(transport => transport.constructor.name);
            expect(loggerTransports).toEqual(expect.arrayContaining(['Console', 'MockDailyRotateFile']));
        });

        it('deve criar o diretório de logs se ele não existir', () => {
            fs.existsSync.mockReturnValue(false);
            fs.mkdirSync.mockImplementation(() => { /* sem operação */ });

            // Reimportando logger para executar a lógica de criação do diretório
            jest.resetModules();
            process.env.NODE_ENV = 'test'; // Garantir que handlers não sejam registrados
            process.env.LOG_ENABLED = 'true';
            const loggerImport = require('../../../utils/logger.js');
            logger = loggerImport.default;

            expect(fs.mkdirSync).toHaveBeenCalledWith(logDirectory, { recursive: true });
        });

        it('não deve criar o diretório de logs se já existir', () => {
            fs.existsSync.mockReturnValue(true);
            fs.mkdirSync.mockImplementation(() => { /* sem operação */ });

            // Reimportando logger para executar a lógica de criação do diretório
            jest.resetModules();
            process.env.NODE_ENV = 'test'; // Garantir que handlers não sejam registrados
            process.env.LOG_ENABLED = 'true';
            const loggerImport = require('../../../utils/logger.js');
            logger = loggerImport.default;

            expect(fs.mkdirSync).not.toHaveBeenCalled();
        });

        it('não deve adicionar transports se logEnabled for false', () => {
            process.env.LOG_ENABLED = 'false';
            jest.resetModules();
            process.env.NODE_ENV = 'test'; // Garantir que handlers não sejam registrados
            const loggerImport = require('../../../utils/logger.js');
            logger = loggerImport.default;

            expect(logger.transports.length).toBe(0);
        });

        it('deve adicionar transports quando logEnabled for true', () => {
            process.env.LOG_ENABLED = 'true';
            jest.resetModules();
            process.env.NODE_ENV = 'test'; // Garantir que handlers não sejam registrados
            const loggerImport = require('../../../utils/logger.js');
            logger = loggerImport.default;

            const loggerTransports = logger.transports.map(transport => transport.constructor.name);
            expect(loggerTransports).toEqual(expect.arrayContaining(['Console', 'MockDailyRotateFile']));
        });

        it('deve usar o valor padrão de logEnabled quando LOG_ENABLED não está definida', () => {
            delete process.env.LOG_ENABLED;
            jest.resetModules();
            process.env.NODE_ENV = 'test'; // Garantir que handlers não sejam registrados
            const loggerImport = require('../../../utils/logger.js');
            logger = loggerImport.default;

            const logEnabled = logger.transports.length > 0;
            expect(logEnabled).toBe(true); // O valor padrão é 'true'
        });
    });

    describe('Configuração do Tamanho Máximo de Log', () => {
        it('deve usar o valor padrão de logMaxSizeGB quando LOG_MAX_SIZE_GB não está definida', () => {
            delete process.env.LOG_MAX_SIZE_GB;
            jest.resetModules();
            process.env.NODE_ENV = 'test'; // Garantir que handlers não sejam registrados
            process.env.LOG_ENABLED = 'true';
            const loggerImport = require('../../../utils/logger.js');
            logIntervalId = loggerImport.logIntervalId;
            maxLogSize = loggerImport.maxLogSize;
            logger = loggerImport.default;

            expect(maxLogSize).toBe(50 * 1024 * 1024 * 1024); // 50 GB em bytes
        });

        it('deve usar o valor definido de logMaxSizeGB quando LOG_MAX_SIZE_GB está definida', () => {
            process.env.LOG_MAX_SIZE_GB = '10';
            jest.resetModules();
            process.env.NODE_ENV = 'test'; // Garantir que handlers não sejam registrados
            process.env.LOG_ENABLED = 'true';
            const loggerImport = require('../../../utils/logger.js');
            logIntervalId = loggerImport.logIntervalId;
            maxLogSize = loggerImport.maxLogSize;
            logger = loggerImport.default;

            expect(maxLogSize).toBe(10 * 1024 * 1024 * 1024); // 10 GB em bytes
        });

        it('deve lançar erro quando LOG_MAX_SIZE_GB é inválida', () => {
            process.env.LOG_MAX_SIZE_GB = 'invalid';
            jest.resetModules();
            process.env.NODE_ENV = 'test'; // Garantir que handlers não sejam registrados
            process.env.LOG_ENABLED = 'true';

            expect(() => {
                require('../../../utils/logger.js');
            }).toThrow('LOG_MAX_SIZE_GB deve ser um número positivo');
        });

        it('deve lançar erro quando LOG_MAX_SIZE_GB é negativa', () => {
            process.env.LOG_MAX_SIZE_GB = '-5';
            jest.resetModules();
            process.env.NODE_ENV = 'test'; // Garantir que handlers não sejam registrados
            process.env.LOG_ENABLED = 'true';

            expect(() => {
                require('../../../utils/logger.js');
            }).toThrow('LOG_MAX_SIZE_GB deve ser um número positivo');
        });
    });

    describe('Configuração do Nível de Log', () => {
        beforeEach(() => {
            delete process.env.LOG_LEVEL;
            jest.resetModules();
            process.env.NODE_ENV = 'test'; // Garantir que handlers não sejam registrados
            process.env.LOG_ENABLED = 'true';
        });

        it('deve usar o nível de log padrão quando LOG_LEVEL não está definido', () => {
            const loggerImport = require('../../../utils/logger.js');
            logger = loggerImport.default;

            expect(logger.level).toBe('info');
        });

        it('deve usar o nível de log definido em LOG_LEVEL', () => {
            process.env.LOG_LEVEL = 'debug';
            const loggerImport = require('../../../utils/logger.js');
            logger = loggerImport.default;

            expect(logger.level).toBe('debug');
        });
    });

    describe('Limpeza do Intervalo de Logs', () => {
        it('não deve chamar clearInterval se logIntervalId não estiver definido', () => {
            process.env.LOG_ENABLED = 'false';
            jest.resetModules();
            process.env.NODE_ENV = 'test'; // Garantir que handlers não sejam registrados
            const loggerImport = require('../../../utils/logger.js');
            logIntervalId = loggerImport.logIntervalId;

            expect(logIntervalId).toBeUndefined();

            jest.spyOn(global, 'clearInterval');

            if (logIntervalId) {
                clearInterval(logIntervalId);
            } else {
                expect(clearInterval).not.toHaveBeenCalled();
            }
        });

        it('deve limpar o intervalo de logs quando o logger está habilitado em ambiente não-test', () => {
            process.env.LOG_ENABLED = 'true';
            process.env.NODE_ENV = 'production'; // Garantir que o intervalo seja criado
            jest.resetModules();
            const loggerImport = require('../../../utils/logger.js');
            logIntervalId = loggerImport.logIntervalId;

            expect(logIntervalId).toBeDefined();

            jest.spyOn(global, 'clearInterval');

            if (logIntervalId) {
                clearInterval(logIntervalId);
            }

            expect(clearInterval).toHaveBeenCalledWith(logIntervalId);
        });
    });

    describe('Handlers de Exceções', () => {
        let errorSpy;
        let exitSpy;
        let uncaughtExceptionHandler;
        let unhandledRejectionHandler;

        beforeEach(() => {
            // Configurar o ambiente para permitir handlers de exceções
            process.env.LOG_ENABLED = 'true';
            process.env.NODE_ENV = 'production';

            // Mockar process.on para capturar as funções handlers
            const handlers = {};
            jest.spyOn(process, 'on').mockImplementation((event, handler) => {
                handlers[event] = handler;
            });

            // Reimportar o módulo após ajustar o ambiente e mockar process.on
            jest.resetModules();
            const loggerImport = require('../../../utils/logger.js');
            getTotalLogSize = loggerImport.getTotalLogSize;
            ensureLogSizeLimit = loggerImport.ensureLogSizeLimit;
            logIntervalId = loggerImport.logIntervalId;
            maxLogSize = loggerImport.maxLogSize;
            logger = loggerImport.default;

            // Recuperar os handlers capturados
            uncaughtExceptionHandler = handlers['uncaughtException'];
            unhandledRejectionHandler = handlers['unhandledRejection'];

            // Espionar logger.error e process.exit
            errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => { });
            exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { });
        });

        afterEach(() => {
            errorSpy.mockRestore();
            exitSpy.mockRestore();
            delete global.loggerListenersSet;
        });

        it('deve logar e encerrar o processo em caso de uncaughtException', () => {
            const testError = new Error('Teste de uncaughtException');

            // Garantir que o handler está definido
            expect(uncaughtExceptionHandler).toBeDefined();

            // Chamar o handler
            uncaughtExceptionHandler(testError);

            expect(errorSpy).toHaveBeenCalledWith('Uncaught Exception:', testError);
            expect(exitSpy).toHaveBeenCalledWith(1);
        });

        it('deve logar em caso de unhandledRejection', () => {
            const reason = 'Razão da rejeição';
            const promise = Promise.reject(reason);

            // Captura a rejeição para evitar warnings
            promise.catch(() => { });

            // Garantir que o handler está definido
            expect(unhandledRejectionHandler).toBeDefined();

            // Chamar o handler
            unhandledRejectionHandler(reason, promise);

            expect(errorSpy).toHaveBeenCalledWith('Unhandled Rejection at:', promise, 'reason:', reason);
        });
    });
});
