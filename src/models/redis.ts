import {createClient} from "redis";
import { randomToken } from "../controllers/auth";
const c = {client: createClient(), connected: false};
// client.connected = false;

export async function getUser(token: string): Promise<number | null> {
    if (!c.connected) {
        await c.client.connect();
        c.connected = true;
    }
    const res = await c.client.get(token);
    if (res === null) {
        return null
    }
    return Number.parseInt(res);
}

export async function setUser(uuid: number): Promise<string> {
    if (!c.connected) {
        await c.client.connect();
        c.connected = true;
    }
    const token = randomToken();
    await c.client.set(token, uuid.toString());
    return token;
}