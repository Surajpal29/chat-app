import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/socket.js";
import Message from "../models/message.model.js"
import User from "../models/user.models.js";




export const getUserForSidebar = async(req,res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUser = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUser);

        
    } catch (error) {
        console.log('====================================');
        console.log("error in getUserForSidebar", error.message);
        console.log('====================================');
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        })
       
        res.status(200).json(messages);
    } catch (error) {
        console.log('====================================');
        console.log("error in getMessage", error.message);
        console.log('====================================');
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params
        const senderId = req.user._id;

        let imageUrl 
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        })

        await newMessage.save();
        
        
        const receiverSocketId = getReceiverSocketId(receiverId)
        
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage);
    } catch (error) {
        
        console.log('====================================');
        console.log("error in sendMessage", error.message);
        console.log('====================================');
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteSingleMessage = async (req, res) => {
  try {
       console.log('====================================');
       console.log("Received params:", req.params);

       console.log('====================================');
    const { messageId, userId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
   
     

    // Agar user already delete kar chuka hai toh return kar do
    if (message.deletedFor.includes(userId)) {
      return res.status(400).json({ message: "Message already deleted for this user" });
    }

    // Update deletedFor array
    message.deletedFor.push(userId);
    await message.save();

    // Agar dono users ne delete kar diya toh message permanently remove kar do
    if (
      message.deletedFor.includes(message.senderId.toString()) &&
      message.deletedFor.includes(message.receiverId.toString())
    ) {
      await Message.findByIdAndDelete(messageId);
    }

    res.status(200).json({ message: "Message deleted for user" });
  } catch (error) {
    console.error("Error deleting message", error);
    res.status(500).json({ message: "Failed to delete message", error });
  }
}

export const deleteAllMessages = async (req, res) => {
 try {
    const { userId, selectedUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: userId },
      ],
    });

    if (!messages.length) {
      return res.status(404).json({ message: "No messages found" });
    }

    const messagesToDelete = [];
    for (const message of messages) {
      if (!message.deletedFor.includes(userId)) {
        message.deletedFor.push(userId);
        await message.save();
      }

      // Agar dono users delete kar chuke hain toh delete from DB
      if (
        message.deletedFor.includes(message.senderId.toString()) &&
        message.deletedFor.includes(message.receiverId.toString())
      ) {
        messagesToDelete.push(message._id);
      }
    }

    // Permanently delete messages jo dono ne delete kiye hain
    if (messagesToDelete.length > 0) {
      await Message.deleteMany({ _id: { $in: messagesToDelete } });
    }

    res.status(200).json({ message: "Chat deleted for user" });
  } catch (error) {
    console.error("Error deleting chat", error);
    res.status(500).json({ message: "Failed to delete chat", error });
  }
}