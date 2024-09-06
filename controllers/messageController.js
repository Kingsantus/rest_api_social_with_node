const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const { CustomError } = require('../middlewares/error');

const createMessageController = async (req, res, next) => {
    // destructure and get every item from body
    const { conversationId, sender, text } = req.body;
    try {
        // check if conversationId exist
        const conversation = await Conversation.findById(conversationId);
        // throw error if not found
        if (!conversation) {
            throw new CustomError("Conversation not found!", 404)
        }
        // check if conversationId exist
        const user = await User.findById({_id:sender});
        // throw error if not found
        if (!conversation) {
            throw new CustomError("User not found!", 404)
        }
        // create new message
        const newMessage = new Message({
            text,
            conversation:conversationId,
            sender:sender,
        })
        // save newMessage
        await newMessage.save();

        res.status(201).json(newMessage);
    } catch(error) {
        next(error);
    }
}

const getMessagesController = async (req, res, next) => {
    // get conversation id from url
    const { conversationId } = req.params;
    try {
        // check if conversationId exist
        const conversation = await Conversation.findById(conversationId);
        // throw a error if not found
        if (!conversation){
            throw new CustomError("Conversation not found", 404);
        }
        // get all message that have same conversation Id
        const messages = await Message.find({
            conversation:conversationId
        });
        res.status(200).json(messages);

    } catch(error) {
        next(error);
    }
}

const deleteMessageController = async (req, res, next) => {
    // get message id from url
    const { messageId } = req.params;
    try {
        // check if message exist
        const message = await Message.findById(messageId);
        // throw error if it don't exist
        if (!message) {
            throw new CustomError("Message not found");
        }
        // find and delete the message in the database
        await Message.findByIdAndDelete(messageId);

        res.status(200).json({message:"Message deleted succcessfully!"});
    } catch(error) {
        next(error);
    }
}

module.exports = {
    createMessageController,
    getMessagesController,
    deleteMessageController,
}