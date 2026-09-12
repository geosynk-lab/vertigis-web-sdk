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

export default merge(defaultWebpackConfig, {
    // Add custom webpack configuration for your project here.
});

