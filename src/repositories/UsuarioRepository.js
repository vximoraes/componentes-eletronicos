import UsuarioFilterBuilder from './filters/UsuarioFilterBuilder.js';
import UsuarioModel from '../models/Usuario.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class UsuarioRepository {
    constructor({
        usuarioModel = UsuarioModel, 
    } = {}) {
        this.model = usuarioModel;
    }

    // Buscar usuário por email e, opcionalmente, por um ID diferente.
    
    async buscarPorEmail(email, idIgnorado = null) {
        const filtro = { email };

        if (idIgnorado) {
            filtro._id = { $ne: idIgnorado };
        }

        const documento = await this.model.findOne(filtro, '+senha')

        return documento;
    }

    async buscarPorId(id, includeTokens = false) {
        let query = this.model.findById(id);

        // if (includeTokens) {
        //     query = query.select('+refreshtoken +accesstoken');
        // }

        const user = await query;

        if (!user) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Usuário',
                details: [],
                customMessage: messages.error.resourceNotFound('Usuário')
            });
        }
        return user;
    }

    // Métodos CRUD.

    async criar(dadosUsuario) {
        const usuario = new this.model(dadosUsuario);
        return await usuario.save();
    }

    async listar(req) {
        const id = req.params.id || null;

        // Se um ID for fornecido, retorna o usuário enriquecido com estatísticas.
        if (id) {
            const data = await this.model.findById(id)

            if (!data) {
                throw new CustomError({
                    statusCode: 404,
                    errorType: 'resourceNotFound',
                    field: 'Usuário',
                    details: [],
                    customMessage: messages.error.resourceNotFound('Usuário')
                });
            }

            const dataWithStats = {
                ...data.toObject()
            }

            return dataWithStats;
        }

        const { nome, email, page = 1 } = req.query;
        const limite = Math.min(parseInt(req.query.limite, 10) || 10, 100);

        const filterBuilder = new UsuarioFilterBuilder()
            .comNome(nome || '')
            .comEmail(email || '')

        if (typeof filterBuilder.build !== 'function') {
            throw new CustomError({
                statusCode: 500,
                errorType: 'internalServerError',
                field: 'Usuário',
                details: [],
                customMessage: messages.error.internalServerError('Usuário')
            });
        }

        const filtros = filterBuilder.build()

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limite, 10),
            sort: { nome: 1 }
        }

        const resultado = await this.model.paginate(filtros, options);

        // Enriquecer cada usuário com estatísticas utilizando o length dos arrays.
        resultado.docs = resultado.docs.map(doc => {
            const usuarioObj = typeof doc.toObject === 'function' ? doc.toObject() : doc;

            return {
                ...usuarioObj,
            };
        });

        return resultado;
    }

    async atualizar(id, parsedData) {
        const usuario = await this.model.findByIdAndUpdate(id, parsedData, { new: true }).exec();
        if (!usuario) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Usuário',
                details: [],
                customMessage: messages.error.resourceNotFound('Usuário')
            });
        }

        return usuario;
    }

    async deletar(id) {
        const usuario = await this.model.findByIdAndDelete(id);
        return usuario;
    }
}

export default UsuarioRepository;