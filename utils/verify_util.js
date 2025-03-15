function verify_params(params) {
    for (let i in params) {
        if (params[i] === undefined || params[i] === null) {
            return false;
        }
    }

    return true;
}

module.exports = { verify_params };