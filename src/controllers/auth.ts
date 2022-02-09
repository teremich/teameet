"use strict"
import {randomBytes, createHash} from "crypto";
import {normalize} from "path";
import { Request, Response, NextFunction } from "express";
import { db, User, Project, statusCode} from "./database";
import {getUserId, setUserId} from "../models/redis";
import {BUILD_ROUTE} from "./views"

export function randomToken(): string {
    let token: string = "";
    token = randomBytes(64).toString("hex");
    return token;
}

export function hash(password: string): string {
    // TODO: salt and pepper
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
    // TODO: admin
    if (projectId === undefined) {
        return level.LOGGED_IN;
    }
    let pid: number | null = null;
    try{
        pid = Number.parseInt(projectId);
    } catch (e) {
        return level.LOGGED_IN;
    }
    // TODO
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
    res.sendFile(BUILD_ROUTE + "/401.html");
}

export function _403(res: Response) {
    res.status(403);
    res.sendFile(BUILD_ROUTE + "/403.html");
}

export async function register(data: {email: string, password: string, bio: any, name: string, additional?: any}): Promise<{code: statusCode, token?: string}> {
    // returns AuthToken or null when error
    const newUser = await db.addUser({
        email: data.email,
        bio: data.bio,
        name: data.name,
        passwordHash: hash(data.password),
        additional: data.additional
    });
    if (newUser.code != 0 || !newUser.value) {
        return {code: newUser.code};
    }
    return {code: newUser.code, token: await setUserId(newUser.value.uuid)};
}

export async function login(email: string, password: string): Promise<{token: string, uuid: number} | null> {
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
        return {token: await setUserId(user.uuid, 300), uuid: user.uuid};
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
// TODO make registration work
export async function getCredsFromReq(req: Request): Promise<{email: string, password: string, name: string} | null> {
    const email = req.body["email"];
    const password = req.body["password"];
    const name = req.body["name"];
    if (!email || !password) {
        return null;
    }
    return {email, password, name};
}