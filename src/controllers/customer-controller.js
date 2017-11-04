'use strict';

const ValidationContract = require('../validations/fluent-validator');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');

const emailService = require('../services/email-service');

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
            password: md5(req.body.password + process.env.NODE_STORE_SALT_KEY)
        });

        emailService.send(req.body.email, req.body.name, 'Bem vindo ao Node Store', global.EMAIL_TMPL);

        res.status(201).send({ message: 'Cliente cadastrado com sucesso!' });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Falha ao processar a sua requisição' })
    }
}