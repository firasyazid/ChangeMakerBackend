const {Seance} = require('../models/seance');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const formateurList = await Seance.find();

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

module.exports =router;
