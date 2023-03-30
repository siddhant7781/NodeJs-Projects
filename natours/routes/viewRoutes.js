const express = require('express');
const viewsController = require('./../controllers/viewController');
const router = express.Router();
const app = express()


app.get('/overview', viewsController.getOverview);

app.get('/tour', viewsController.getTour);

module.exports = router;