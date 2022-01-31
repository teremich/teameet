const client = require("redis").createClient();
const auth = require("../controllers/auth");
client.connect();

async function getUser(token) {
    return await client.get(token);
}

async function setUser(userId, expiration) {
    await client.set(userId, auth.randomToken(), {
        EX: expiration
    });
}

module.exports = {
    getUser,
    setUser
};
