module.exports = {
    entry: "./js/app.js",
    output: {
        path: __dirname,
        library: 'bundle',
        filename: "bundle.js"
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
