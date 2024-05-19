// const esModules = ['@axios'].join('|'); 

module.exports = {
    transformIgnorePatterns: [
        "node_modules/(?!axios.*)"
    ],
}
