module.exports = function(grunt) {
    grunt.initConfig({
        copy: {
            site: {
                expand: true,
                cwd: 'output',
                src: '**',
                dest: 'deploy'
            },
            index: {
                files: [{
                    cwd: 'output/en',
                    src: 'index.html',
                    dest: 'deploy',
                    expand: true
                }]
            }
        },
        clean: {
            grunt: ['deploy'],
            nanoc: ['output']
        },
        autoprefixer: {
            site: {
                expand: true,
                flatten: true,
                src: 'deploy/css/*.css',
                dest: 'deploy/css/'
            }
        },
        htmlcompressor: {
            site: {
                expand: true,
                cwd: 'deploy',
                src: '**/*.html',
                dest: 'deploy'
            }
        },
        imagemin: {
            site: {
                options: {
                  pngquant: true
                },
                files: [{
                  cwd: 'output/',
                  src: ['**/*.{png,gif,jpg}'],
                  dest: 'deploy/',
                  expand: true
                }]
            }
        },
        replace: {
            html: {
                src: ['deploy/**/*.html'],
                overwrite: true,
                replacements: [{
                    from: /build:css \/css\/([^ ]+)(.*href=")(.*)\/css\//,
                    to: 'build:css $3/css/$1$2$3/css/'
                },
                {
                    from: /build:js \/js\/([^ ]+)(.*href=")(.*)\/js\//,
                    to: 'build:js $3/js/$1$2$3/js/'
                }]
            },
            index: {
                src: ['deploy/index.html'],
                overwrite: true,
                replacements: [
                    { from: '../', to: '' },
                    { from: /href="(((?!css\/|js\/|img\/|https:\/\/|http:\/\/|javadoc|pt|en)).*)"/g, to: 'href="en/$1"' }
                ]
            }
        },
        useminPreparePrepare: {
            html: 'deploy/**/*.html',
            options: {
              src: 'deploy',
              dest: 'deploy'
            }
        },
        usemin: {
            html: 'deploy/**/*.html',
            options: {
              dest: 'deploy'
            }
        },
        'gh-pages': {
            options: {
                base: 'deploy',
                add: true /* keep the old files and those generated by javadoc */
            },
            src: ['**']
        },
        shell: {
            nanoc: {
                command: 'bundle exec nanoc'
            }
        },
        uglify: {
            headers: {
                src: 'output/js/headers.js',
                dest: 'deploy/js/headers.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-htmlcompressor');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadTasks('grunt-utils/tasks');

    grunt.registerTask('default', ['clean:grunt', 'copy', 'imagemin', 'replace', 'useminPreparePrepare', 'useminPrepare', 'usemin', 'autoprefixer', 'concat', 'cssmin', 'uglify:headers', 'htmlcompressor']);
    grunt.registerTask('deploy', ['clean:nanoc', 'shell:nanoc', 'default', 'gh-pages']);
};
