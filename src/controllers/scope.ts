export type Additional = {
    limited: any; // to be used in limitedUser
    public: any;
    private: any;
};

// so there is no infinite loop, when trying to get user.ownerOf[0].owner.ownerOf[0].owner...
export const limitedUser = {
    uuid: true,
    name: true,
    additional: true
};

export const publicProject = {
    id: true,
    ownerId: true,
    owner: {
        select: limitedUser
    },
    members: {
        select: limitedUser
    },
    name: true,
    description: true,
    tasks: true,
    createdAt: true,
    details: true,
    additional: true,
};

export const publicUser = {
    ...limitedUser,
    createdAt: true,
    ownerOf: {
        select: publicProject
    },
    memberOf: {
        select: publicProject
    },
    bio: true,
};

export const publicJoinRequest = {
    senderId: true,
    sender: limitedUser,
    createdAt: true,
    receiverId: true,
    receiver: publicProject,
    message: true,
    additional: true
};

export const memberProject = {
    ...publicProject,

};

export const privateJoinRequest = {
    ...publicJoinRequest
};

export const ownerOnlyProject = {
    ...publicProject,
    joinRequests: {
        select: privateJoinRequest
    },
    banList: {
        select: limitedUser
    }
};

export const privateUser = {
    ...publicUser,
    email: true,
    joins: {
        select: privateJoinRequest
    }
};
