const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory');


const filterObj = (obj, ...allowedFields)=>{
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el))newObj[el] = obj[el];
    })
    return newObj;
}


exports.getAllUsers = factory.getAll(User);

exports.updateMe = catchAsync(async(req, res, next)=>{
    //1 reate error if user posts password data
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('This is not for password update', 400));
    }
    //2 update user document
    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });
    
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
    //3 
})

exports.deleteMe = catchAsync( async(req, res, next)=>{
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.createUser = (req, res)=>{
    
    res.status(500).json({
        status: 'fail',
        message: 'Failure at createUser. Please use signup insted!'
    })
}

exports.getMe = (req, res, next)=>{
    req.params.id = req.user.id;
    next();
}

exports.getUser = factory.getOne(User);

//Do not try to update password here
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);


// exports.updateUser = (req, res)=>{
    
//     res.status(500).json({
//         status: 'fail',
//         message: 'Failure at updateUser'
//     })
// }

// exports.deleteUser = (req, res)=>{
    
//     res.status(500).json({
//         status: 'fail',
//         message: 'Failure at deleteUser'
//     })
// }