'use strict';

const jwt = require('jsonwebtoken');

exports.generateToken = async (data) => {
    return jwt.sign(data, process.env.NODE_STORE_SALT_KEY, { expiresIn: '1d' });
}

exports.decodeToken = async (token) => {
    var data = await jwt.verify(token, process.env.NODE_STORE_SALT_KEY);
    return data;
}

exports.authorize = (req, res, next) => {
    var token = req.headers['x-access-token'];

    if (!token) {
        res.status(401).json({ message: 'Acesso Restrito' })
    } else {
        jwt.verify(token, process.env.NODE_STORE_SALT_KEY, function (error, decoded) {
            if (error) {
                res.status(401).json({ message: 'Token inv?lido' });
            } else {
                next();
            }
        });
    }
}

exports.isAdmin = (req, res, next) => {
    var token = req.headers['x-access-token'];

    if (!token) {
        res.status(401).json({ message: 'Acesso Restrito' })
    } else {
        jwt.verify(token, process.env.NODE_STORE_SALT_KEY, function (error, decoded) {
            if (error) {
                res.status(401).json({ message: 'Token inv?lido' });
            } else {
                if (decoded.roles.includes('admin')) {
                    next();
                }
                else {
                    res.status(401).json({ message: 'Acesso restrito para adminstradores' });
                }
            }
        });
    }
}
