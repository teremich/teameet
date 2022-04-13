import { hash } from "./controllers/auth";
import * as DATABASE from "./controllers/database";

DATABASE.db.addUser({
    name: "teremich",
    bio: ":)",
    email: "michi.tereschenko@gmail.com",
    passwordHash: hash("123Qwasyx45")
});