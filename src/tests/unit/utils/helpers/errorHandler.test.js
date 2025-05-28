import { jest } from '@jest/globals';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import errorHandler from '../../../../utils/helpers/errorHandler.js';
import CustomError from '../../../../utils/helpers/CustomError.js';
import AuthenticationError from '../../../../utils/errors/AuthenticationError.js';
import TokenExpiredError from '../../../../utils/errors/TokenExpiredError.js';
import CommonResponse from '../../../../utils/helpers/CommonResponse.js';
import logger from '../../../../utils/logger.js';

jest.mock('../../../../utils/helpers/CommonResponse.js');

describe('errorHandler', () => {
    let req;
    let res;
    const next = jest.fn();

    beforeEach(() => {
        req = { path: '/test', requestId: 'test-req-id' };
        res = {};
        CommonResponse.error.mockClear();
    });

    it('should handle ZodError and return 400 validationError', () => {
        const fakeError = new ZodError([{ path: ['field'], message: 'Invalid value' }]);
        process.env.NODE_ENV = 'development';
        errorHandler(fakeError, req, res, next);

        expect(CommonResponse.error).toHaveBeenCalledWith(
            res,
            400,
            'validationError',
            null,
            [{ path: 'field', message: 'Invalid value' }],
            'Erro de validação. 1 campo(s) inválido(s).'
        );
    });

    it('should handle MongoDB duplicate key error and return 409 duplicateEntry', () => {
        const fakeError = { code: 11000, keyValue: { email: 'test@example.com' } };
        errorHandler(fakeError, req, res, next);

        expect(CommonResponse.error).toHaveBeenCalledWith(
            res,
            409,
            'duplicateEntry',
            'email',
            [{ path: 'email', message: 'O valor "test@example.com" já está em uso.' }],
            'Entrada duplicada no campo "email".'
        );
    });

    it('should handle MongoDB duplicate key error without keyValue', () => {
        const fakeError = { code: 11000 };
        errorHandler(fakeError, req, res, next);

        expect(CommonResponse.error).toHaveBeenCalledWith(
            res,
            409,
            'duplicateEntry',
            undefined,
            [{ path: undefined, message: 'O valor "duplicado" já está em uso.' }],
            'Entrada duplicada no campo "undefined".'
        );
    });

    it('should handle Mongoose ValidationError and return 400 validationError', () => {
        const fakeMongooseError = new mongoose.Error.ValidationError();
        fakeMongooseError.errors = {
            name: { path: 'name', message: 'Name is required' },
            age: { path: 'age', message: 'Age must be a number' }
        };

        errorHandler(fakeMongooseError, req, res, next);
        const detalhes = [
            { path: 'name', message: 'Name is required' },
            { path: 'age', message: 'Age must be a number' }
        ];

        expect(CommonResponse.error).toHaveBeenCalledWith(
            res,
            400,
            'validationError',
            null,
            detalhes
        );
    });

    it('should handle AuthenticationError and return its status and message', () => {
        const fakeError = new AuthenticationError('Not authenticated', 401);
        errorHandler(fakeError, req, res, next);

        expect(CommonResponse.error).toHaveBeenCalledWith(
            res,
            fakeError.statusCode,
            'authenticationError',
            null,
            [{ message: fakeError.message }],
            fakeError.message
        );
    });

    it('should handle TokenExpiredError and return its status and message', () => {
        const fakeError = new TokenExpiredError('Token expired', 401);
        errorHandler(fakeError, req, res, next);

        expect(CommonResponse.error).toHaveBeenCalledWith(
            res,
            fakeError.statusCode,
            'authenticationError',
            null,
            [{ message: fakeError.message }],
            fakeError.message
        );
    });

    it("should handle CustomError with errorType 'tokenExpired'", () => {
        const fakeError = new CustomError({
            errorType: 'tokenExpired',
            statusCode: 401,
            customMessage: 'Seu token expirou. Faça login novamente.'
        });
        errorHandler(fakeError, req, res, next);

        expect(CommonResponse.error).toHaveBeenCalledWith(
            res,
            401,
            'tokenExpired',
            null,
            [{ message: 'Seu token expirou. Faça login novamente.' }],
            'Seu token expirou. Faça login novamente.'
        );
    });

    it('should handle CustomError with tokenExpired type but no custom message', () => {
        const fakeError = new CustomError({
            errorType: 'tokenExpired',
            statusCode: 401
        });
        errorHandler(fakeError, req, res, next);

        expect(CommonResponse.error).toHaveBeenCalledWith(
            res,
            401,
            'tokenExpired',
            null,
            [{ message: 'Token expirado.' }],
            'Token expirado. Por favor, faça login novamente.'
        );
    });

    it('should handle CustomError with tokenExpired type but no statusCode', () => {
        const fakeError = new CustomError({
            errorType: 'tokenExpired',
            customMessage: 'Token vencido'
        });
        errorHandler(fakeError, req, res, next);

        expect(CommonResponse.error).toHaveBeenCalledWith(
            res,
            401,
            'tokenExpired',
            null,
            [{ message: 'Token vencido' }],
            'Token vencido'
        );
    });

    it('should handle operational errors with minimal properties', () => {
        const fakeError = new Error('Basic operational error');
        fakeError.isOperational = true;

        errorHandler(fakeError, req, res, next);
        expect(CommonResponse.error).toHaveBeenCalledWith(
            res,
            undefined,
            'operationalError',
            null,
            [],
            'Erro operacional.'
        );
    });

    it('should handle non-operational errors as internal errors', () => {
        const fakeError = new Error('Internal error occurred');
        process.env.NODE_ENV = 'development';
        errorHandler(fakeError, req, res, next);

        const callArgs = CommonResponse.error.mock.calls[0];
        expect(callArgs[0]).toBe(res);
        expect(callArgs[1]).toBe(500);
        expect(callArgs[2]).toBe('serverError');
        expect(callArgs[4][0].message).toBe(fakeError.message);
        expect(callArgs[4][0].stack).toBeDefined();
    });

    it('should handle error as string', () => {
        errorHandler('erro string', req, res, next);
        expect(CommonResponse.error).toHaveBeenCalledWith(
            res,
            500,
            'serverError',
            null,
            [{ message: undefined, stack: undefined }]
        );
    });

    it('should handle error as null', () => {
        expect(() => errorHandler(null, req, res, next)).toThrow(TypeError);
    });

    it('should handle error as empty object', () => {
        errorHandler({}, req, res, next);
        expect(CommonResponse.error).toHaveBeenCalledWith(
            res,
            500,
            'serverError',
            null,
            [{ message: undefined, stack: undefined }]
        );
    });

    it('should handle error as array', () => {
        errorHandler([], req, res, next);
        expect(CommonResponse.error).toHaveBeenCalledWith(
            res,
            500,
            'serverError',
            null,
            [{ message: undefined, stack: undefined }]
        );
    });

    it('should handle error as Symbol', () => {
        errorHandler(Symbol('erro'), req, res, next);
        expect(CommonResponse.error).toHaveBeenCalledWith(
            res,
            500,
            'serverError',
            null,
            [{ message: undefined, stack: undefined }]
        );
    });

    it('should handle error with statusCode but no errorType', () => {
        const err = { statusCode: 418, message: 'I am a teapot' };
        errorHandler(err, req, res, next);
        expect(CommonResponse.error).toHaveBeenCalledWith(
            res,
            500,
            'serverError',
            null,
            [{ message: 'I am a teapot', stack: undefined }]
        );
    });

    it('should handle error with errorType but no statusCode', () => {
        const err = { errorType: 'customType', message: 'Custom error' };
        errorHandler(err, req, res, next);
        expect(CommonResponse.error).toHaveBeenCalledWith(
            res,
            500,
            'serverError',
            null,
            [{ message: 'Custom error', stack: undefined }]
        );
    });

    it('should handle errors in production environment', () => {
        process.env.NODE_ENV = 'production';
        const fakeError = new Error('This error happened in production');
        errorHandler(fakeError, req, res, next);

        const callArgs = CommonResponse.error.mock.calls[0];
        expect(callArgs[0]).toBe(res);
        expect(callArgs[1]).toBe(500);
        expect(callArgs[2]).toBe('serverError');
        expect(callArgs[4][0].message).toMatch(/Erro interno do servidor. Referência: /);
        expect(callArgs[4][0].stack).toBeUndefined();

        process.env.NODE_ENV = 'development';
    });

    it('should include requestId in logging if available', () => {
        const loggerSpy = jest.spyOn(logger, 'error');
        const customReq = { path: '/test', requestId: 'custom-req-id' };
        const fakeError = new Error('Error with custom requestId');

        errorHandler(fakeError, customReq, res, next);

        expect(loggerSpy).toHaveBeenCalledWith(
            expect.stringMatching(/Erro interno \[ID: /),
            expect.objectContaining({
                requestId: 'custom-req-id',
                message: 'Error with custom requestId'
            })
        );

        loggerSpy.mockRestore();
    });

    it('should handle requestId as N/A if not provided', () => {
        const loggerSpy = jest.spyOn(logger, 'error');
        const customReq = { path: '/test' };
        const fakeError = new Error('Error without requestId');

        errorHandler(fakeError, customReq, res, next);

        expect(loggerSpy).toHaveBeenCalledWith(
            expect.stringMatching(/Erro interno \[ID: /),
            expect.objectContaining({
                requestId: 'N/A',
                message: 'Error without requestId'
            })
        );

        loggerSpy.mockRestore();
    });
});