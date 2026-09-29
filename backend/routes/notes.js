const express = require ('express');
const router = express.Router();
const note = require('../models/Notes');

router.post('/',async(req,res,next)=>{
    try{
        const {title,content,ownerId} = req.body;
        const note = await Note.create({title,content,owner:ownerId});
        res.status(201).json (note);      
    }catch(err) {next (err);}
});

router.get('/',async(req,res,next)=>{
    try{
        const note = await Note.find({owner: req.query.ownerId});   
        res.json(note);      
    }catch(err) {next(err);}
});

router.put('/',async(req,res,next)=>{
    try{
        const note = await Note.findByIdAndUpdate(req.params.id, req.body,{new:true});
        if(!note) return res.status(409).json ({error : "Note not found"});
        res.json(note);
    }catch(err) {next(err);}
});

router.delete('/',async(req,res,next)=>{
    try{
        await Note.findByIdAndDelete(req.params.id);
        res.status(204).send();
    }catch(err) {next(err);}
});
module.exports = router;