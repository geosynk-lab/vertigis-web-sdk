import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import defaultWebpackConfig, { merge } from "@vertigis/web-sdk/config/webpack.config.js";

/**
 * Starts a lightweight zero-dependency dual-port forwarder on port 3000 forwarding to port 3001.
 * This makes the extension simultaneously reachable at both https://localtest.me:3001 and
 * https://localhost:3000 (preventing CORS / port mismatch issues in ArcGIS Enterprise/Portal).
 */
let bridgeStarted = false;
function setupDualPortBridge(targetPort = 3001, bridgePort = 3000) {
    if (bridgeStarted) return;
    bridgeStarted = true;

    try {
        const certPath = path.resolve(process.cwd(), "certs/cert.pem");
        const keyPath = path.resolve(process.cwd(), "certs/key.pem");
        if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) return;

        const options = {
            cert: fs.readFileSync(certPath),
            key: fs.readFileSync(keyPath),
        };

        const server = https.createServer(options, (req, res) => {
            const clientReq = https.request(
                {
                    hostname: "127.0.0.1",
                    port: targetPort,
                    path: req.url,
                    method: req.method,
                    headers: { ...req.headers, host: `localhost:${targetPort}` },
                    rejectUnauthorized: false,
                },
                clientRes => {
                    res.writeHead(clientRes.statusCode || 200, {
                        ...clientRes.headers,
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                        "Access-Control-Allow-Headers": "*",
                        "Access-Control-Allow-Private-Network": "true",
                    });
                    clientRes.pipe(res);
                }
            );

            clientReq.on("error", () => {
                res.writeHead(502);
                res.end("Bridge connection error");
            });

            req.pipe(clientReq);
        });

        server.on("upgrade", (req, socket) => {
            const clientReq = https.request({
                hostname: "127.0.0.1",
                port: targetPort,
                path: req.url,
                method: req.method,
                headers: req.headers,
                rejectUnauthorized: false,
            });

            clientReq.on("upgrade", (clientRes, clientSocket) => {
                socket.write(
                    "HTTP/1.1 101 Switching Protocols\r\n" +
                        Object.entries(clientRes.headers)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join("\r\n") +
                        "\r\n\r\n"
                );
                clientSocket.pipe(socket).pipe(clientSocket);
            });

            clientReq.on("error", () => socket.destroy());
            clientReq.end();
        });

        server.listen(bridgePort, "0.0.0.0", () => {
            console.log(
                `<i> [dual-port-bridge] Also available at https://localhost:${bridgePort} & https://localtest.me:${bridgePort}`
            );
        });

        server.on("error", err => {
            console.log(
                `<i> [dual-port-bridge] Port ${bridgePort} unavailable (${err.message}). Serving exclusively on :${targetPort}`
            );
        });
    } catch {
        // Silently skip if port forwarder cannot be initialized
    }
}

export default merge(defaultWebpackConfig, {
    devServer: {
        allowedHosts: "all",
        host: "0.0.0.0",
        port: 3001,
        server: "https",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Private-Network": "true",
        },
        client: {
            webSocketURL: {
                hostname: "localtest.me",
                pathname: "/ws",
                port: 3001,
                protocol: "wss",
            },
        },
        onListening: function () {
            setupDualPortBridge(3001, 3000);
        },
    },
});
