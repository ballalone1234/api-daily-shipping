function params_verify(params) {
    let missing_params = [];
    for (let i in params) {
        if (params[i] === undefined || params[i] === null || params[i] === "") {
            missing_params.push(i);
        }
    }

    if (missing_params.length === 0) {
        return true;
    } else {
        return missing_params;
    }
}

module.exports = { params_verify };