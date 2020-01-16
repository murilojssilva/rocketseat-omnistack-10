const { Router } = require('express');
const axios = require('axios');
const Dev = require ('./models/Dev');
const DevController = require('./controllers/DevController')
const SearchController = require('./controllers/SearchController')

const routes = Router();

routes.get('/search', SearchController.index);

routes.get('/devs',DevController.index);
routes.post('/devs', DevController.store);

module.exports = routes;

