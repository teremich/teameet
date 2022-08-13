import { createClient } from "redis";
import { randomToken } from "controllers/auth";
const TWELVE_HOURS = 0xa8c0; // 12*60*60 seconds

const c = {
    client: createClient(),
    connected: false,
    connect: async function () {
        if (this.connected) {
            return;
        }
        try {
            this.connected = true;
            await this.client.connect();
        } catch (e) {
            console.error("redis database not running");
            console.error(e);
            process.exit(1);
        }
    }
};

async function getRedisClient() {
    await c.connect();
    return c.client;
}

export async function getUserId(token: string | undefined): Promise<number | null> {
    if (!token) {
        return null;
    }
    const res = await (await getRedisClient()).get(token);
    if (res === null) {
        return null
    }
    return Number.parseInt(res);
}

export async function removeUserId(token: string | undefined) {
    if (!token) {
        return;
    }
    const cl = await getRedisClient();
    const id = await getUserId(token);
    await cl.del(token);
    if (id) {
        await cl.del(id.toString());
    }
}

export async function setUserId(uuid: number, expires?: number): Promise<string> {
    const cl = await getRedisClient();
    const oldToken = await cl.get(uuid.toString());
    if (oldToken) {
        // this prevents two sessions at once
        await cl.del(oldToken);
    }
    const token = randomToken();
    await cl.set(token, uuid.toString(), {
        EX: expires ?? TWELVE_HOURS
    });
    await cl.set(uuid.toString(), token, {
        EX: expires ?? TWELVE_HOURS
    });
    return token;
}
