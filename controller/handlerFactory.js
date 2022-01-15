const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const APIfeatures = require('./../utils/apiFeatures')

exports.deleteOne = Model => catchAsync(async (req, res, next)=>{

    const doc = await Model.findByIdAndDelete(req.params.id);

    if(!doc){
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });

});

exports.updateOne = Model => catchAsync(async (req, res, next)=>{
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if(!doc){
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(201).json({
        status: 'success',
        data: {
            doc
        }
    });

})

exports.createOne = Model => catchAsync(async (req, res, next)=>{
    const newDoc = await Model.create(req.body);
        
        res.status(201).json({
            status: 'success',
            data: {
                data: newDoc
            }
        });  
});

exports.getOne = (Model, popOptions) => catchAsync(async(req, res, next)=>{
    let query = Model.findById(req.params.id);
    if(popOptions)query = query.populate(popOptions);
    const doc = await query;

        if(!doc){
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(201).json({
            status: 'success',
            data: {
                doc
            }
        });
    
})

exports.getAll = Model => catchAsync(async (req, res, next)=>{
    let filter = {};
    if(req.params.tourId) filter = {tour: req.params.tourId};

    const features = new APIfeatures(Model.find(), req.query).filter().sort().limitFields().paginate();
    const doc = await features.query;

    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            doc
        }
    })
    
});

//Build Query
    // 1) Filtering
    // const queryObj = {...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach(el => delete queryObj[el]);

    // // 2) Advanced filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // // console.log(queryStr);
    // // const queryJson = ;
    // let query = Tour.find(JSON.parse(queryStr));
   //Sorting
    // if(req.query.sort){
    //     const sortBy = req.query.sort.split(',').join(' ');
    //     // console.log(sortBy);
    //     query = query.sort(sortBy);
    // }else {
    //     query = query.sort('-createdAt');
    // }

    //Field Limiting
    // if(req.query.fields){
    //     const fields = req.query.fields.split(',').join(' ');
    //     query = query.select(fields);
    // }else {
    //     query = query.select('-__v');
    // }

    //Pagination
    // const page = req.query.page*1 | 1;
    // const limit = req.query.limit*1 || 100;
    // const skip = (page-1)*limit;
    // query = query.skip(skip).limit(limit);

    // if(req.query.page){
    //     const numTours = await Tour.countDocuments();
    //     if(skip>numTours)throw new Error('This page does not exist');
    // }