import mongoose from 'mongoose';
import UsuarioFilterBuilder from './filters/UsuarioFilterBuilder.js';
import UsuarioModel from '../models/Usuario.js';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';

class UsuarioRepository {
    constructor({
        usuarioModel = UsuarioModel, 
    } = {}) {
        this.model = usuarioModel;
    }

    // Obter combinações únicas de rota e domínio a partir das permissões.

    async obterParesRotaDominioUnicos(permissoes) {
        const combinacoes = permissoes.map(p => `${p.rota}_${p.dominio || 'undefined'}`);
        const combinacoesUnicas = [...new Set(combinacoes)];
        return combinacoesUnicas.map(combinacao => {
            const [rota, dominio] = combinacao.split('_');
            return { rota, dominio: dominio === 'undefined' ? null : dominio };
        });
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

        if (includeTokens) {
            query = query.select('+refreshtoken +accesstoken');
        }

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

    async listar(req) {
        console.log('Estou no listar em UsuarioRepository');
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

        // Caso não haja ID, retorna todos os usuários com suporte a filtros e paginação
        const { nome, email, page = 1 } = req.query;
        const limite = Math.min(parseInt(req.query.limite, 20) || 20, 100);

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

        const resultado = await this.model.paginate(filterBuilder.build(), {
            page,
            limit: limite,
        });

        // Enriquecer cada usuário com estatísticas utilizando o length dos arrays.
        resultado.docs = resultado.docs.map(doc => {
            const usuarioObj = typeof doc.toObject === 'function' ? doc.toObject() : doc;

            return {
                ...usuarioObj,
            };
        });

        return resultado;
    }

    async criar(dadosUsuario) {
        const usuario = new this.model(dadosUsuario);
        return await usuario.save();
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
