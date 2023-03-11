
const Tour = require('./../models/tourModel');


exports.getAllTours = async (req, res) => {
    try {

        //BUILD QUERY
        //1a) FILTERINGS
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        //console.log(req.query);

        //1b) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // console.log(JSON.parse(queryStr));


        // //2)sorting
        // if (req.query.sort) {
        //     const sortBy = req.query.sort.split(',').join(' ');
        //     query = query.sort(sortBy)
        // } else {
        //     query = query.sort('-createdAt');
        // }
        // //3) field limiting
        // if (req.query.fields) {
        //     const fields = req.query.fields.split(',').join(' ');
        //     query = query.select(fields);
        // } else {
        //     query = query.select('-__v')
        // }

        const query = Tour.find(JSON.parse(queryStr));

        //EXECUTE QUERY
        const tours = await query;

        //SEND RESPOMSE
        res.status(200).json({
            status: ' success',
            results: tours.length,
            data: {
                tours
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getTour = async (req, res) => {

    try {
        await Tour.findById(req.params.id)
        res.status(200).json({
            status: ' success',
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }

    res.status(200).json({
        status: ' success',
        data: {
            tour
        }
    })
}

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })

    }
}

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: ' success',
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })

    }

}

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: ' success',
            data: null

        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}
