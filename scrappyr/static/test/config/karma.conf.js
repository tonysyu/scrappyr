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
            'node_modules/ng-tags-input/build/ng-tags-input.js',
            'js/**/*.js',
            'test/unit/**/*.js'
        ],
        autoWatch: true,
        singleRun: false,
        browsers: ['Chrome', 'Firefox']
    });
};
