const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { CustomError } = require('../middlewares/error');

const createNewConversationController = async (req, res, next) => {
    // get info from body
    const { firstUser, secondUser } = req.body;
    try {
        // check if user exist
        const userFirst = await User.findById({_id:firstUser});
        // throw error if not found
        if (!userFirst){
            throw new CustomError("User not found", 404);
        }
        // check if user exist
        const userSecond = await User.findById({_id:secondUser});
        // throw error if not found
        if (!userSecond){
            throw new CustomError("User not found", 404);
        }
        // define a conversation
        let newConversation;
        // check if firstUser and SecondUser is the same
        if (req.body.firstUser!==req.body.secondUser) {
            // add the two user in array
            newConversation = new Conversation({
                participants:[req.body.firstUser,req.body.secondUser]
            });
        } else {
            // throw error if not
            throw new CustomError("sender and receiver cannot be the same!", 400);
        }
        // save the new conversation created
        const savedConversation = await newConversation.save();

        res.status(201).json(savedConversation);
    } catch(error) {
        next(error);
    }

}

const getConversationOfUserController = async (req, res, next) => {
    // get user id from url
    const { userId } = req.params;
    try {
        // check if user exist
        const user = await User.findById(userId);
        // throw error if not found
        if (!user){
            throw new CustomError("User not found", 404);
        }
        // check if user is registed in participant 
        const conversation = await Conversation.find({
            participants:{$in:[req.params.userId]},
        });

        res.status(200).json(conversation);
    } catch(error) {
        next(error);
    }
}

const getTwoUsersConversationController = async (req, res, next) => {
    const { firstUserId, secondUserId } = req.params;
    try {
        // check if user exist
        const userFirst = await User.findById(firstUserId);
        // throw error if not found
        if (!userFirst){
            throw new CustomError("User not found", 404);
        }
        // check if user exist
        const userSecond = await User.findById(secondUserId);
        // throw error if not found
        if (!userSecond){
            throw new CustomError("User not found", 404);
        }
        // find all of the element of array
        const conversations = await Conversation.find({
            participants:{$all:[req.params.firstUserId, req.params.secondUserId]},
        });

        res.status(200).json(conversations);

    } catch(error) {
        next(error);
    }
}

const deleteConversationController = async (req, res, next) => {
    // extract conversation from url
    const { conversationId } = req.params;
    try {
        // check if conversation exist
        const conversation = await Conversation.findById(conversationId);
        // throw error if not found
        if (!conversation) {
            throw new CustomError("Conversation not found!", 404);
        }
        // delete conversation id from the conversations
        await Conversation.deleteOne({_id:conversationId});
        // delete all message partaining to the conversation
        await Message.deleteMany({conversationId:conversationId});

        res.status(200).json({message:"Conversion deleted successfully"});

    } catch(error) {
        next(error);
    }
}

module.exports = {
    createNewConversationController,
    getConversationOfUserController,
    getTwoUsersConversationController,
    deleteConversationController,
}