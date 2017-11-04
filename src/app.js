'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
const router = express.Router();

// conecta ao banco
mongoose.connect(process.env.NODE_STORE_CONNECTION_STRING, { useMongoClient: true });

// referencia os modelos
const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');

// carrega as rotas
const indexRoutes = require('./routes/index-routes');
const productRoutes = require('./routes/product-routes');
const customerRoutes = require('./routes/customer-routes');
const orderRoutes = require('./routes/order-routes');

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// aplica as rotas às paths
app.use('/', indexRoutes);
app.use('/products', productRoutes);
app.use('/customers', customerRoutes);
app.use('/orders', orderRoutes);

module.exports = app;