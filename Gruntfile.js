'use strict';

module.exports = function(grunt) {
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Project settings
    mifosx: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist',
      target: 'community-app',
      test: 'test',
      almond: 'app/bower_components/almond'
    },
    watch: {
        js: {
            files: ['<%= mifosx.app %>/scripts/**/*.js'],
            options: {
                livereload: true
            }
        },
        scss: {
            files: ['<%= mifosx.app %>/styles-dev/**/*.scss'],
            tasks: ['compass:dev']
        },
        gruntfile: {
            files: ['Gruntfile.js']
        },
        livereload: {
            options: {
                livereload: '<%= connect.options.livereload %>'
            },

            files: [
                '<%= mifosx.app %>/**/*.html',
                '<%= mifosx.app %>/{,*/}*.json',
                '<%= mifosx.app %>/**/*.js',
                '<%= mifosx.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                // ignore directories to reduce CPU usage by watch/node process
                '!<%= mifosx.app %>/bower_components/**',
                // also ignore all css file changes
                '<%= mifosx.app %>/styles/*.css'
            ]
        }
    },
     // The actual grunt server settings
    connect: {
        options: {
            port:  9002,
            hostname: 'localhost',
            livereload: 35729,
            open:'http://<%= connect.options.hostname %>:<%= connect.options.port %>?baseApiUrl=https://demo.mifos.io'
        },
        livereload: {
            options: {
                base: [
                    '.tmp',
                    '<%= mifosx.app %>'
                ]
            }
        }
    },
    // w3c html validation
    validation: {
        options: {
            reset: true,
            relaxerror: ['no document type declaration; will parse without validation', 'document type does not allow element \\"[A-Z]+\\" here']
        },
        files: {
            src: [
                '<%= mifosx.app  %>/views/{,*/}*.html', // Validating templates may not be of much use.
                '<%= mifosx.app  %>/index.html'
                ]
        }
    },
    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        reporterOutput:'jshint-log.xml',
        force: true
      },
      all: ['Gruntfile.js', '<%= mifosx.app %>/scripts/**/*.js']
    },

    karma: {
      unit: {
          configFile: 'karma.conf.js'
      }
    },

    //uglify the js files
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      prod: {
        files: [{
          '<%= mifosx.dist %>/<%=mifosx.target%>/bower_components/angular-mocks/angular-mocks.min.js'
          :['<%= mifosx.app %>/bower_components/angular-mocks/angular-mocks.js'],
          '<%= mifosx.dist %>/<%=mifosx.target%>/bower_components/angular-webstorage/angular-webstorage.min.js'
          :['<%= mifosx.app %>/bower_components/angular-webstorage/angular-webstorage.js'],
          '<%= mifosx.dist %>/<%=mifosx.target%>/bower_components/q/q.min.js'
          :['<%= mifosx.app %>/bower_components/q/q.js'],
          //'<%= mifosx.dist %>/<%=mifosx.target%>/bower_components/datatables/media/js/jquery.dataTables.min.js'
          //:['<%= mifosx.app %>/bower_components/datatables/media/js/jquery.dataTables.js'],
          //'<%= mifosx.dist %>/<%=mifosx.target%>/bower_components/require-css/css.min.js'
          //:['<%= mifosx.app %>/bower_components/require-css/css.js'],
          //'<%= mifosx.dist %>/<%=mifosx.target%>/bower_components/requirejs/requirejs.min.js'
          //:['<%= mifosx.app %>/bower_components/requirejs/require.js'],
          '<%= mifosx.dist %>/<%=mifosx.target%>/bower_components/underscore/underscore.min.js'
          :['<%= mifosx.app %>/bower_components/underscore/underscore.js'],
           '<%= mifosx.dist %>/<%=mifosx.target%>/bower_components/angular-utils-pagination/dirPagination.min.js'
                :['<%= mifosx.app %>/bower_components/angular-utils-pagination/dirPagination.js']
        }]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= mifosx.dist %>/*',
            '!<%= mifosx.dist %>/.git*'
          ]
        }]
      },
      //trying to remove unused css files
      /*css: ['<%= mifosx.dist %>/<%=mifosx.target%>/styles/*.css', '!<%= mifosx.dist %>/<%=mifosx.target%>/styles/*.min.css'],*/
      server: '.tmp'
    },

    // Copies remaining files to places other tasks can use
    copy: {
      prod: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= mifosx.app %>',
          dest: '<%= mifosx.dist %>/<%=mifosx.target%>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '.nojekyll',
            'images/{,*/}*.{webp}',
            'fonts/*',
            'images/*',
            'scripts/*.js',
            'scripts/config/*.json',
            'scripts/services/*.js',
            'scripts/modules/*.js',
            '!scripts/routes.js',
            '!scripts/initialTasks.js',
            '!scripts/webstorage-configuration.js',
            '!scripts/mifosXComponents.js',
            '!scripts/mifosXComponents-build.js',
            '!scripts/loader.js',
            '!scripts/loader-build.js',
            'styles/**.css',
            '!scripts/mifosXStyles.js',
            '!scripts/mifosXStyles-build.js',
            'global-translations/**',
            '*.html',
            'release.json',
            'views/**',
            'angular/**'
          ]
        },
        {
          expand: true,
          dot: true,
          cwd: '<%= mifosx.test %>',
          dest: '<%= mifosx.dist %>/<%=mifosx.target%>/test',
          src: [
            '**/**'
          ]
        },
        {
          '<%= mifosx.dist %>/<%=mifosx.target%>/scripts/mifosXComponents.js':['<%= mifosx.app %>/scripts/mifosXComponents-build.js'],
          '<%= mifosx.dist %>/<%=mifosx.target%>/scripts/loader.js':['<%= mifosx.app %>/scripts/loader-build.js'],
          '<%=mifosx.dist %>/<%=mifosx.target%>/scripts/mifosXStyles.js':['<%=mifosx.app%>/scripts/mifosXStyles-build.js']
          //'<%= mifosx.dist %>/<%=mifosx.target%>':['<%= mifosx.test %>/**']
        },
        {
          expand: true,
          dot: true,
          cwd: '<%= mifosx.app %>/bower_components',
          dest: '<%= mifosx.dist %>/<%=mifosx.target%>/bower_components',
          src: [
            '**/*min.js', 'ckeditor/**', 'chosen/**', 'require-css/*.js', 'require-less/*.js',
            '!jasmine/**', '!requirejs/**/**', 'requirejs/require.js', '!underscore/**',
            'angular-utils-pagination/dirPagination.tpl.html'
          ]
        }
        ]
      },
      dev: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= mifosx.app %>',
          dest: '<%= mifosx.dist %>/<%=mifosx.target%>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'images/{,*/}*.{webp}',
            'fonts/*',
            'scripts/**/*.js',
            'global-translations/**',
            'styles/**',
            '*.html',
            'views/**',
            'images/**',
            'bower_components/**'
          ]
        },
        {
          expand: true,
          dot: true,
          cwd: '<%= mifosx.test %>',
          dest: '<%= mifosx.dist %>/<%=mifosx.target%>/test',
          src: [
            '**/**'
          ]
        }]
      },
        // this won't be necessary after fixing dependencies
        server: {
            expand: true,
            dot: true,
            cwd: '<%= mifosx.test %>',
            dest: '.tmp/test',
            src: '**/**'
        },
        tests: {
            expand: true,
            dot: true,
            cwd: '<%= mifosx.test %>',
            dest: '<%= mifosx.dist %>/<%= mifosx.target %>',
            src: '**/**'
        }
    },

      //hashing css & js
      hashres: {
          options: {
              encoding: 'utf8',
              fileNameFormat: '${name}.${hash}.${ext}',
              renameFiles: true
          },
          css: {
              options: {
              },
              dest: '<%= mifosx.dist %>/<%=mifosx.target%>/scripts/mifosXStyles.js',
              src: ['<%= mifosx.dist %>/<%=mifosx.target%>/styles/*.css','!<%= mifosx.dist %>/<%=mifosx.target%>/styles/font-awesome.min.css']
          },
          js: {
              options: {
              },
              dest: ['<%= mifosx.dist %>/<%=mifosx.target%>/scripts/mifosXComponents.js'],
              src:  [
                      '<%= mifosx.dist %>/<%=mifosx.target%>/scripts/directives/directives.js',
                      '<%= mifosx.dist %>/<%=mifosx.target%>/scripts/routes-initialTasks-webstorage-configuration.js',
                      '<%= mifosx.dist %>/<%=mifosx.target%>/scripts/controllers/controllers.js',
                      '<%= mifosx.dist %>/<%=mifosx.target%>/scripts/filters/filters.js',
                      '<%= mifosx.dist %>/<%=mifosx.target%>/scripts/models/models.js',
                      '<%= mifosx.dist %>/<%=mifosx.target%>/scripts/config/UIConfig.json'
              ]
          },
          ext : {
              options: {},
              dest: '<%= mifosx.dist %>/<%=mifosx.target%>/scripts/loader.js',
              src:   ['<%= mifosx.dist %>/<%=mifosx.target%>/scripts/mifosXComponents.js','<%= mifosx.dist %>/<%=mifosx.target%>/scripts/mifosXStyles.js']
          },
          loader : {
              options: {},
              src: '<%= mifosx.dist %>/<%=mifosx.target%>/scripts/loader.js',
              dest: '<%= mifosx.dist %>/<%=mifosx.target%>/index.html'
          }
      },

    // rename files
      replace: {
          text: {
              src: ['<%= mifosx.dist %>/<%=mifosx.target%>/scripts/mifosXComponents*','<%= mifosx.dist %>/<%=mifosx.target%>/scripts/loader*'],
              overwrite: true,
              replacements: [{
                  from: '.js',
                  to: ''
              }]
          }
      },
    // concatinate JS files
    /** FIXME: Address issues with this task**/
    concat: {
      options: {
        separator: ';'
      },
      //
      dist: {
        files: {
          '<%= mifosx.dist %>/<%=mifosx.target%>/scripts/controllers/controllers.js': ['<%= mifosx.app %>/scripts/controllers/**/*.js'],
          '<%= mifosx.dist %>/<%=mifosx.target%>/scripts/directives/directives.js': ['<%= mifosx.app %>/scripts/directives/**/*.js'],
          '<%= mifosx.dist %>/<%=mifosx.target%>/scripts/models/models.js': ['<%= mifosx.app %>/scripts/models/**/*.js'],
          //'<%= mifosx.dist %>/<%=mifosx.target%>/scripts/services/services.js': ['<%= mifosx.app %>/scripts/services/**/*.js'],
          '<%= mifosx.dist %>/<%=mifosx.target%>/scripts/filters/filters.js': ['<%= mifosx.app %>/scripts/filters/**/*.js'],
          '<%= mifosx.dist %>/<%=mifosx.target%>/scripts/routes-initialTasks-webstorage-configuration.js':
            ['<%= mifosx.app %>/scripts/routes.js',
            '<%= mifosx.app %>/scripts/initialTasks.js',
            '<%= mifosx.app %>/scripts/webstorage-configuration.js']
        }
      }

      //trying to concatenat css files
      /*css: {
        files: {
          '<%= mifosx.dist %>/<%=mifosx.target%>/styles/mifosXstyle.css':
          ['<%= mifosx.app %>/styles/app.css',
          '<%= mifosx.app %>/styles/bootstrap-ext.css',
          '<%= mifosx.app %>/styles/bootswatch.css',
          '<%= mifosx.app %>/styles/style.css'],

          '<%= mifosx.dist %>/<%=mifosx.target%>/styles/vendorStyle.css':
          ['<%= mifosx.app %>/styles/bootstrap.min.css',
          '<%= mifosx.app %>/styles/chosen.min.css',
          '<%= mifosx.app %>/styles/font-awesome.min.css',
          '<%= mifosx.app %>/styles/nv.d3.css',
          '<%= mifosx.app %>/styles/ui-bootstrap-csp.css'],
        }
      }*/
    },

    //here is the task for the grunt-contrib-requirejs
    requirejs: {
      compile: {
        options: {
          name: '../bower_components/almond/almond',
          baseUrl: './app',
          mainConfigFile: '<%= mifosx.app %>/scripts/loader.js',
          out: '<%= mifosx.dist %>/finaljs/app.js'
        }
      }
    },

    preprocess: {

      dist: {
        src: ['dist/**/*.js','dist/**/*.html','dist/*.js','dist/*.html'],
        dst: ['dist/'],
        options: {
            inline: true,
            context: {
              DEBUG: false,
              NODE_ENV: 'production'
            }
        }

      }
    },

    //compass task to compile scss to css files
    compass: {                  // Task
        dist: {                   // Target
          options: {              // Target options
            sassDir: 'app/styles-dev/',
            cssDir: 'app/styles/',
            environment: 'production',
            require: 'sass-css-importer',
            outputStyle: 'compressed',
          }
        },
        dev: {                    // Another target
          options: {
            sassDir: 'app/styles-dev/',
            cssDir: 'app/styles/',
            environment: 'development',
            require: 'sass-css-importer',
            outputStyle: 'expanded',
          }
        }
    },
    //cssmin task to concatenate and minified css file while running the grunt prod
    /*cssmin: {
      target: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= mifosx.dist %>/<%=mifosx.target%>/styles/',
          src: ['styles.css'],
          dest: '<%= mifosx.dist %>/<%=mifosx.target%>/styles/',
          ext: '.min.css'
        }]
      }
    }*/
      'gh-pages': {
          options: {
              base: 'dist/community-app',
              branch: 'gh-pages',
              dotfiles: true
          },
          src: '**/*'
      }

  });

  grunt.loadNpmTasks('grunt-gh-pages')

  // Run development server using grunt serve
  grunt.registerTask('serve', ['clean:server', 'copy:server', 'compass:dev', 'connect:livereload', 'watch']);

  // Validate JavaScript and HTML files
  grunt.registerTask('validate', ['jshint:all', 'validation']);

  // Default task(s).
  grunt.registerTask('default', ['clean', 'jshint', 'copy:dev']);
  grunt.registerTask('prod', ['clean:dist', 'clean:server', 'compass:dist', 'copy:prod', 'copy:tests', 'concat', 'uglify:prod', 'preprocess:dist', 'hashres', 'replace']);
  grunt.registerTask('dev', ['clean', 'compass:dev', 'copy:dev']);
  grunt.registerTask('test', ['karma']);
  grunt.registerTask('deploy', ['prod', 'gh-pages']);

};