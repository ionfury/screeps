module.exports = function(grunt) {
    var config = require('./.screeps.json')
    //var branch = grunt.option('branch') || config.branch;
    var email = grunt.option('email') || config.email;
    var password = grunt.option('password') || config.password;
    var ptr = grunt.option('ptr') ? true : config.ptr

    grunt.loadNpmTasks('grunt-screeps')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-copy')

    grunt.initConfig({
        screeps: {
            options: {
                email: email,
                password: password,
                branch: 'default',
                ptr: ptr
            },
            dist: {
                src: ['save/*.js']
            }
        },

        // Remove all files from the dist folder.
        clean: {
            save: ['save/*'],  
            rollback: ['rollback/*']
        },

        // Copy all source files into the dist folder, flattening the folder structure by converting path delimiters to underscores
        copy: {
          // Pushes the game code to the dist folder so it can be modified before being send to the screeps server.
          screeps: {
            files: [{
              expand: true,
              cwd: 'src/',
              src: '**',
              dest: 'save/',
              filter: 'isFile',
              rename: function (dest, src) {
                // Change the path name utilize underscores for folders
                return dest + src.replace(/\//g,'.');
              }
            }],
          },
          //Copy the existing 'dist' folder into the 'rollback' folder
          save: {
              expand: true,
              cwd: 'save/',
              src: '**',
              dest: 'rollback/'
          },
          rollback: {
              expand: true,
              cwd: 'rollback/',
              src: '**',
              dest: 'save/'
          }
        },
    })

    grunt.registerTask('default', [
        'clean:rollback',
        'copy:save', 
        'clean:save', 
        'copy:screeps', 
        'screeps'
    ]);
    grunt.registerTask('rollback', [
        'clean:save',
        'copy:rollback',
        'screeps'
    ]);
}