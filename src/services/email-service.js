'use strict';

const api_key = process.env.MAILGUN_API_KEY;
const domain = 'tiagosilva.me';
const mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

exports.send = (emailTo, nameTo, subject, body) => {
    var email = {
        to: emailTo,
        from: 'tiago.prs@gmail.com',        
        subject: subject,
        html: body.replace('{0}', nameTo)
    };

    mailgun.messages().send(email, function (error, body) {
        if (error) {
            console.error(error);
        }
    });
}
