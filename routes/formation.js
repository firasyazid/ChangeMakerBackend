const {Formation} = require('../models/formation');
const express = require('express');
const router = express.Router();
const {Seance} = require('../models/seance');
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
        let uploadError = new Error('invalid file type');

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
    const formationList = await Formation.find().populate('seances','dateSeance') ;


    if(!formationList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(formationList);
});


 router.get('/:id', async(req,res)=>{
    const formation = await Formation.findById(req.params.id);

    if(!formation) {
        res.status(500).json({message: 'The formation with the given ID was not found.'})
    } 
    res.status(200).send(formation);
});

router.delete('/:id', (req, res)=>{
    Formation.findByIdAndRemove(req.params.id).then(formation =>{
        if(formation) {
            return res.status(200).json({success: true, message: 'the formation is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "the formation is not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
});


router.post('/',uploadOptions.array('file', 10), async (req,res)=>{

    try {
        const seance = await Seance.findById(req.body.seances);
        if (!seance) {
          return res.status(400).send('Invalid seance ID');
        }
      } catch (error) {
         return res.status(500).send('Invalid seance ID');
      }
      const filePaths = req.files.map((file) => {
        return `${req.protocol}://${req.get('host')}/public/files/${file.filename}`;
      });

     let formation = new Formation({
        name: req.body.name,
        description: req.body.description,
        file: filePaths,
        seances: req.body.seances,
     })
    formation = await formation.save();

    if(!formation)
    return res.status(400).send('the formation cannot be created!')

    res.send(formation);
    
});
 

module.exports =router;
