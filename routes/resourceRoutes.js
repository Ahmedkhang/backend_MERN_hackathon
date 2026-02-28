const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const protect = require('../middleware/protect');
const checkRole = require('../middleware/checkRole');

// All routes are protected (require authentication)
router.use(protect);

// Create a new resource
router.post('/', resourceController.createItem);

// Get all resources
router.get('/', resourceController.getAllItems);

// Get single resource by ID
router.get('/:id', resourceController.getSingleItem);

// Update resource by ID
router.put('/:id', resourceController.updateItem);

// Delete resource by ID
router.delete('/:id', resourceController.deleteItem);

module.exports = router;
