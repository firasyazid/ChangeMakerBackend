const {Collaborater} = require('../models/collaborater');
const express = require('express');
const router = express.Router();
const { Category } = require('../models/categories');

 

router.get(`/`, async (req, res) =>{
    const collaboraterList = await Collaborater.find();

    if(!collaboraterList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(collaboraterList);
})


router.get('/:id', async(req,res)=>{
    const collaborater = await Collaborater.findById(req.params.id);

    if(!collaborater) {
        res.status(500).json({message: 'The Collaborater with the given ID was not found.'})
    } 
    res.status(200).send(collaborater);
}) 


router.post('/', async (req,res)=>{
    
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    let collaborater = new Collaborater({
        name: req.body.name,
        lastname: req.body.lastname,
        location: req.body.location,
        phone: req.body.phone,
        image: req.body.image,
        category: req.body.category,
    })
    collaborater = await collaborater.save();

    if(!collaborater)
    return res.status(400).send('the collaborater cannot be created!')

    res.send(collaborater);
})



router.delete('/:id', (req, res)=>{
    Collaborater.findByIdAndRemove(req.params.id).then(collaborater =>{
        if(collaborater) {
            return res.status(200).json({success: true, message: 'the collaborater is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "collaborater not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})


router.put('/:id',async (req, res)=> {
    const collaborater = await Collaborater.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            lastname: req.body.lastname,
            location: req.body.location,
            phone: req.body.phone,
            image: req.body.image,

        },
        { new: true}
    )

    if(!collaborater)
    return res.status(400).send('the collaborater cannot be created!')

    res.send(collaborater);
})

module.exports =router;