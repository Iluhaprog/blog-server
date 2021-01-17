const defaultLimit = +process.env.MAX_LIMIT;

function paginate({page = 0, limit = defaultLimit}) {
    return {
        offset: +page * +limit,
        limit: limit <= defaultLimit ? +limit : defaultLimit,
    };
}

module.exports = paginate;