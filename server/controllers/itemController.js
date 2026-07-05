const Item = require('../models/Item');

// @desc    Get all items
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const { category, campus, search } = req.query;
    let query = { isAvailable: true };
    
    if (category) query.category = category;
    if (campus) query.campus = campus;
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const items = await Item.find(query).populate('owner', 'name campus');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('owner', 'name campus');
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    const { title, description, category, campus, rentalFeePerDay, depositAmount, images } = req.body;
    
    const item = new Item({
      owner: req.user._id,
      title,
      description,
      category,
      campus,
      rentalFeePerDay,
      depositAmount,
      images: images || []
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (item) {
      if (item.owner.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this item' });
      }

      item.title = req.body.title || item.title;
      item.description = req.body.description || item.description;
      item.category = req.body.category || item.category;
      item.campus = req.body.campus || item.campus;
      item.rentalFeePerDay = req.body.rentalFeePerDay || item.rentalFeePerDay;
      item.depositAmount = req.body.depositAmount || item.depositAmount;
      item.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : item.isAvailable;

      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (item) {
      if (item.owner.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this item' });
      }
      await item.deleteOne();
      res.json({ message: 'Item removed' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};
