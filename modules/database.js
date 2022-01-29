"use strict";
import PrismaClient from '@prisma/client';

class Database{
    #prisma;
    constructor() {
        this.#prisma = new PrismaClient();
    }
    async addUser(userdata) {
        /**
        userdata={
            name,
            email,
            passwordHash,
            bio {???} // not nullable! pls empty Obj
        }
        **/
        loop: while (true) {
            try {
                await this.#prisma.user.create({
                    data: {
                        uuid: Math.floor(Math.random()*0x100000000),
                        name: userdata.name,
                        email: userdata.email,
                        passwordHash: userdata.passwordHash,
                        bio: userdata.bio
                    }
                });
                break loop;
            } catch (e) {
                if (e.code === "P2002") {
                    switch(e.meta.target[0]) {
                        case "uuid":
                            continue loop;
                        case "email":
                            return 1
                        default:
                            console.error(e);
                            return 2
                    }
                }
            }
        }
        return 0;
    }
    async updateUser(userId, data) {
        /**
        data={
            name,
            email,
            bio
        }
        **/
        let newData = data;
        for (let item of newData) {
            if (item != "name" && item != "email" && item != "bio" && item != "additional") {
                delete newData[item]
            }
        }
        if (newData)
            return await this.#prisma.user.update({
                where: {
                    uuid: userId
                },
                data: newData
            });
    }
    async changePassword(userId, newPasswordHash) {
        return await this.#prisma.user.update({
            where: {
                uuid: userId
            },
            data: {
                passwordHash: newPasswordHash
            }
        });
    }
    async deleteUser(userId) {
        return await this.#prisma.user.delete({
            where: {
                uuid: userId
            }
        });
    }
    async makeJoinRequest(userId, projectId, msg) {
        await this.#prisma.joinRequest.create({
            data: {
                message: msg,
                receiverId: projectId,
                senderId: userId
            }
        });
    }
    async acceptJoin(acceptedUserId, projectId) {
        await this.#prisma.project.update({
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
        await this.#prisma.joinRequest.delete({
            where: {
                senderId_receiverId: {
                    receiverId: projectId,
                    senderId: acceptedUserId
                }
            }
        });
    }
    async kickUser(kickedId, kickedFromId) {
        await this.#prisma.user.update({
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
        await this.#prisma.joinRequest.delete({
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
        return (await this.#prisma.project.findUnique({
            select: {
                banList: true
            },
            where: {
                id: projectId
            }
        })).banList;
    }
}

module.exports = {Database};