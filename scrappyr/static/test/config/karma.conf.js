/*global module*/

module.exports = function (config) {
    'use strict';

    config.set({
        basePath: '../../',
        frameworks: ['jasmine'],
        files: [
            'node_modules/angular/angular.js',
            'node_modules/angular-route/angular-route.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/angular-sanitize/angular-sanitize.js',
            'node_modules/mathjax/MathJax.js',
            'node_modules/ng-tags-input/build/ng-tags-input.js',
            'js/**/*.js',
            'templates/*.html',
            'test/unit/**/*.js'
        ],
        autoWatch: true,
        singleRun: false,
        browsers: ['Firefox'],
        preprocessors: {
            'templates/*.html': ['ng-html2js']
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
