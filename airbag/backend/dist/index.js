"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import 'module-alias/register';
const envConfig_1 = require("@common/utils/envConfig");
const server_1 = require("./server");
const port = envConfig_1.env.PORT;
const server = server_1.app.listen(port, () => {
    const { NODE_ENV, HOST } = envConfig_1.env;
    server_1.logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${port}`);
});
const onCloseSignal = () => {
    server_1.logger.info("sigint received, shutting down");
    server.close(() => {
        server_1.logger.info("server closed");
        process.exit();
    });
    setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};
process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
