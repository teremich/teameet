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

export const limitedProject = {
    id: true,
    name: true,
    additional: true,
    description: true,
}

export const publicProject = {
    ...limitedProject,
    ownerId: true,
    owner: {
        select: limitedUser
    },
    members: {
        select: limitedUser
    },
    tasks: true,
    createdAt: true,
    details: true,
};

export const publicUser = {
    ...limitedUser,
    createdAt: true,
    ownerOf: {
        select: limitedProject
    },
    memberOf: {
        select: limitedProject
    },
    bio: true,
};

export const publicJoinRequest = {
    senderId: true,
    sender: {
        select: limitedUser
    },
    createdAt: true,
    receiverId: true,
    receiver: {
        select: limitedProject
    },
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
