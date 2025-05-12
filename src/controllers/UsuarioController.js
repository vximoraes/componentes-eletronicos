import UsuarioService from '../services/UsuarioService.js';
import { UsuarioQuerySchema, UsuarioIdSchema } from '../utils/validators/schemas/zod/querys/UsuarioQuerySchema.js';
import { UsuarioSchema, UsuarioUpdateSchema } from '../utils/validators/schemas/zod/UsuarioSchema.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
// import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
// import sharp from 'sharp';

const getDirname = () => path.dirname(fileURLToPath(import.meta.url));

class UsuarioController {
    constructor() {
        this.service = new UsuarioService();
    }

    // Lista usuários. Se um ID é fornecido, retorna um único objeto.
    // Caso contrário, retorna todos os objetos com suporte a filtros e paginação.

    async listar(req, res) {
        console.log('Estou no listar em UsuarioController');

        const { id } = req.params || {};

        if (id) {
            UsuarioIdSchema.parse(id);
        }

        // Validação das queries (se existirem)
        const query = req.query || {};
        if (Object.keys(query).length !== 0) {
            // Deve apenas validar o objeto query, tendo erro o zod será responsável por lançar o erro
            await UsuarioQuerySchema.parseAsync(query);
        }

        const data = await this.service.listar(req);
        return CommonResponse.success(res, data);
    }

    // Cria um novo usuário.

    async criar(req, res) {
        console.log('Estou no criar em UsuarioController');

        // Cria o DTO de criação e valida os dados
        const parsedData = UsuarioSchema.parse(req.body);
        let data = await this.service.criar(parsedData);

        // Converte o documento Mongoose para um objeto simples
        let usuarioLimpo = data.toObject();

        // Remove campos indesejados, como a senha e outros que não devem ser expostos
        delete usuarioLimpo.senha;

        return CommonResponse.created(res, usuarioLimpo);
    }

    // Atualiza um usuário existente.

    async atualizar(req, res) {
        console.log('Estou no atualizar em UsuarioController');

        const { id } = req.params;
        UsuarioIdSchema.parse(id);

        const parsedData = UsuarioUpdateSchema.parse(req.body);
        const data = await this.service.atualizar(id, parsedData);

        // Converte o documento Mongoose para um objeto simples
        let usuarioLimpo = data.toObject();

        // Remove campos indesejados, como a senha e outros que não devem ser expostos
        delete usuarioLimpo.senha;

        return CommonResponse.success(res, data, 200, 'Usuário atualizado com sucesso. Porém, o e-mail é ignorado em tentativas de atualização, pois é opração proibida. IDs de Unidades e Grupos não cadastradas são ignoradas.');
    }

    // Deleta um usuário existente.

    async deletar(req, res) {
        console.log('Estou no deletar em UsuarioController');

        const { id } = req.params || {};
        if (!id) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'id',
                details: [],
                customMessage: 'ID do usuário é obrigatório para deletar.'
            });
        }

        const data = await this.service.deletar(id);
        return CommonResponse.success(res, data, 200, 'Usuário excluído com sucesso.');
    }

    // /**
    //  * Faz upload de uma foto para um usuário.
    //  */
    // async fotoUpload(req, res, next) {
    //     try {
    //         console.log('Estou no fotoUpload em UsuarioController');

    //         const { id } = req.params || {};
    //         UsuarioIdSchema.parse(id);

    //         // Verificar se o arquivo foi enviado
    //         const file = req.files?.file;
    //         if (!file) {
    //             throw new CustomError({
    //                 statusCode: HttpStatusCodes.BAD_REQUEST.code,
    //                 errorType: 'validationError',
    //                 field: 'file',
    //                 details: [],
    //                 customMessage: 'Nenhum arquivo foi enviado.'
    //             });
    //         }

    //         // Validar extensão do arquivo
    //         const extensaoArquivo = path.extname(file.name).slice(1).toLowerCase();
    //         const extensoesValidas = ["jpg", "jpeg", "png", "svg"];
    //         if (!extensoesValidas.includes(extensaoArquivo)) {
    //             throw new CustomError({
    //                 statusCode: HttpStatusCodes.BAD_REQUEST.code,
    //                 errorType: 'validationError',
    //                 field: 'file',
    //                 details: [],
    //                 customMessage: 'Extensão de arquivo inválida. Permitido: jpg, jpeg, png, svg.'
    //             });
    //         }

    //         // Preparar o nome do arquivo
    //         const fileName = uuidv4() + '.' + extensaoArquivo;
    //         const uploadsDir = path.join(getDirname(), '..', '../uploads');
    //         const uploadPath = path.join(uploadsDir, fileName);

    //         // Cria a pasta de uploads se não existir
    //         if (!fs.existsSync(uploadsDir)) {
    //             fs.mkdirSync(uploadsDir, { recursive: true });
    //         }

    //         // Redimensiona a imagem para 400x400 (corte centralizado)
    //         const imageBuffer = await sharp(file.data)
    //             .resize(400, 400, {
    //                 fit: sharp.fit.cover,
    //                 position: sharp.strategy.entropy
    //             })
    //             .toBuffer();

    //         // Salva a imagem redimensionada
    //         await fs.promises.writeFile(uploadPath, imageBuffer);

    //         // Atualiza o link_foto no usuário
    //         const dados = { link_foto: fileName };
    //         UsuarioUpdateSchema.parse(dados);

    //         const updatedUser = await this.service.atualizar(id, dados);

    //         return CommonResponse.success(res, {
    //             message: 'Arquivo recebido e usuário atualizado com sucesso.',
    //             dados: { link_foto: fileName },
    //             metadados: {
    //                 fileName,
    //                 fileExtension: extensaoArquivo,
    //                 fileSize: file.size,
    //                 md5: file.md5
    //             }
    //         });
    //     } catch (error) {
    //         console.error('Erro no fotoUpload:', error);
    //         return next(error);
    //     }
    // }

    // /**
    //  * Faz download da foto de um usuário.
    //  */
    // async getFoto(req, res, next) {
    //     try {
    //         console.log('Estou no getFoto em UsuarioController');

    //         const { id } = req.params || {};
    //         UsuarioIdSchema.parse(id);

    //         const usuario = await this.service.listar(req);
    //         const { link_foto } = usuario;

    //         if (!link_foto) {
    //             throw new CustomError({
    //                 statusCode: HttpStatusCodes.NOT_FOUND.code,
    //                 errorType: 'notFound',
    //                 field: 'link_foto',
    //                 details: [],
    //                 customMessage: 'Foto do usuário não encontrada.'
    //             });
    //         }

    //         const filename = link_foto;
    //         const uploadsDir = path.join(getDirname(), '..', '../uploads');
    //         const filePath = path.join(uploadsDir, filename);

    //         const extensao = path.extname(filename).slice(1).toLowerCase();
    //         const mimeTypes = {
    //             jpg: 'image/jpeg',
    //             jpeg: 'image/jpeg',
    //             png: 'image/png',
    //             svg: 'image/svg+xml'
    //         };
    //         const contentType = mimeTypes[extensao] || 'application/octet-stream';

    //         res.setHeader('Content-Type', contentType);
    //         return res.sendFile(filePath);
    //     } catch (error) {
    //         console.error('Erro no getFoto:', error);
    //         return next(error);
    //     }
    // }
}

export default UsuarioController;