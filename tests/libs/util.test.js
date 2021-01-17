const assert = require('assert');
const { paginate } = require('../../src/libs/utls');

describe('Test for utils', function() {
    it('Should create object with offset and limit', function() {
        const page = 1, limit = 20;
        const pagination = paginate({ page, limit });
        assert.deepStrictEqual(pagination, { offset: page * limit, limit });
    })
});