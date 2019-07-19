var express = require('express');
const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');

const saltRounds = 10;

exports.createUser = function (req, res, next) {

    bcrypt.hash(req.body.password, saltRounds,function (err,hash) {

        if(err){
            next(err);
        }

        let promise  = new UserModel({
            username: req.body.username,
            fullName: req.body.fullName,
            entity: req.body.entity,
            groupId:req.body.groupId,
            email: req.body.email,
            password: hash
        }).save(function (err, obj) {
            if (err){
                next(err);
            } else{
                res.send(obj);
            }

        });

    })

}


exports.login = function (req,res, next) {

    UserModel.findOne({username:req.body.username}).then((user)=>{
        user.comparePassword(req.body.password,(err,isMatch)=>{
            if(isMatch){
                var token=jwt.sign({userId:user.id},process.env.TOKENKEY);
                res.status(200).json({
                    //userId:user.id,
                    username:user.username,
                    fullName:user.fullName,
                    groupId:user.groupId,
                    entity:user.entity,
                    token
                })
            }
            else{
                res.status(400).json({message:'Invalid Password/Username'});
            }
        })
    }).catch((err)=>{
        res.status(400).json({message:'Invalid Password/Username'});
    })

}
