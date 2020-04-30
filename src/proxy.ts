// src/proxy.ts

import request from "request";

const getURL = (req: Request) => {
    const tempList = req.url.split('/');
    const protocol = tempList[2];
    const path = tempList.slice(3, tempList.length).join('/');
    return `${protocol}://${path}`;
}

const excludeRequestHeaders = (headers: object) => {
    const targets = ['host', 'referer'];
    let reqHeaders = {};
    Object.keys(reqHeaders).forEach(key => {
        if (!targets.includes(key)) {
            reqHeaders[key] = headers[key];
        }
    });
    return reqHeaders;
};

const excludeResponseHeaders = (headers: object) => {
    const targets = ['connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailers',
        'transfer-encoding', 'upgrade', 'content-encoding', 'content-length'];
    let resHeaders = {};
    Object.keys(resHeaders).forEach(key => {
        if (!targets.includes(key)) {
            resHeaders[key] = headers[key];
        }
    });
    return resHeaders;
};

export function httpProxy(req: any, res: any) {
    const url = getURL(req);
    const headers = excludeRequestHeaders(req.headers);
    request({
        url,
        method: req.method,
        headers,
        body: req.body,
        strictSSL: false,
        json: true,
        gzip: true,
    }, (error, response, body) => {
        if (!!response) {
            res.set(excludeResponseHeaders(response.headers));
            res.status(response.statusCode).send(body);
        } else {
            console.log(error);
            res.status(500).send(body);
        }
    });
}