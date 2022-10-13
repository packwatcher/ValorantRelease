import { Agent } from "https"
import axios from "axios"
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const config = require("./config.json")

const agent = new Agent({ ciphers: ["TLS_CHACHA20_POLY1305_SHA256","TLS_AES_128_GCM_SHA256","TLS_AES_256_GCM_SHA384", "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256"].join(":"), honorCipherOrder: true, minVersion: "TLSv1.2" })

const getAsid = () => {
    return new Promise(resolve => {
        axios.post("https://auth.riotgames.com/api/v1/authorization", {
            "client_id": "play-valorant-web-prod",
            "nonce": "1",
            "redirect_uri": "https://playvalorant.com/opt_in",
            "response_type": "token id_token"
        }, {
            headers: {
                "User-Agent": config.userAgent
            },
            httpsAgent: agent
        })
        .then(res => res.headers["set-cookie"].find(elem => /^asid/.test(elem)))
        .then(resolve)
    })
}

const getClientVersion = () => {
    return new Promise(resolve => {
        axios.get("https://valorant-api.com/v1/version")
        .then(res => res.data.data.riotClientVersion)
        .then(resolve)
    })
}

const getAccessTokens = (asid, username, password) => {
    return new Promise(resolve => {
        axios.put("https://auth.riotgames.com/api/v1/authorization", {
            type: "auth",
            username: username,
            password: password
        }, {
            headers: {
                Cookie: asid,
                "User-Agent": config.userAgent
            },
            httpsAgent: agent
        })
        .then(res => [res.data.response.parameters.uri, res.headers["set-cookie"].find(elem => /^ssid/.test(elem))])
        .then(resolve)
    })
}

const getEntitlementToken = accessToken => {
    return new Promise(resolve => {
        axios.post("https://entitlements.auth.riotgames.com/api/token/v1", {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then(res => res.data.entitlements_token)
        .then(resolve)
    })
}

const refreshTokens = ssid => {
    return new Promise(resolve => {
        axios.post("https://auth.riotgames.com/api/v1/authorization", {
            "client_id": "play-valorant-web-prod",
            "nonce": "1",
            "redirect_uri": "https://playvalorant.com/opt_in",
            "response_type": "token id_token"
        }, {
            headers: {
                Cookie: ssid,
                "User-Agent": config.userAgent
            },
            httpsAgent: agent
        })
        .then(res => [res.data.response.parameters.uri, res.headers["set-cookie"].find(elem => /^ssid/.test(elem))])
        .then(resolve)
    })
}

export { getAsid, getClientVersion, getAccessTokens, getEntitlementToken, refreshTokens }