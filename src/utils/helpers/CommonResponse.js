import StatusService from './StatusService.js';

class CommonResponse {
    constructor(error = false, code = 200, message = '', data = null, errors = []) {
        this.error = error;
        this.code = code;
        this.message = message;
        this.data = data;
        this.errors = errors;
    }

    toJSON() {
        return {
            error: this.error,
            code: this.code,
            message: this.message,
            data: this.data,
            errors: this.errors
        };
    }

    static success(res, data, code = 200, message = null) {
        const statusMessage = message || StatusService.getHttpCodeMessage(code);
        const response = new CommonResponse(false, code, statusMessage, data, []);
        return res.status(code).json(response.toJSON());
    }

    static error(res, code, errorType, field = null, errors = [], customMessage = null) {
        const errorMessage = customMessage || StatusService.getErrorMessage(errorType, field);
        const response = new CommonResponse(true, code, errorMessage, null, errors);
        return res.status(code).json(response.toJSON());
    }

    static created(res, data, message = null) {
        return this.success(res, data, 201, message);
    }

    static serverError(res, message = null) {
        const errorMessage = message || StatusService.getErrorMessage('serverError');
        const response = new CommonResponse(true, 500, errorMessage, null, []);
        return res.status(500).json(response.toJSON());
    }

    // /**
    //  * Retorna o schema para o Swagger baseado na estrutura do CommonResponse.
    //  *
    //  * @param {string|null} schemaRef - Referência para o schema do "data", se houver.
    //  * @param {string} messageExample - Exemplo de mensagem para o Swagger.
    //  * @returns {object} Schema JSON da resposta.
    //  */
    // static getSwaggerSchema(schemaRef = null, messageExample = "Operação realizada com sucesso") {
    //     return {
    //         type: "object",
    //         properties: {
    //             data: schemaRef
    //                 ? { $ref: schemaRef }
    //                 : { type: "array", items: {}, example: [] },
    //             message: { type: "string", example: messageExample },
    //             errors: { type: "array", example: [] }
    //         }
    //     };
    // }
}

export default CommonResponse;