module.exports = function override(config) {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false, // Exclude `crypto`
    };
    return config;
};
