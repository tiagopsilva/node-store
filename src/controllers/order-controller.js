'use strict';

const Guid = require('guid');

const repository = require('../repositories/order-repository');
const authService = require('../services/auth-service');

exports.get = async (req, res, next) => {
    var orders = await repository.get();
    res.status(200).send(orders);
}

exports.post = async (req, res, next) => {
    try {
        var token = req.headers['x-access-token'];
        var data = await authService.decodeToken(token);

        await repository.create({
            customer: data.id,
            number: Guid.raw().substring(0, 6),
            items: req.body.items
        });
        res.status(201).send({ message: 'Pedido cadastrado com sucesso' });
    }
    catch (e) {
        res.status(500).send({ message: 'Falha ao processar sua requisição' })
    }
}
