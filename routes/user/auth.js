var express = require('express');
const auth = require('../../middeleware/auth');
var router = express.Router();
const User = require('../../models/user');

router.post('/login',async (req,res)=>{
    try {
      const user = await User.findByCredentials(req.body.email, req.body.password);
      const token = await user.generateAuthToken();
      const userdata = JSON.stringify({ user, token });
      res.send({'status'  : 200,
      'message' : 'Success',
      'data'    : userdata})
  } catch (e) {
    console.log(e.message);
      res.status(200).send({'status'  : 400,
      'message' : 'error',
      'data'    : 'Credentials not matches'});
  }
  });

  router.post('/signin',async (req,res)=>{
    const user = new User(req.body);
    user.save().then(() => {
            const token = user.generateAuthToken();
            return token
        }).then((token) => {
          const userdata = JSON.stringify({ user, token });
            res.send({'status'  : 200,
            'message' : 'Success',
            'data'    : userdata})
        })
        .catch((e) => {
            if (e.name === "ValidationError") {
                let errors = {};
          
                Object.keys(e.errors).forEach((key) => {
                  errors[key] = e.errors[key].message;
                });
          
                res.status(200).send({'status'  : 400,
                                            'message' : 'error',
                                            'data'    : errors});
              }else{
                console.log(e.message);
            res.status(400).send(e.message);
              }
            
        })
  });
  router.get('/checkauth',auth,async (req,res)=>{
    res.send('login');
  });
  router.get('/logout', auth, async(req, res) => {
    console.log('logout');
  try {
      req.user.tokens = req.user.tokens.filter((token) => {
          return token.token !== req.token
      })
      await req.user.save();
      res.send();
  } catch (e) {
      res.status(404).send();
  }
})

module.exports = router;