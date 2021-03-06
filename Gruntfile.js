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
            scripts: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>',
                dest: '<%= config.dist %>',
                src: ['<%= config.scripts %>/**/*.js']
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>',
                dest: '<%= config.dist %>',
                src: ['<%= config.styles %>/*']
            },
            images: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>',
                dest: '<%= config.dist %>',
                src: ['<%= config.images %>/**/*.{png,jpg,jpeg,gif,webp,svg}']
            },
            htmls: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>',
                dest: '<%= config.dist %>',
                src: [
                    'index.html',
                    'tpls/**/*.html'
                ]
            },
            libs: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>',
                dest: '<%= config.dist %>',
                src: [
                    'data/*',
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
                        'index.html',
                        '<%= config.styles %>/all.min.css',
                        'data/*',
                        '<%= config.images %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= config.scripts %>/*.js',
                        'tpls/**/*.html',
                        'lib/requirejs/require.js'
                    ]
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

        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/<%= config.images %>/',
                    src: ['**/*.{png,jpg,jpeg,gif,webp,svg}'],
                    dest: '<%= config.temp %>/img/'
                }]
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
        },

        usemin: {
           html: '<%= config.dist %>/*.html'
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            scripts: {
                files: ['<%= config.app %>/<%= config.scripts %>/{,*/}*.js'],
                tasks: ['copy:scripts']
            },
            styles: {
                files: ['<%= config.app %>/{,*/}*.css'],
                tasks: ['copy:styles']
            },
            images: {
                files: [ '<%= config.app %>/<%= config.images %>/{,*/}*'],
                tasks: ['copy:images']
            },
            htmls: {
                files: [
                    '<%= config.app %>/{,*/}*.html',
                    '<%= config.app %>/tpls/{,*/}*.html'
                ],
                tasks: ['copy:htmls']
            }
        },

        browserSync: {
            options: {
                notify: false,
                background: true,
                watchOptions: {
                    ignored: ''
                }
            },
            livereload: {
                options: {
                    files: [
                        '<%= config.dist %>/{,*/}*.html',
                        '<%= config.dist %>/{,*/}*.css',
                        '<%= config.dist %>/img/{,*/}*',
                        '<%= config.dist %>/js/{,*/}*.js'
                    ],
                    port: 9006,
                    server: {
                        baseDir: ['<%= config.dist %>']
                    }
                }
            }
        }
    });

    grunt.registerTask('debug', [
        'clean',
        'jshint',
        'copy:scripts',
        'copy:styles',
        'copy:images',
        'copy:htmls',
        'copy:libs'
    ]);

    grunt.registerTask('release', [
        'clean',
        'jshint',
        'requirejs',
        'concat',
        'cssmin',
        'imagemin',
        'copy:release',
        'usemin'
    ]);

    grunt.registerTask('serve', 'start the server and preview your app', function (target) {
        if (target === 'release') {
            grunt.task.run([
                'release'
            ]);
        } else {
            grunt.task.run([
                'debug'
            ]);
        }
        grunt.task.run([
            'browserSync:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('default', ['serve']);
};
