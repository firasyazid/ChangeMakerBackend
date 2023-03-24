const {Ecole} = require('../models/ecole');
const express = require('express');
const router = express.Router();
const {Seance} = require('../models/seance');

router.get(`/`, async (req, res) =>{
    const ecoleList = await Ecole.find().populate('seances','dateSeance') ;


    if(!ecoleList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(ecoleList);
});

router.get('/:id', async(req,res)=>{
    const ecole = await Ecole.findById(req.params.id);

    if(!ecole) {
        res.status(500).json({message: 'The ecole with the given ID was not found.'})
    } 
    res.status(200).send(ecole);
});

router.delete('/:id', (req, res)=>{
    Ecole.findByIdAndRemove(req.params.id).then(ecole =>{
        if(ecole) {
            return res.status(200).json({success: true, message: 'the ecole is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "the ecole is not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
});

router.post('/', async (req,res)=>{

    try {
        const seance = await Seance.findById(req.body.seances);
        if (!seance) {
          return res.status(400).send('Invalid seance ID');
        }
      } catch (error) {
         return res.status(500).send('Invalid seance ID');
      }
          
     let ecole = new Ecole({
        name: req.body.name,
        location: req.body.location,
        seances: req.body.seances
    })
    ecole = await ecole.save();
    if(!ecole)
    return res.status(400).send('the ecole cannot be created!')
    res.send(ecole);
    
});
 

module.exports =router;
