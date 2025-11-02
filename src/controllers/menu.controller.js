const MenuItem = require('../models/Menu.Items');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');


const createMenuItem = asyncHandler(async(req,res)=>{
    const {name, description, price,category, imageUrl, isAvailable}= req.body;
    const existingItem = await MenuItem.findOne({name});
    if(existingItem){
        throw new ApiError(409, 'Menu item with this name already exists');
    }

    const menuItem = await MenuItem.create({
        name,
        description,
        price,
        category,
        imageUrl,
        isAvailable,
    });

    if (!menuItem){
        throw new ApiError(500, "failed to create menu item");
    }
    res.status(201)
    .json(
        new ApiResponse(201, {menuItem},'Menu item created successfully')
    )
});


const getAllMenuItems = asyncHandler(async(req,res)=>{
    const query = {};
    if (req.query.category) {
        query.category = req.query.category;
    }
    query.isAvailable = true;
    const menuItems = await MenuItem.find(query);

    res.status(200).json(new ApiResponse(200,{count:menuItems.length, menuItems},"Menu Irems Retrieved Successfully"))
});

const getMenuItemById = asyncHandler(async (req, res) => {
    const menuItem = await MenuItem.findById(req.params.id);
  
    if (!menuItem) {
      throw new ApiError(404, 'Menu item not found');
    }
  
    res
      .status(200)
      .json(new ApiResponse(200, { menuItem }, 'Menu item retrieved successfully'));
  });
  
  // @desc    Update a menu item
  // @route   PUT /api/v1/menu/:id
  // @access  Private (Admin, Employee)
  const updateMenuItem = asyncHandler(async (req, res) => {
    const { name, description, price, category, imageUrl, isAvailable } = req.body;
  
    let menuItem = await MenuItem.findById(req.params.id);
  
    if (!menuItem) {
      throw new ApiError(404, 'Menu item not found');
    }
  
    // Check for duplicate name if name is being changed
    if (name && name !== menuItem.name) {
      const existingItem = await MenuItem.findOne({ name });
      if (existingItem) {
        throw new ApiError(409, 'Menu item with this name already exists');
      }
    }
  
    // Update fields
    menuItem.name = name || menuItem.name;
    menuItem.description = description || menuItem.description;
    menuItem.price = price || menuItem.price;
    menuItem.category = category || menuItem.category;
    menuItem.imageUrl = imageUrl || menuItem.imageUrl;
    
    // Explicitly check for boolean false, otherwise `||` logic fails
    if (isAvailable === true || isAvailable === false) {
      menuItem.isAvailable = isAvailable;
    }
  
    const updatedMenuItem = await menuItem.save();
  
    res
      .status(200)
      .json(
        new ApiResponse(200, { menuItem: updatedMenuItem }, 'Menu item updated successfully')
      );
  });
  
  // @desc    Delete a menu item
  // @route   DELETE /api/v1/menu/:id
  // @access  Private (Admin)
  const deleteMenuItem = asyncHandler(async (req, res) => {
    const menuItem = await MenuItem.findById(req.params.id);
  
    if (!menuItem) {
      throw new ApiError(404, 'Menu item not found');
    }
  
    // Mongoose 7+ `deleteOne` is the modern way
    await menuItem.deleteOne();
  
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
  