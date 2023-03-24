const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Formation} = require('../models/formation');
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
  })

  const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) =>{
    const userList = await User.find().select('-passwordHash')
    .populate('formations','name');

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(userList);
});


router.get('/:id', async(req,res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) {
        res.status(500).json({message: 'The user with the given ID was not found.'})
    } 
    res.status(200).send(user);
}) ;


router.put('/:id',async (req, res)=> {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            adress:req.body.adress
         },
     )

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
});


 
router.post('/login', async (req,res) => {
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.secret;
    if(!user) {
        return res.status(400).send('The user not found');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn : '30d'}
        )
       
        res.status(200).send({user: user.email , token: token}) 
    } else {
       res.status(400).send('password is wrong!');
    }

    
})


router.get(`/get/count`, async (req, res) =>{
    const userCount = await User.countDocuments()
    if(!userCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        userCount: userCount
    });
})


router.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
});


 
  
  
  router.post('/',uploadOptions.single('image'), async (req, res) => {
    try {
      const { name, email, lastname, password, phone, isAdmin, adress, formations } = req.body;
  
      if (!name || !email || !lastname || !password || !phone || !adress )  {
        return res.status(400).send('Please provide all required fields');
      }
  
       if (isAdmin && typeof formations !== 'undefined' && formations.length > 0) {
        return res.status(400).send('Admin users cannot have formations');
      }
  
      let formation;
  
      if (formations) {
        try {
          formation = await Formation.findById(req.body.formations);
          if (!formation) {
            return res.status(400).send('Invalid formation');
          }
        } catch (error) {
          console.error(error);
          return res.status(500).send('Error finding formation');
        }
      }
      const imagePath = req.file ? `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}` : '';

      const passwordHash = await bcrypt.hash(password, 10);
  
      const user = new User({
        name,
        lastname,
        email,
        passwordHash,
        image: imagePath,
        phone,
        isAdmin,
        formations: formations || [],
        adress,
      });
   
      const savedUser = await user.save();
      res.send(savedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  
module.exports =router;