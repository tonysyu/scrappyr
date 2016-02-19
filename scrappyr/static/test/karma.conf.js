/*global module*/

module.exports = function (config) {
    'use strict';

    config.set({
        basePath: '../',
        frameworks: ['jasmine'],
        files: [
            // Include bundle.js first to ensure dependencies are included.
            'bundle.js',
            'node_modules/mathjax/MathJax.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'templates/*.html',
            'test/unit/**/*.js'
        ],
        autoWatch: true,
        singleRun: false,
        browsers: ['Firefox'],
        reporters: ['coverage', 'progress'],
        preprocessors: {
            'js/**/*.js': ['coverage'],
            'templates/*.html': ['ng-html2js']
        },
        plugins: [
            require("karma-coverage"),
            require("karma-firefox-launcher"),
            require("karma-jasmine"),
            require("karma-ng-html2js-preprocessor"),
        ],
        coverageReporter: {
            dir: 'coverage/',
            type: 'html'
        },
        ngHtml2JsPreprocessor: {
            moduleName: 'my.templates',
            // Some users report full paths are appended to templates.
            // Strip and add back the templates directory just in case.
            stripPrefix: '.*templates/',
            prependPrefix: '/static/templates/'
        }
    });
};
