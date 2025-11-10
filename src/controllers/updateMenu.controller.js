const updateMenuItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category } = req.body;

    if (!id) {
        throw new ApiError(400, "Menu item ID is required.");
    }


    const menuItem = await MenuItems.findByIdAndUpdate(
        id,
        {
            $set: {
                name,
                description,
                price,
                category
            }
        },
        { new: true }
      );

    if (!menuItem) {
        throw new ApiError(404, "Menu item not found with this ID.");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200, 
            menuItem, 
            "Menu item updated successfully."
        ));
});