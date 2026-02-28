const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const protect = require('../middleware/protect');
const checkRole = require('../middleware/checkRole');

// All routes require JWT authentication and Doctor role
router.post('/',
  protect,
  checkRole('Doctor'),
  prescriptionController.generatePrescription
);

router.get('/',
  protect,
  checkRole('Doctor'),
  prescriptionController.getPrescriptions
);

router.get('/:id',
  protect,
  checkRole('Doctor'),
  prescriptionController.getPrescriptionById
);

module.exports = router;
