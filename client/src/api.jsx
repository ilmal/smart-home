const axios = require("axios")

const BACKEND_URL = "http://192.168.1.247:5000"

const light_switch = (method) => {
    const data = new FormData();
    data.append('d', '50');
    data.append('r', '0');
    data.append('g', '0');
    data.append('b', '0');
    data.append('c', '50');
    data.append('w', '50');
    data.append('state', method);

    axios({
        method: "post",
        url: BACKEND_URL + "/lights",
        data: data
    })
}

const light_dimmer = (value) => {
    const data = new FormData();
    data.append('d', value);
    data.append('r', '0');
    data.append('g', '0');
    data.append('b', '0');
    data.append('c', '50');
    data.append('w', '50');
    data.append('state', "true");

    axios({
        method: "post",
        url: BACKEND_URL + "/lights",
        data: data
    })
}

exports.light_switch = light_switch
exports.light_dimmer = light_dimmer
