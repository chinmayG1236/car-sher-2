import Notification from "../models/notification.model.js";
export const addNotification = async (req,res,next)=>{
    const {start,end,driver,passenger,journeyDate,driverName,passengerName,journeyId } = req.body;
    
    const newNotification = new Notification({start,end,driver,passenger,journeyDate,driverName,passengerName,journeyId });

    try {
        await newNotification.save();
        res.status(201).json({message:"Notification added successfully"});
    } catch (error) {
        next(error);
    }
}

// to send notification from db 

export const getNotification = async (req,res,next)=>{
    try {
        const { driverId } = req.query;
    
        if (!driverId) {
          return res.status(400).json({ error: "Driver ID is required" });
        }
    
        const notifications = await Notification.find({ driver: driverId,isRead: false  })
          .sort({ createdAt: -1 })
          .exec();
    
        res.status(200).json(notifications);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ error: "Server error" });
      }
}
// mark as read 
export const MarkAsRead = async (req,res,next)=>{
    try {
        const notification = await Notification.findByIdAndUpdate(
          req.params.id,
          { isRead: true },
          { new: true }
        );
        res.status(200).json(notification);
      } catch (err) {
        res.status(500).json({ error: "Could not mark as read" });
      }
}