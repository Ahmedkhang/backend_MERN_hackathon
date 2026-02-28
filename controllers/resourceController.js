const Resource = require('../models/Resource');
const createCrudController = require('./crudController');

// Use the generic CRUD controller factory with Resource model
const resourceController = createCrudController(Resource);

module.exports = resourceController;
