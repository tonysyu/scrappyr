module.exports = {
    entry: {
        core: ["./src/core/index.js"],
        coreUI: ["./src/core-ui/index.js"],
        app: ["./src/ng-app/index.js"],
    },
    output: {
        path: __dirname,
        library: '[name]Bundle',
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
