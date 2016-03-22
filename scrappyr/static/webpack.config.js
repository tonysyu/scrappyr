module.exports = {
    entry: {
        core: "./src/core/index.js",
        app: "./src/ng-ui/index.js",
    },
    output: {
        path: __dirname,
        library: '[name]Bundle',
        filename: "[name]Bundle.js"
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
