'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    var tag = grunt.option('tag') || 'savings-commander';

    grunt.initConfig({
        mochacli: {
            options: {
                ui: 'bdd',
                files: ['tests/**/*.js', 'tests/**/**/*.js'],
                recursive: true,
                harmony: true
            },
            dev: {
                options: {
                    reporter: 'spec'
                }
            }
        },
        cucumberjs: {
            src: 'acceptance-tests/',
            options: {
                steps: "acceptance-tests/lib/steps",
                format: "pretty",
                modulePath: "../../cucumber/lib/cucumber.js"
            }
        }
    });

    grunt.registerTask('cucumber', [
        'cucumberjs'
    ]);

    grunt.registerTask('test', [
        'mochacli'
    ]);
};
