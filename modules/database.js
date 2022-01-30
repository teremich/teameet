"use strict";
const {PrismaClient} = require('@prisma/client');
const e = require('express');

class Database{
    prisma;
    constructor() {
        this.prisma = new PrismaClient();
    }
    async addUser(userdata) {
        /**
        userdata={
            name: String,
            email: String,
            passwordHash: String,
            bio: Object // not nullable! pls empty Obj,
            additional: Object?
        }
        **/
        for (let i = 0; i < 0x100; i++) {
            try {
                const p = await this.prisma.user.create({
                    data: {
                        uuid: Math.floor(Math.random()*0x100000000),
                        name: userdata.name,
                        email: userdata.email,
                        passwordHash: userdata.passwordHash,
                        bio: userdata.bio,
                        additional: userdata.additional
                    }
                });
                return {code: 0, msg: "success", detail: p};
            } catch (e) {
                if (e.code === "P2002") {
                    switch(e.meta.target[0]) {
                        case "uuid":
                            break;
                        case "email":
                            return {code: 1, msg: "failure", detail: "duplicate email"}
                        default:
                            console.error(e);
                            return {code: 2, msg: "failure", detail: "something duplicate, dont know what", value: e}
                    }
                } else if (e.code === "P2000") {
                    // console.log(e.meta);
                    return {
                        code: 4,
                        msg: "failure",
                        detail: `${e.meta.column_name} was too long, if not available it's the name`
                    };
                } else {
                    throw e;
                }
            }
        }
        return {code: 3, msg: "failure", detail: "0x100 userids checked, non were available"};
    }
    async updateUser(userId, data) {
        /**
        data={
            name,
            email,
            bio,
            additional
        }
        **/
        return await this.prisma.user.update({
            where: {
                uuid: userId
            },
            data: {
                name: data.name,
                email: data.email,
                bio: data.bio,
                additional: data.additional
            }
        });
    }
    async changePassword(userId, newPasswordHash) {
        return await this.prisma.user.update({
            where: {
                uuid: userId
            },
            data: {
                passwordHash: newPasswordHash
            }
        });
    }
    async deleteUser(userId) {
        try {
            await this.prisma.user.delete({
                where: {
                    uuid: userId
                }
            });
        } catch (e) {
            if (e.code === "P2025") {
                console.log("already deleted");
            } else {
                throw e;
            }
        }
    }
    async makeJoinRequest(userId, projectId, msg) {
        await this.prisma.joinRequest.create({
            data: {
                message: msg,
                receiverId: projectId,
                senderId: userId
            }
        });
    }
    async acceptJoin(acceptedUserId, projectId) {
        await this.prisma.project.update({
            data: {
                members: {
                    connect: {
                        uuid: acceptedUserId
                    }
                }
            },
            where: {
                id: projectId
            }
        });
        await this.prisma.joinRequest.delete({
            where: {
                senderId_receiverId: {
                    receiverId: projectId,
                    senderId: acceptedUserId
                }
            }
        });
    }
    async kickUser(kickedId, kickedFromId) {
        await this.prisma.user.update({
            where: {
                uuid: kickedId
            },
            data: {
                memberOf: {
                    disconnect: {
                        id: kickedFromId
                    }
                }
            }
        });
    }
    async rejectJoin(acceptedUserId, projectId) {
        await this.prisma.joinRequest.delete({
            where: {
                senderId_receiverId: {
                    receiverId: projectId,
                    senderId: acceptedUserId
                }
            }
        });
    }
    async ban(bannedId, bannedFromId) {

    }
    async unban(bannedId, bannedFromId) {

    }
    async makeProject() {

    }
    async updateProject() {

    }
    async deleteProject() {

    }
    async getProjects() {

    }
    async getUsers() {

    }
    async getJoinRequests() {

    }
    async getBans(projectId) {
        return (await this.prisma.project.findUnique({
            select: {
                banList: true
            },
            where: {
                id: projectId
            }
        })).banList;
    }
}

module.exports = {
    Database
}