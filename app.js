//入口文件编码
var express = require('express')  //加载express模块
var path = require('path')
var mongoose = require('mongoose')
var _=require('underscore')
var bodyParser = require('body-parser')
var Movie = require('./models/movie')
var User = require('./models/user')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var port = process.env.PORT || 3000 //设置端口 设置环境变量/process全局变量,获取外围参数
var app = express() //启动web服务器

mongoose.connect('mongodb://localhost/imooc')

app.set('views','./views/pages')//生产view engine的实例
app.set('view engine','jade') //设置默认的模板引擎jade
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())
app.use(session({
	secret:'imooc'
}))
app.use(express.static(path.join(__dirname,'public')))
app.locals.moment = require('moment')
app.listen(port)

console.log('bububang started on port '+ port)

//index page
app.get('/',function(req,res){
	console.log('user in session')
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('index',{
				title:'imooc首页' ,//首页传递变量
				movies:movies
				
		})
	})
})//路由规则和回调方法（req/res）



// signup
app.post('/user/signup',function(req,res){
	var _user= req.body.user
		console.log(_user)

	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err)
		}

		if(user){
			console.log(user)
			console.log('user has been signed up')
			return res.redirect('/')
		}
		else{
			var user = new User(_user)
			user.save(function(err,user){
				if(err){
					console.log(err)
				}

				res.redirect('/admin/userlist')
				console.log('a new user is created')
			})
		}	
	})

})

//signin page
app.post('/user/signin',function(req,res){
	var _user = req.body.user
	var name = _user.name
	var password = _user.password

	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err)
		}

		if(!user){
			console.log('user doesnot exit')
			return res.redirect('/')
		}

		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err)
			}

			if(isMatch){
				req.session.user = user   //服务器与客户端会话状态
				console.log('password is matched')
				return res.redirect('/')
			}
			else{
				console.log('password is not matched')
			}
		})
	})
})

//userlist page
app.get('/admin/userlist',function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}
		res.render('userlist',{
			title:'用户列表页',
			users:users
		})
	})
})


//detail page
app.get('/movie/:id',function(req,res){
	var id = req.params.id

	Movie.findById(id,function(err,movie){
		res.render('detail',{
			title:'imooc' + movie.title,
			movie:movie
		})
	})
})
//admin page
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'后台录入页',
		movie:{
			title:'',
			doctor:'',
			country:'',
			year:'',
			poster:'',
			flash:'',
			summary:'',
			language:''
		}
	})
})

// admin update movie
app.get('/admin/update/:id',function(req,res){
	var id = req.params.id

	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:'imooc 后台更新页',
				movie:movie
			})
		})
	}
})


//admin post movie
app.post('/admin/movie/new',function(req,res){
	var id = req.body.movie
	var movieObj = req.body.movie
	var _movie

	if(id !== 'undefined'){
		Movie.findById(id, function(err,movie){
			if(err){
				console.log(err)
			}

			_movie =_.extend(movie, movieObj)
			_movie.save(function(err,movie){
				if (err){
					console.log(err)
				}

				res.redirect('/movie/' + movie._id)
			})
		})
	}
	else{
		_movie = new Movie({
			doctor:movieObj.doctor,
			title:movieObj.title,
			country:movieObj.country,
			language:movieObj.language,
			year:movieObj.year,
			poster:movieObj.poster,
			summary:movieObj.summary,
			flash:movieObj.flash
		})

		_movie.save(function(err,movie){
			if (err){
				console.log(err)
			}

			res.redirect('/movie/' + movie._id)
		})
	}
})
//list page
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list',{
			title:'列表页',
			movies:movies
		})
	})
})


//list delete movie
app.delete('/admin/list',function(req,res){
	var id=req.query.id
	console.log(id)
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}
			else{
				res.json({success: 1})
			}		
		})
	}
})

