import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    passenger: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    passengerName: {type:String},
    driverName: {type:String},
    journeyId: { type: mongoose.Schema.Types.ObjectId, ref: "Journey"},
    start: {type:String},
    end: {type:String},
    journeyDate:{type:Date},
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;