'use strict';


module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.initConfig({

        // Project settings
        config: {
            // configurable paths
            app: 'www-dev',
            styles: 'css',
            images: 'img',
            scripts: 'js',
            temp: 'temp',
            dist: 'www'
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                //'Gruntfile.js',
                '<%= config.app %>/<%= config.scripts %>/**/*.js'
            ]
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.temp %>/*',
                        '<%= config.dist %>/*'
                    ]
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            debug: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>',
                dest: '<%= config.dist %>',
                src: [
                    '<%= config.styles %>/*',
                    'data/*',
                    '<%= config.images %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= config.scripts %>/**/*.js',
                    '*.html',
                    'tpls/**/*.html',
                    'lib/ionic/release/css/ionic.css',
                    'lib/ionic/release/fonts/*',
                    'lib/ionic/release/js/ionic.bundle.js',
                    'lib/ng-debounce/angular-debounce.js',
                    'lib/ngCordova/dist/ng-cordova.js',
                    'lib/requirejs/require.js'
                ]
            },
            release: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.temp %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '<%= config.styles %>/all.min.css',
                        'data/*',
                        '<%= config.images %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= config.scripts %>/*.js',
                        'tpls/**/*.html',
                        'lib/requirejs/require.js'
                    ]
                }, {
                    dest: '<%= config.dist %>/index.html',
                    src: '<%= config.temp %>/index-release.html'
                }, {
                    expand: true,
                    cwd: '<%= config.temp %>/lib/ionic/release/fonts/',
                    dest: '<%= config.dist %>/fonts/',
                    src: '*'
                }]
            }
        },

        concat: {
            css: {
                src: [
                    '<%= config.app %>/lib/ionic/release/css/ionic.css',
                    '<%= config.app %>/<%= config.styles %>/*'
                ],
                dest: '<%= config.temp %>/css/all.css'
            }
        },
        cssmin: {
            css: {
                src: '<%= config.temp %>/css/all.css',
                dest: '<%= config.temp %>/css/all.min.css'
            }
        },

        requirejs: {
            app: {
                options: {
                    appDir: '<%= config.app %>',
                    mainConfigFile: '<%= config.app %>/<%= config.scripts %>/main.js',
                    dir: '<%= config.temp %>',
                    modules: [
                        {
                            name: 'app'
                        }
                    ]
                }
            }
        }
    });

    grunt.registerTask('debug', ['clean', 'jshint', 'copy:debug']);

    grunt.registerTask('release', [
        'clean',
        'jshint',
        'requirejs',
        'concat',
        'cssmin',
        'copy:release'
    ]);

    grunt.registerTask('default', ['release']);
};
