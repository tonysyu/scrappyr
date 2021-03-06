module.exports = {
    entry: {
        core: ["./src/core/index.js"],
        coreUI: ["./src/core-ui/index.js"],
        ngApp: ["./src/ng-app/index.js"],
    },
    output: {
        path: __dirname,
        library: '[name]Bundle',
        publicPath: '/static/',
        filename: "dist/[name]Bundle.js"
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
}
