import express from 'express';
import { addFood, listAllFood, listAdminFood, removeFood} from '../controllers/foodController.js';
import multer from 'multer';
import authMiddleware from '../middleware/auth.js';

const foodRouter = express.Router();

//Image Storage Engine (Saving Image to uploads folder & rename it)

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`);
    }
})

const upload = multer({ storage: storage})

foodRouter.get("/list", listAllFood);
foodRouter.get("/list/admin", authMiddleware, listAdminFood);
foodRouter.post("/add",upload.single('image'), authMiddleware, addFood);
foodRouter.post("/remove",removeFood);


export default foodRouter;