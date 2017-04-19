'use strict';

let express = require('express')
let router = express.Router();
import User from '../models/user'
const UserModel= new User();

router.get('/:username', function(req, res){
  UserModel.getProfile(req.params.username).then( res.send.bind(res) );
});

module.exports = router
