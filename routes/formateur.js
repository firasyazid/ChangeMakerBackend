const {Formateur} = require('../models/formateur');
const express = require('express');
const router = express.Router();
const {Formation} = require('../models/formation');


router.get(`/`, async (req, res) =>{
    const formateurList = await Formateur.find();

    if(!formateurList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(formateurList);
});

router.get('/:id', async(req,res)=>{
    const formateur = await Formateur.findById(req.params.id);

    if(!formateur) {
        res.status(500).json({message: 'The formateur with the given ID was not found.'})
    } 
    res.status(200).send(formateur);
}) ;

router.post('/', async (req,res)=>{

    const formation = await Formation.findById(req.body.formations);
    if (!formation) return res.status(400).send('Invalid formation');

     let formateur = new Formateur({
        name: req.body.name,
        lastname: req.body.lastname,
        adress: req.body.adress,
        phone: req.body.phone,
        image:req.body.image,
        formations:req.body.formations,

    })
    if (!formateur.name || !formateur.lastname || !formateur.adress || !formateur.phone) {
        return res.status(400).json({ message: 'Invalid formation: missing required information' });
      }
  
    formateur = await formateur.save();

    if(!formateur)
    return res.status(400).send('the formateur cannot be created!')

    res.send(formateur);
    
});

 
 router.delete('/:id', (req, res)=>{
        Formateur.findByIdAndRemove(req.params.id).then(formatueur =>{
            if(formatueur) {
                return res.status(200).json({success: true, message: 'the formatueur is deleted!'})
            } else {
                return res.status(404).json({success: false , message: "the formatueur is not found!"})
            }
        }).catch(err=>{
           return res.status(500).json({success: false, error: err}) 
        })
    });


 
 



module.exports =router;
