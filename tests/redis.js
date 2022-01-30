const redis = require("redis");
const client = redis.createClient();

client.on("connect", () => {
    console.log("connected!");
});
async function main() {
    await client.connect();
    await client.set("test", "true", {
        PX: 2
    });
    let a = await client.get("test");
    let b = await client.get("giaoulhfsjkvcbxnybualhsdf");
    console.log(a, b);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
}).finally(() => {
    client.disconnect();
});