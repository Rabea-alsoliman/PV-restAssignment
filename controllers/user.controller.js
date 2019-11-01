const UserModel = require('../models/user.model');
const validator = require('validator');
const crypto = require('crypto');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

exports.uploadImg = multer({
    storage: storage, 
    limits: {
        fileSize: 2400000
    }, 
    fileFilter: fileFilter
});

exports.postUser = (req, res) => {
    return new Promise ((resolve, reject) => {

        if(!req.body.password) {
            res.send('the password shold not be Empity');
        } else if (validator.isLength(req.body.password, 6)){
            let salt = crypto.randomBytes(16).toString('base64');
            let hash = crypto.createHmac('sha512',salt).update(req.body.password).digest("base64");
            req.body.password = salt + "$" + hash;

            (!req.file ? req.body.userImg = " " : req.body.userImg = req.file.path);
            
            UserModel
                .createUser(req.body)
                .then((result) => {
                    res.send({id: result._id});
                })
                .catch(err => {
                    if (err) {
                        Object.keys(err.errors).forEach(function(key) {
                        let message = err.errors[key].message;
                        res.send("Validation error for" + key + message)
                        });
                    }
                })
        } else {
            res.send('the password shold not be lessthan 6 char');
        };
    });
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    UserModel.list(limit, page)
        .then((result) => {
            res.send(result);
        })
};

exports.getById = (req, res) => {
    UserModel.findById(req.params.userId)
        .then((result) => {
            res.send(result);
    });
};

exports.patchById = (req, res) => {
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }
    console.log(req.params.userId);
    UserModel.patchUser(req.params.userId, req.body)
        .then((result) => {
            res.send('Updated Done');
        });

};

exports.removeById = (req, res) => {
    UserModel.removeById(req.params.userId)
        .then((result)=>{
            res.send('Deleted Done');
        });
};
