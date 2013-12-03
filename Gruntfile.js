 
'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Project settings
    mifosx: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        node: true,
        jshintrc: true,
        reporter:'checkstyle',
        reporterOutput:'jshint-log.xml'
      },
      all: ['Gruntfile.js', '<%= mifosx.app %>/scripts/**/*.js']
    },

    //uglify the js files
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      prod: {
        files: [{'<%= mifosx.dist %>/bower_components/angular-mocks/angular-mocks.min.js'
          :['<%= mifosx.app %>/bower_components/angular-mocks/angular-mocks.js'],
          '<%= mifosx.dist %>/bower_components/angular-webstorage/angular-webstorage.min.js'
          :['<%= mifosx.app %>/bower_components/angular-webstorage/angular-webstorage.js'],
          '<%= mifosx.dist %>/bower_components/ckeditor/ckeditor.min.js'
          :['<%= mifosx.app %>/bower_components/ckeditor/ckeditor.js'],
          '<%= mifosx.dist %>/bower_components/datatables/media/js/jquery.dataTables.min.js'
          :['<%= mifosx.app %>/bower_components/datatables/media/js/jquery.dataTables.js'],
          //'<%= mifosx.dist %>/bower_components/require-css/css.min.js'
          //:['<%= mifosx.app %>/bower_components/require-css/css.js'],
          //'<%= mifosx.dist %>/bower_components/require-less/less.min.js'
          //:['<%= mifosx.app %>/bower_components/require-less/less.js'],
          //'<%= mifosx.dist %>/bower_components/requirejs/requirejs.min.js'
          //:['<%= mifosx.app %>/bower_components/requirejs/require.js'],
          '<%= mifosx.dist %>/bower_components/underscore/underscore.min.js'
          :['<%= mifosx.app %>/bower_components/underscore/underscore.js']
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
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      prod: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= mifosx.app %>',
          dest: '<%= mifosx.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'images/{,*/}*.{webp}',
            'fonts/*',
            'scripts/*.js',
            'scripts/services/*.js',
            'scripts/modules/*.js',
            '!scripts/routes.js',
            '!scripts/initialTasks.js',
            '!scripts/webstorage-configuration.js',
            '!scripts/mifosXComponents.js',
            '!scripts/mifosXComponents-build.js',
            '!scripts/loader.js',
            '!scripts/loader-build.js',
            'global-translations/**',
            'styles/**',
            '*.html',
            'views/**',
            'images/**',
          ]
        },
        {
          '<%= mifosx.dist %>/scripts/mifosXComponents.js':['<%= mifosx.app %>/scripts/mifosXComponents-build.js'],
          '<%= mifosx.dist %>/scripts/loader.js':['<%= mifosx.app %>/scripts/loader-build.js']
        },
        {
          expand: true,
          dot: true,
          cwd: '<%= mifosx.app %>/bower_components',
          dest: '<%= mifosx.dist %>/bower_components',
          src: [
            '**/*min.js', 'require-css/*.js', 'require-less/*.js', 
            '!jasmine/**', '!requirejs/**/**', 'requirejs/require.js', '!underscore/**'
          ]
        }
        ]
      },
      dev: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= mifosx.app %>',
          dest: '<%= mifosx.dist %>',
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
        }]
      }
    },
    
    // concatinate JS files
    /** FIXME: Address issues with this task**/
    concat: {
      options: {
        separator: ';',
      },
      //
      dist: {
        files: {
          '<%= mifosx.dist %>/scripts/controllers/controllers.js': ['<%= mifosx.app %>/scripts/controllers/**/*.js'],
          '<%= mifosx.dist %>/scripts/directives/directives.js': ['<%= mifosx.app %>/scripts/directives/**/*.js'],
          '<%= mifosx.dist %>/scripts/models/models.js': ['<%= mifosx.app %>/scripts/models/**/*.js'],
          //'<%= mifosx.dist %>/scripts/services/services.js': ['<%= mifosx.app %>/scripts/services/**/*.js'],
          '<%= mifosx.dist %>/scripts/filters/filters.js': ['<%= mifosx.app %>/scripts/filters/**/*.js'],
          '<%= mifosx.dist %>/scripts/routes-initialTasks-webstorage-configuration.js': 
            ['<%= mifosx.app %>/scripts/routes.js', 
            '<%= mifosx.app %>/scripts/initialTasks.js', 
            '<%= mifosx.app %>/scripts/webstorage-configuration.js']
        }
      }
    },
    //FIXME: Address issues with requirejs task
    requirejs: {
      compile: {
        options: {
          baseUrl: '<%= mifosx.app %>',
          mainConfigFile: '<%= mifosx.app %>/scripts/loader.js',
          out: '<%= mifosx.dist %>/loader.js'
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
      
  grunt.registerTask('default', ['clean', 'jshint', 'copy:dev']);
  grunt.registerTask('prod', ['clean', 'copy:prod', 'concat', 'uglify:prod']);
  grunt.registerTask('dev', ['clean', 'copy:dev']);
  grunt.registerTask('compile', ['jshint']);

};