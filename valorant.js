import axios from "axios"
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const config = require("./config.json")

const getRiotName = (accessToken, entitlementToken, region) => {
    return new Promise(resolve => {
        axios.put(`https://pd.${region}.a.pvp.net/name-service/v2/players`, [JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString()).sub], {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Riot-Entitlements-JWT": entitlementToken
            }
        })
        .then(res => res.data)
        .then(data => data[0])
        .then(data => `${data.GameName}#${data.TagLine}`)
        .then(resolve)
    })
}

const getStore = (accessToken, entitlementToken, playerId, clientVersion, region) => {
    return new Promise(resolve => {
        axios.get(`https://pd.${region}.a.pvp.net/store/v2/storefront/${playerId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Riot-Entitlements-JWT": entitlementToken,
                "X-Riot-ClientVersion": clientVersion
            }
        })
        .then(res => res.data)
        .then(resolve)
    })
}

const getStoreSkin = skinLevelId => {
    return new Promise(resolve => {
        axios.get(`https://valorant-api.com/v1/weapons/skinlevels/${skinLevelId}`)
        .then(res => res.data)
        .then(resolve)
    })
}

const getCurrentAct = (clientVersion, region) => {
    return new Promise(resolve => {
        axios.get(`https://shared.${region}.a.pvp.net/content-service/v3/content`, {
            headers: {
                "X-Riot-ClientVersion": clientVersion,
                "X-Riot-ClientPlatform": config.clientPlatform
            }
        })
        .then(res => res.data.Seasons)
        .then(seasons => seasons.filter(season => season.Type === "act").filter(act => act.IsActive)[0])
        .then(act => act.ID)
        .then(resolve)
    })
}

const getCurrentSeason = (clientVersion, region) => {
    return new Promise(resolve => {
        axios.get(`https://shared.${region}.a.pvp.net/content-service/v3/content`, {
            headers: {
                "X-Riot-ClientVersion": clientVersion,
                "X-Riot-ClientPlatform": config.clientPlatform
            }
        })
        .then(res => res.data.Seasons)
        .then(seasons => seasons.filter(season => season.Type === "episode").filter(episode => episode.IsActive)[0])
        .then(episode => episode.ID)
        .then(resolve)
    })
}

const getCompetitiveTiersId = seasonId => {
    return new Promise(resolve => {
        axios.get("https://valorant-api.com/v1/seasons/competitive")
        .then(res => res.data.data)
        .then(tierCollections => tierCollections.filter(collection => collection.seasonUuid === seasonId)[0])
        .then(tierCollection => tierCollection.competitiveTiersUuid)
        .then(resolve)
    })
}

const getCompetitiveTiers = tiersId => {
    return new Promise(resolve => {
        axios.get(`https://valorant-api.com/v1/competitivetiers/${tiersId}`)
        .then(res => res.data.data.tiers)
        .then(resolve)
    })
}

const getCompetitiveData = (accessToken, entitlementToken, playerId, actId, clientVersion, region) => {
    return new Promise(resolve => {
        axios.get(`https://pd.${region}.a.pvp.net/mmr/v1/players/${playerId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Riot-Entitlements-JWT": entitlementToken,
                "X-Riot-ClientVersion": clientVersion,
                "X-Riot-ClientPlatform": config.clientPlatform
            }
        })
        .then(res => res.data)
        .then(data => data.QueueSkills.competitive.SeasonalInfoBySeasonID[actId])
        .then(resolve)
    })
}

const getAllSkins = () => {
    return new Promise(resolve => {
        axios.get("https://valorant-api.com/v1/weapons/skins")
        .then(res => res.data.data)
        .then(resolve)
    })
}

const getOffers = (accessToken, entitlementToken, clientVersion, region) => {
    return new Promise(resolve => {
        axios.get(`https://pd.${region}.a.pvp.net/store/v1/offers`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Riot-Entitlements-JWT": entitlementToken,
                "X-Riot-ClientVersion": clientVersion,
                "X-Riot-ClientPlatform": config.clientPlatform
            }
        })
        .then(res => res.data)
        .then(data => data.Offers)
        .then(resolve)
    })
}

export { getRiotName, getStore, getStoreSkin, getCurrentAct, getCurrentSeason, getCompetitiveTiersId, getCompetitiveTiers, getCompetitiveData, getAllSkins, getOffers }