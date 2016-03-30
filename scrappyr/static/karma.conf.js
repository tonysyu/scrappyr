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
            'node_modules/angular-mocks/angular-mocks.js',
            'src/**/*.html',
            'test/**/*.js'
        ],
        autoWatch: true,
        singleRun: false,
        browsers: ['Firefox'],
        reporters: ['coverage', 'progress'],
        preprocessors: {
            'dist/*.js': ['coverage'],
            'src/**/*.html': ['ng-html2js']
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
        }
    });
};
