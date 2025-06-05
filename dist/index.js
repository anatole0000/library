"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const db_1 = require("./config/db");
const app_1 = require("./app");
async function start() {
    try {
        await (0, db_1.connectDB)();
        const app = await (0, app_1.createApp)();
        app.listen(4000, () => {
            console.log("🚀 Server ready at http://localhost:4000/graphql");
        });
    }
    catch (err) {
        console.error("❌ Server failed to start:", err);
    }
}
start();
