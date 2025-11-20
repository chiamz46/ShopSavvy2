import foodModel from "../models/foodModel.js";
import fs from 'fs';

// Public endpoint to list all food items
const listAllFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Admin endpoint to list food items for the logged-in admin
const listAdminFood = async (req, res) => {
    try {
        const foods = await foodModel.find({ adminId: req.body.userId });
        console.log("Admin ID", req.body.userId)
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// add food
const addFood = async (req, res) => {

    try {
        let image_filename = `${req.file.filename}`
        console.log("Admin", req.body.userId)
        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category:req.body.category,
            image: image_filename,
            adminId: req.body.userId
        })

        await food.save();
        res.json({ success: true, message: "Food Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// delete food
const removeFood = async (req, res) => {
    try {

        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => { })

        await foodModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Food Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

export { listAllFood, listAdminFood, addFood, removeFood };
