'use strict';

const repository = require('../repositories/order-repository');
const Guid = require('guid');

exports.get = async (req, res, next) => {
    var orders = await repository.get();
    res.status(200).send(orders);
}

exports.post = async (req, res, next) => {
    await repository.create({
        customer: req.body.customer,
        number: Guid.raw().substring(0, 6),
        items: req.body.items
    });
    res.status(200).send({ message: 'Pedido cadastrado com sucesso' });
}