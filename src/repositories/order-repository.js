﻿'use strict';

const mongoose = require('mongoose');
const Order = mongoose.model('Order');

exports.get = async () => {
    var orders = await Order.find({}, 'number status customer items')
        .populate('customer', 'name')
        .populate('items.product', 'title');
    return orders;
}

exports.create = async (data) => {
    var order = new Order(data);
    await order.save();
}