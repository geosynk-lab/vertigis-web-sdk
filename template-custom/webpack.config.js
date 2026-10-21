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
                  port: 3001,
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
