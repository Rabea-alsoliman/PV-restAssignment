const mongoose = require('../common/services/mongoose.service').mongoose;
const uniqueValidator = require('mongoose-unique-validator');

// smaple regex
//const emailRegexp = /.+\@.+\..+/;
const emailRegexp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {type: String, unique: true, trim: true},
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    email: {type: String, required: true, match: emailRegexp},
    password: {type: String, required: true},
    userImg: String
});

userSchema.plugin(uniqueValidator);
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
    virtuals: true
});

userSchema.findById = (cb) => {
    return this.model('User').find({id: this.id}, cb);
};
const User = mongoose.model('User', userSchema);
exports.findById = (id) => {
    return User.findById(id).then((result) => {
        result = result.toJSON();
        delete result._id;
        delete result.__v;
        return result;
    });
};
exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        User.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec((err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

exports.patchUser = (id, userData) => {
    return new Promise((resolve, reject) => {
        User.findById(id, (err, user) => {
            if (err) reject(err);
            for (let i in userData) {
                user[i] = userData[i];
            }
            user.save((err, updatedUser) => {
                if (err) return reject(err);
                resolve(updatedUser);
            });
        });
    })
};
exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        User.remove({_id: userId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};























// exports.createUser = (userData) => {
//     return new Promise ((resolve, reject) => {
//         mongoose.connect(DB_URL)
//         .then(() => {
//              let user = new User(userData)
//              return user.save()
//              resolve(result)
//         })
//         .then((result) => {
//             mongoose.disconnect()
//             resolve(result)
//         })
//         .catch(err => {
//             mongoose.disconnect()
//             reject(err)
//         })
//     }
// )}

// exports.createUser = (userData) => {
//     return new Promise ((resolve, reject) => {
        
// )}
// exports.createUser = (userData) => {
//     const user = new User(userData);
//     return user.save(err, (req, res, next) => {
//         res.send(err);
//     });
// };

// => {
// }
