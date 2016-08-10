module.exports = function(grunt){

	grunt.initConfig({
		watch:{
			jade:{
				files:['views/**'],
				options:{
					livereload:true //文件有改动时重新启动服务
				}
			},
			js:{
				files:['public/js/**','models/**/*.js','schemas/**/*.js'],
				//tasks:['jshint'],//语法检查
				options:{
					livereload:true
				}
			}
		},

		nodemon:{
			dev:{ //开发文件
				options:{
					file:'app.js',
					args:[],
					ignoredFiles:['README.md','node_modules/**','.DS_Store'],
					watchedExtensions:['js'],
					watchedFolders:['./'],      //['app','config'],
					debug:true,
					delayTime:1,
					env:{
						PORT:3000
					},
					cwd:__dirname
				}
			}
		},

		pkg:grunt.file.readJSON('package.json'),

		concurrent:{
			tasks:['nodemon','watch'],
			options:{
				logConcurrentOutput:true
			}
		}
	})
	

	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-nodemon')
	grunt.loadNpmTasks('grunt-concurrent')


	grunt.option('force',true)
	grunt.registerTask('default',['concurrent']);
}