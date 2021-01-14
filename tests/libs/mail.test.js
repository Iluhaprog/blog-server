const { mail } = require('../../src/libs/mail');
const { testEmail } = require('../initObjects');

describe('Test for check mail', async function() {
    it('Should send mail for user', async function() {
        await mail.send({
            name: 'Ilya',
            email: testEmail,
        }, {
            href: 'https://google.com'
        });
    });
});