"use strict"
import { randomBytes, createHash } from "crypto";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { db, statusCode } from "./database";
import { getUserId, setUserId } from "../models/redis";
import { BUILD_ROUTE } from "./views"
import { transformDocument } from "@prisma/client/runtime";

export function randomToken(): string {
    let token: string = "";
    token = randomBytes(64).toString("hex");
    return token;
}

export function hash(password: string): string {
    const hash = createHash("SHA256");
    hash.update("a84fe43566e173fefdda5bfd4b4" + password);
    return hash.digest("hex");
}

export enum level {
    LOGGED_OUT = 0,
    LOGGED_IN = 0b1,
    MEMBER = 0b10,
    OWNER = 0b100,
    ADMIN = 0b1000
};

export async function getUserLevel(userToken: string, projectId: string | undefined): Promise<{ uuid: number, level: level }> {
    const uid = await getUserId(userToken);
    if (!uid) {
        return { uuid: 0, level: level.LOGGED_OUT };
    }
    if (uid === 521473147) {
        return { uuid: uid, level: level.ADMIN };
    }
    const pid = Number.parseInt(projectId ? projectId : "");
    if (!pid) {
        return { uuid: uid, level: level.LOGGED_IN };
    }
    if (await db.isMember(uid, pid)) {
        return { uuid: uid, level: level.MEMBER };
    }
    if (await db.isOwner(uid, pid)) {
        return { uuid: uid, level: level.OWNER };
    }
    return { uuid: uid, level: level.LOGGED_IN };
}

export function _401(res: Response) {
    res.status(401);
    res.sendFile(BUILD_ROUTE + "401.html");
}

export function _403(res: Response) {
    res.status(403);
    res.sendFile(BUILD_ROUTE + "403.html");
}

// returns a database.statusCode and an AuthToken or undefined as token
export async function register(data: { email: string, password: string, bio: any, name: string, additional?: any }): Promise<{ code: statusCode, token?: string }> {
    const newuuid = Math.floor(Math.random() * 0x80_00_00_00);
    const newUser = await db.addUser({
        uuid: newuuid,
        email: data.email.toLowerCase(),
        bio: data.bio,
        name: data.name,
        passwordHash: hash(newuuid + data.password),
        additional: data.additional
    });
    if (newUser.code != 0 || !newUser.value) {
        return { code: newUser.code };
    }
    return { code: newUser.code, token: await setUserId(newUser.value.uuid) };
}

export async function login(email: string, password: string): Promise<{ token: string, uuid: number } | null> {
    const user = await db.prisma.user.findUnique({
        where: {
            email: email.toLowerCase()
        },
        select: {
            uuid: true,
            passwordHash: true
        }
    });
    if (!user) {
        return null;
    }
    if (user.passwordHash == hash(user.uuid + password)) {
        return { token: await setUserId(user.uuid), uuid: user.uuid };
    }
    return null;
}

export { getUserId, setUserId };

export async function getUserObject(uuid: number) {
    const ret = await db.prisma.user.findUnique({
        where: {
            uuid
        },
        select: {
            additional: true,
            bio: true,
            createdAt: true,
            email: true,
            name: true,
            uuid: true,
            memberOf: {
                select: {
                    id: true,
                    name: true,
                    additional: true,
                    details: true,
                    description: true
                }
            },
            ownerOf: {
                select: {
                    id: true,
                    name: true,
                    additional: true,
                    details: true,
                    description: true
                }
            },
            joins: {
                select: {
                    createdAt: true,
                    additional: true,
                    message: true,
                    receiver: {
                        select: {
                            id: true,
                            name: true,
                            additional: true,
                            details: true,
                            description: true,
                            owner: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    if (ret === null) {
        console.error("USERID NOT DEFINED");
        process.exit(1);
    }
    return ret;
}

export async function getCredsFromLoginReq(req: Request): Promise<{ email: string, password: string } | null> {
    const email: string | undefined = req.body["email"];
    const password: string | undefined = req.body["password"];
    if (email && password) {
        return { email, password };
    }
    return null;
}

export async function getCredsFromRegisterReq(req: Request): Promise<{ email: string, password: string, name: string } | null> {
    const email: string | undefined = req.body["email"];
    const password: string | undefined = req.body["password"];
    const name: string | undefined = req.body["name"];
    if (email && password && name) {
        return { email, password, name };
    }
    return null;
}