import fs from "node:fs";
import path from "node:path";

let defaultWebpackConfig, merge;
try {
    const mod = await import("@vertigis/web-sdk/config/webpack.config.js");
    defaultWebpackConfig = mod.default;
    merge = mod.merge;
} catch {
    const mod = await import("@geosynk/vertigis-web-sdk/config/webpack.config.js");
    defaultWebpackConfig = mod.default;
    merge = mod.merge;
}

const isProduction = process.env.NODE_ENV === "production";

// Use the certificate from certs/ (made by certs/generate-cert.sh or .bat). It covers localtest.me and localhost.
// Without it, webpack-dev-server makes its own certificate, and that certificate does not cover localtest.me.
const certDir = path.join(import.meta.dirname, "certs");
const keyFile = path.join(certDir, "key.pem");
const certFile = path.join(certDir, "cert.pem");
const hasCert = fs.existsSync(keyFile) && fs.existsSync(certFile);

export default merge(defaultWebpackConfig, {
    // 1. Filesystem caching to dramatically speed up rebuild times
    cache: {
        type: "filesystem",
        buildDependencies: {
            config: [import.meta.filename],
        },
    },

    // 2. Production build: Clean, lean, zero devServer overrides or reverse proxies
    ...(isProduction
        ? {}
        : {
              devServer: {
                  host: "0.0.0.0",
                  port: 3001,
                  ...(hasCert
                      ? {
                            server: {
                                type: "https",
                                options: {
                                    key: fs.readFileSync(keyFile),
                                    cert: fs.readFileSync(certFile),
                                },
                            },
                        }
                      : {}),
                  allowedHosts: "all",
                  headers: {
                      "Access-Control-Allow-Origin": "*",
                      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                      "Access-Control-Allow-Headers": "*",
                      "Access-Control-Allow-Private-Network": "true",
                  },
                  client: {
                      overlay: {
                          errors: true,
                          warnings: false,
                          runtimeErrors: false,
                      },
                  },
              },
          }),
});
