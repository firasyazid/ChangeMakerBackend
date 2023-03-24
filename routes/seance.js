const {Seance} = require('../models/seance');
const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const {Formation} = require('../models/formation');
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'application/pdf': 'pdf',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
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
    const seanceList = await Seance.find().populate('user','name email')
    .populate('formation','name description');

    if(!seanceList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(seanceList);
});


router.get('/:id', async(req,res)=>{
    const seance = await Seance.findById(req.params.id);

    if(!seance) {
        res.status(500).json({message: 'The seance with the given ID was not found.'})
    } 
    res.status(200).send(seance);
});


router.post('/', uploadOptions.fields([{ name: 'procesVerbal', maxCount: 10 }, { name: 'picture', maxCount: 1 }]), async (req, res) => {

    try{

    const user = await User.findById(req.body.user);
    if (!user) return res.status(400).send('Invalid user');
} catch (error) {
    console.error(error);
    return res.status(500).send('Invalid user');
  }


try{
    const formation = await Formation.findById(req.body.formation);
    if (!formation) return res.status(400).send('Invalid formation');
} catch (error) {
    console.error(error);
    return res.status(500).send('Invalid formation');
  }


  const filePaths = req.files['procesVerbal'].map((file) => {
    return `${req.protocol}://${req.get('host')}/public/files/${file.filename}`;
  });

  const picturePath = req.files['picture'] ? `${req.protocol}://${req.get('host')}/public/files/${req.files['picture'][0].filename}` : '';

 
     let seance = new Seance({
        name: req.body.name,
        description: req.body.description,
        dateFormation: req.body.dateFormation,
        user: req.body.user,
        formation: req.body.formation,
        procesVerbal: filePaths,
        picture: picturePath

        
    });
    seance = await seance.save();
    if(!seance)
    return res.status(400).send('the seance cannot be created!')
    res.send(seance);
});
module.exports =router;
