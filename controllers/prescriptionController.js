const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const PDFDocument = require('pdfkit');
const cloudinary = require('../config/cloudinary');

// POST /api/prescriptions - Generate prescription
const generatePrescription = async (req, res) => {
  try {
    const { appointmentId, diagnosis, medicines, notes } = req.body;

    // Get appointment and populate patient & doctor
    const appointment = await Appointment.findById(appointmentId)
      .populate('patient')
      .populate('doctor');

    // Check if appointment exists
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if prescription already exists for this appointment
    const existingPrescription = await Prescription.findOne({ appointment: appointmentId });
    if (existingPrescription) {
      return res.status(400).json({ message: 'Prescription already exists for this appointment' });
    }

    // Generate PDF using PDFKit
    const doc = new PDFDocument();
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));

    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(chunks);

      // Upload buffer to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            folder: 'prescriptions',
            format: 'pdf'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(pdfBuffer);
      });

      // Save prescription to MongoDB
      const prescription = new Prescription({
        appointment: appointmentId,
        diagnosis,
        medicines,
        notes,
        pdfUrl: uploadResult.secure_url
      });

      await prescription.save();

      // Populate appointment details for response
      const populatedPrescription = await Prescription.findById(prescription._id)
        .populate('appointment');

      res.status(201).json({
        message: 'Prescription generated successfully',
        prescription: {
          _id: populatedPrescription._id,
          appointment: populatedPrescription.appointment,
          diagnosis: populatedPrescription.diagnosis,
          medicines: populatedPrescription.medicines,
          notes: populatedPrescription.notes,
          pdfUrl: populatedPrescription.pdfUrl,
          createdAt: populatedPrescription.createdAt
        }
      });
    });

    // PDF Content
    doc.fontSize(20).font('Helvetica-Bold').text('City Hospital', { align: 'center' });
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    doc.fontSize(12).font('Helvetica-Bold').text('Patient Name:');
    doc.font('Helvetica').text(appointment.patient?.fullName || 'N/A', { align: 'left' });
    doc.moveDown(0.5);

    doc.font('Helvetica-Bold').text('Doctor Name:');
    doc.font('Helvetica').text(appointment.doctor?.fullName || 'N/A', { align: 'left' });
    doc.moveDown(0.5);

    doc.font('Helvetica-Bold').text('Date:');
    doc.font('Helvetica').text(new Date(appointment.date).toLocaleDateString(), { align: 'left' });
    doc.moveDown(1);

    doc.font('Helvetica-Bold').text('Diagnosis:');
    doc.font('Helvetica').text(diagnosis, { align: 'left' });
    doc.moveDown(1);

    doc.font('Helvetica-Bold').text('Medicines:');
    doc.font('Helvetica');
    medicines.forEach((medicine, index) => {
      doc.text(`${index + 1}. ${medicine}`);
    });
    doc.moveDown(1);

    if (notes) {
      doc.font('Helvetica-Bold').text('Notes:');
      doc.font('Helvetica').text(notes, { align: 'left' });
      doc.moveDown(1);
    }

    doc.moveDown(2);
    doc.fontSize(10).font('Helvetica-Oblique').text('Digitally Generated Prescription', { align: 'center' });

    doc.end();

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/prescriptions - Get all prescriptions
const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('appointment')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/prescriptions/:id - Get prescription by ID
const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('appointment');
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  generatePrescription,
  getPrescriptions,
  getPrescriptionById
};
