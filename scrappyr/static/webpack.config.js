module.exports = {
    entry: {
        app: "./src/app.js",
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
