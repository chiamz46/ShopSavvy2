import mongoose from "mongoose";

export const  connectDB = async () =>{

    await mongoose.connect('mongodb+srv://onyinye2029_db_user:UbKph1IAwH2whrAw@cluster0.l0gmejw.mongodb.net/shop-savy').then(()=>console.log("DB Connected"));
   
}


