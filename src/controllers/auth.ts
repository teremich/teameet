"use strict"
//TODO: difference between controllers/auth.ts and middleware/auth.ts?????
// I think controllers can call redis and database functions, middleware can only call controllers/auth
import {randomBytes, createHash} from "crypto";
import {normalize} from "path";
import { Request, Response, NextFunction } from "express";
import { db, User, Project } from "./database";
import {getUserId, setUserId} from "../models/redis"

export function randomToken(): string {
    let token: string = "";
    token = randomBytes(64).toString("hex");
    return token;
}

export function hash(password: string): string {
    const hash = createHash("SHA256");
    hash.update(password);
    return hash.digest("hex");
}

export enum level{
    LOGGED_OUT=0,
    LOGGED_IN,
    MEMBER,
    OWNER,
    ADMIN
};

export async function getUserLevel(userToken: string, projectId: string | undefined): Promise<level> {
    const uid = await getUserId(userToken);
    if (!uid) {
        return level.LOGGED_OUT;
    }
    if (uid == 1) {
        return level.ADMIN;
    }
    if (projectId === undefined) {
        return level.LOGGED_IN;
    }
    let pid: number | null = null;
    try{
        pid = Number.parseInt(projectId);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
    // if (await db.isMember(uid, pid)) {
    //     return level.MEMBER;
    // }
    // if (await db.isOwner(uid, pid)) {
    //     return level.OWNER;
    // }
    return level.LOGGED_IN;
}

export function _401(res: Response) {
    res.status(401);
    res.sendFile(normalize(__dirname+"../../../public/401.html"));
}

export function _403(res: Response) {
    res.status(403);
    res.sendFile(normalize(__dirname+"../../../public/403.html"));
}

export async function login(email: string, password: string): Promise<string | null> {
    const user = await db.prisma.user.findUnique({
        where: {
            email
        },
        select: {
            uuid: true,
            passwordHash: true
        }
    });
    if (user?.passwordHash == hash(password)) {
        return await setUserId(user.uuid, 300);
    }
    return null;
}

export {getUserId, setUserId};

export async function getUserObject(uuid: number): Promise<User> {
    const ret = await db.prisma.user.findUnique({
        where: {
            uuid
        }
    });
    if (ret === null) {
        console.error("USERID NOT DEFINED");
        process.exit(1);
    }
    return ret;
}
