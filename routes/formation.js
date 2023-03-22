const {Formation} = require('../models/formation');
const express = require('express');
const router = express.Router();
const {Seance} = require('../models/formation');


router.get(`/`, async (req, res) =>{
    const formationList = await Formation.find();

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


router.post('/', async (req,res)=>{

    const seance = await Seance.findById(req.body.seances);
    if (!seance) return res.status(400).send('Invalid seance');

     let formation = new Formation({
        name: req.body.name,
        description: req.body.description,
        formateur: req.body.formateur,
        file: req.body.file,
        seances: req.body.seances
    })
    formation = await formation.save();

    if(!formation)
    return res.status(400).send('the formation cannot be created!')

    res.send(formation);
    
});
 

module.exports =router;
