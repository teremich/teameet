const {Database} = require("../modules/database");
const db = new Database();

const user1 = await db.addUser();
const user2 = await db.addUser();
const user3 = await db.addUser();

const resp1 = await db.updateUser();
const resp2 = await db.changePassword();

const project1 = await db.makeProject();
const resp3 = await db.updateProject();
const project2 = await db.makeProject();

const jr1 = await db.makeJoinRequest();
const jr2 = await db.makeJoinRequest();

const allowed = await db.acceptJoin();
const kicked = await db.kickUser();
const rejected = await db.rejectJoin();

const ban = await db.ban();
const bans = await db.getBans();
const unban = await db.unban();

const deleteProject = await db.deleteProject();
const users = await db.getUsers();
const projects = await db.getProjects();
const newjr = await db.makeJoinRequest();
const jrs = await db.getJoinRequests();

await db.deleteUser();

const newjr = await db.makeJoinRequest();

await db.deleteProject();

await db.deleteUser();
await db.deleteUser();