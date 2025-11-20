import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

// add to user cart  
const addToCart = async (req, res) => {
   try {
      let userData = await userModel.findById(req.body.userId);
      let cartData = await userData.cartData;
      const newItemId = req.body.itemId;

      const newItem = await foodModel.findById(newItemId);
      if (!newItem) {
          return res.json({ success: false, message: "Food item not found" });
      }
      const newItemAdminId = newItem.adminId;

      if (Object.keys(cartData).length > 0) {
          let existingAdminId = null;
          for (const itemId in cartData) {
              if (cartData[itemId] > 0) {
                  const existingItem = await foodModel.findById(itemId);
                  if (existingItem) {
                      existingAdminId = existingItem.adminId;
                      break;
                  }
              }
          }

          if (existingAdminId && newItemAdminId.toString() !== existingAdminId.toString()) {
              return res.json({ success: false, message: "You can only add items from one restaurant at a time. Please clear your cart to proceed." });
          }
      }

      if (!cartData[newItemId]) {
         cartData[newItemId] = 1;
      }
      else {
         cartData[newItemId] += 1;
      }
      await userModel.findByIdAndUpdate(req.body.userId, {cartData});
      res.json({ success: true, message: "Added To Cart" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }
}

// remove food from user cart
const removeFromCart = async (req, res) => {
   try {
      let userData = await userModel.findById(req.body.userId);
      let cartData = await userData.cartData;
      if (cartData[req.body.itemId] > 0) {
         cartData[req.body.itemId] -= 1;
      }
      await userModel.findByIdAndUpdate(req.body.userId, {cartData});
      res.json({ success: true, message: "Removed From Cart" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }

}

// get user cart
const getCart = async (req, res) => {
   try {
      let userData = await userModel.findById(req.body.userId);
      let cartData = await userData.cartData;
      res.json({ success: true, cartData:cartData });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }
}


export { addToCart, removeFromCart, getCart }