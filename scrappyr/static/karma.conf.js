/*global module*/

module.exports = function (config) {
    'use strict';

    config.set({
        basePath: './',
        frameworks: ['jasmine'],
        files: [
            // Include custom bundles first to ensure dependencies are included.
            'dist/*.js',
            'node_modules/mathjax/MathJax.js',
            'src/**/*.html',
            'test-context.js'
        ],
        autoWatch: true,
        singleRun: false,
        browsers: ['Firefox'],
        reporters: ['coverage', 'progress'],
        preprocessors: {
            'dist/*.js': ['coverage'],
            'src/**/*.html': ['ng-html2js'],
            'test-context.js': ['webpack']
        },
        coverageReporter: {
            dir: 'coverage/',
            type: 'html'
        },
        ngHtml2JsPreprocessor: {
            moduleName: 'my.templates',
            // Templates are loaded with relative paths (see *.html above),
            // but directives use "absolute" paths for URLs.
            stripPrefix: '.*src/',
            prependPrefix: '/static/src/'
        },
        webpack: {
            module: {
                loaders: [{
                    test: /\.js/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015']
                    }
                }]
            },
            watch: true
        }
    });
};
