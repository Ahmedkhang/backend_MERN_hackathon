/**
 * Generic CRUD Controller Factory
 * @param {Model} model - Mongoose model to perform CRUD operations on
 * @returns {Object} - CRUD controller functions
 */
const createCrudController = (model) => {

  // Create a new item
  const createItem = async (req, res) => {
    try {
      const item = new model(req.body);
      await item.save();
      res.status(201).json({
        success: true,
        message: 'Item created successfully',
        data: item
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error creating item',
        error: error.message
      });
    }
  };

  // Get all items
  const getAllItems = async (req, res) => {
    try {
      const items = await model.find().populate('createdBy', 'fullName email');
      res.status(200).json({
        success: true,
        count: items.length,
        data: items
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching items',
        error: error.message
      });
    }
  };

  // Get single item by ID
  const getSingleItem = async (req, res) => {
    try {
      const item = await model.findById(req.params.id).populate('createdBy', 'fullName email');
      
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found'
        });
      }

      res.status(200).json({
        success: true,
        data: item
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching item',
        error: error.message
      });
    }
  };

  // Update item by ID
  const updateItem = async (req, res) => {
    try {
      const item = await model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Item updated successfully',
        data: item
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error updating item',
        error: error.message
      });
    }
  };

  // Delete item by ID
  const deleteItem = async (req, res) => {
    try {
      const item = await model.findByIdAndDelete(req.params.id);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Item deleted successfully',
        data: {}
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting item',
        error: error.message
      });
    }
  };

  return {
    createItem,
    getAllItems,
    getSingleItem,
    updateItem,
    deleteItem
  };
};

module.exports = createCrudController;
