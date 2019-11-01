const UsersController = require('../controllers/user.controller');
const uploadImg = require('../controllers/user.controller').uploadImg;

exports.routesConfig = (app) => {
    
    app.post('/user', uploadImg.single('userImg'), UsersController.postUser);

    app.get('/user', UsersController.list);

    app.get('/user/:userId', UsersController.getById);
    
    app.patch('/user/:userId', UsersController.patchById);

    app.delete('/user/:userId', UsersController.removeById);
    
}




















// app.post('/', uploadImg.single('userImg'), (req, res, next) => {
    //     console.log(req.file)
    //     res.send(req.file)
    // })
// const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//           return res.status(422).json({ errors: errors.array() });
//         }

// (req, res, next) => {
//     console.log(req.body.password)
//     check('password').not().isEmpty().withMessage('password is require')
// },

       // (req, res, next) => {

        // check('email').isEmail();

        // check('password').isLength({ min: 6 });

        // const result = validationResult(req);

        // if (!result.isEmpty()) {

        //     return res.status(422).json({ errors: result.array() });
        // }

