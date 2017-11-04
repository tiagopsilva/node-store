'use strict'

const mongoose = require('mongoose');

const Product = mongoose.model('Product');

const ValidationContract = require('../validations/fluent-validator');
const repository = require('../repositories/product-repository');

exports.get = async (req, res, next) => {
    var products = await repository.get();
    res.status(200).send(products);
}

exports.getById = async (req, res, next) => {
    var data = await repository.getById(req.params.id)
    res.status(200).send(data);
}

exports.getBySlug = async (req, res, next) => {
    var data = await repository.getBySlug(req.params.slug);
    res.status(200).send(data);
}

exports.getByTag = async (req, res, next) => {
    var data = await repository.getByTag(req.params.tags);
    res.status(200).send(data);
}

exports.post = async (req, res, next) => {
    await repository.create(req.body);
    res.status(200).send({ message: 'Produto cadastrado com sucesso!' });
}

exports.put = async (req, res, next) => {
    await repository.update(req.params.id, req.body);
    res.status(201).send({ message: 'Produto atualizado com sucesso!' });
}

exports.delete = async (req, res, next) => {
    await repository.delete(req.body.id);
    res.status(201).send({ message: 'Produto removido com sucesso' });
}