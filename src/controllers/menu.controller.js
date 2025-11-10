const MenuItem = require('../models/Menu.Items');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// ==========================
// CREATE MENU ITEM
// ==========================
const createMenuItem = asyncHandler(async (req, res) => {
  const { name, description, price, category, isAvailable, SpiceLevel } = req.body;

  // Check if name already exists
  const existingItem = await MenuItem.findOne({ name });
  if (existingItem) {
    throw new ApiError(409, 'Menu item with this name already exists');
  }

  // Create new item
  const menuItem = await MenuItem.create({
    name,
    description,
    price,
    category,
    isAvailable,
    SpiceLevel
  });

  if (!menuItem) {
    throw new ApiError(500, 'Failed to create menu item');
  }

  // Emit event only if io exists
  if (req.io) {
    req.io.emit('menuItemAdded', menuItem);
  }

  res.status(201).json(new ApiResponse(201, menuItem, 'Menu item created successfully'));
});

// ==========================
// GET ALL MENU ITEMS
// ==========================
const getAllMenuItems = asyncHandler(async (req, res) => {
  const menuItems = await MenuItem.find({});

  res.status(200).json(
    new ApiResponse(200, menuItems, 'Menu Items Retrieved Successfully')
  );
});

// ==========================
// GET MENU ITEM BY ID
// ==========================
const getMenuItemById = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id);

  if (!menuItem) {
    throw new ApiError(404, 'Menu item not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, menuItem, 'Menu item retrieved successfully'));
});

// ==========================
// UPDATE MENU ITEM
// ==========================
const updateMenuItem = asyncHandler(async (req, res) => {
  const { name, description, price, category, isAvailable, SpiceLevel } = req.body;

  let menuItem = await MenuItem.findById(req.params.id);

  if (!menuItem) {
    throw new ApiError(404, 'Menu item not found');
  }

  // Check if new name conflicts
  if (name && name !== menuItem.name) {
    const existingItem = await MenuItem.findOne({ name });
    if (existingItem) {
      throw new ApiError(409, 'Menu item with this name already exists');
    }
  }

  // Update fields
  menuItem.name = name || menuItem.name;
  menuItem.description = description || menuItem.description;
  menuItem.price = price !== undefined ? price : menuItem.price;
  menuItem.category = category || menuItem.category;
  menuItem.SpiceLevel = SpiceLevel || menuItem.SpiceLevel;

  if (isAvailable === true || isAvailable === false) {
    menuItem.isAvailable = isAvailable;
  }

  const updatedMenuItem = await menuItem.save();

  if (req.io) {
    req.io.emit('menuItemUpdated', updatedMenuItem);
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedMenuItem, 'Menu item updated successfully')
    );
});

// ==========================
// DELETE MENU ITEM
// ==========================
const deleteMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id);

  if (!menuItem) {
    throw new ApiError(404, 'Menu item not found');
  }

  await menuItem.deleteOne();

  if (req.io) {
    req.io.emit('menuItemDeleted', { id: req.params.id });
  }

  res
    .status(200)
    .json(new ApiResponse(200, { id: req.params.id }, 'Menu item deleted successfully'));
});

module.exports = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};
