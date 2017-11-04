'use strict';

const md5 = require('md5');

const ValidationContract = require('../validations/fluent-validator');
const repository = require('../repositories/customer-repository');
const emailService = require('../services/email-service');
const AuthService = require('../services/auth-service');

exports.post = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 'E-mail inválido');
    contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres');

    // Se os dados forem inválidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + process.env.NODE_STORE_SALT_KEY),
            roles: ['user']
        });

        emailService.send(
            req.body.email,
            'Bem vindo ao Node Store',
            global.EMAIL_TMPL.replace('{0}', req.body.name));

        res.status(201).send({ message: 'Cliente cadastrado com sucesso!' });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Falha ao processar a sua requisição' })
    }
}

exports.authenticate = async (req, res, next) => {
    try {
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + process.env.NODE_STORE_SALT_KEY)
        });

        if (!customer) {
            res.status(404).send({ message: 'Usuário ou senha inválida' });
            return;
        }

        const token = await AuthService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            token: token,
            customer: {
                email: customer.email,
                name: customer.name
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Falha ao processar a sua requisição' })
    }
}

exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        const customerData = await AuthService.decodeToken(token);

        const customer = await repository.getById(customerData.id);
        if (!customer) {
            res.status(404).send({ message: 'Cliente não encontrado' });
            return;
        }

        const newToken = await AuthService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            token: newToken,
            customer: {
                email: customer.email,
                name: customer.name
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Falha ao processar a sua requisição' })
    }
}