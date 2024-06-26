const User = require('../models/user')
const bcrypt = require('bcryptjs');

exports.getLogin = (req,res,next)=>{
    let message = req.flash('error');
    if(message.length>0){
      message = message[0];
    }else{
      message = null
    }
    console.log(message);
    res.render('auth/login',{
        path:'/login',
        pageTitle:'Login Page',
        isAuthenticated:req.session.isLoggedIn,
        errorMessage:req.flash('error')
        
    })
}

exports.getSignup = (req,res,next) =>{
  let message = req.flash('error');
  if(message.length==0){
    message = null;
  }
  res.render('auth/signup',{
    path:'/signup',
    pageTitle :'Signup Page',
    isAuthenticated:req.session.isLoggedIn,
    errorMessage:message
    
  })
}

exports.postLogin = (req,res,next)=>{
   const email = req.body.email;
   const password = req.body.password;
   User.findOne({email:email})
   .then((user) => {
    if(!user){
      req.flash('error','Invalid Email!')
      res.redirect('/login');
    }
    bcrypt.compare(password,user.password).then(doMatch=>{
      if(doMatch) {
        req.session.user = user;
        req.session.isLoggedIn = true;
        //console.log(req.user);
        return req.session.save(err=>{
        res.redirect('/');
     })
      }
      res.redirect('/login');
    }).catch(err=>{
      console.log(err);
      res.redirect('/login');
    })
     //req.user = user;
     
   })
   .catch((err) => {
     console.log(err);
   });
}
exports.postLogout = (req,res,next)=>{
    req.session.destroy(() =>{
        res.redirect('/');
    })
}

exports.postSignup = (req,res,next) =>{
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  
  
    User.findOne({email:email}).then(userDoc=>{
      if(userDoc){
        req.flash('error','Email already Exist, Please enter different one!');
        return res.redirect('/signup');
      }
      return bcrypt.hash(password,12).then(hashedPassword=>{
      const user = new User({
        email:email,
        password:hashedPassword,
        cart:{ item:[]}
      });
       user.save();
  
    }).then(result => {
      res.redirect('/login');
     })
  }).catch(err=>{
    console.log(err);
  })
  
}