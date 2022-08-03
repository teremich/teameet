import { createClient } from "redis";
import { randomToken } from "../controllers/auth";
const TWELVE_HOURS = 0xa8c0; // 12*60*60 seconds

const c = {
    client: createClient(), connected: false, connect: async function () {
        try {
            await this.client.connect();
        } catch (e) {
            console.error("redis database not running");
            process.exit(1);
        }
    }
};

export async function getUserId(token: string): Promise<number | null> {
    if (!c.connected) {
        await c.connect();
        c.connected = true;
    }
    const res = await c.client.get(token);
    if (res === null) {
        return null
    }
    return Number.parseInt(res);
}

export async function setUserId(uuid: number, expires?: number): Promise<string> {
    if (!c.connected) {
        await c.connect();
        c.connected = true;
    }
    const token = randomToken();
    await c.client.set(token, uuid.toString(), {
        EX: expires ?? TWELVE_HOURS
    });
    return token;
}
