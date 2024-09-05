const User = require('../models/User');
const Story = require('../models/Story');
const { CustomError } = require('../middlewares/error');

const createStoryController = async (req, res, next) => {
    // get user id from url
    const { userId } = req.params;
    // get text from body
    const { text } = req.body;
    try {
        // check if user exist
        const user = await User.findById(userId);
        // throw error if not found
        if (!user){
            throw new CustomError("User not found", 404);
        }
        // image is stored as empty
        let image = ""
        // the file will be give a distinct url
        if (req.file){
            image=process.env.URL+`/uploads/${req.file.filename}`;
        }
        // create new story
        const newStory = new Story({
            text,
            image,
            user:userId,
        });
        // session add the story and save
        await newStory.save();

        res.status(201).json(newStory);
    } catch(error) {
        next(error);
    }
}

const getStoriesController = async (req, res, next) => {
     // get user id from url
     const { userId } = req.params;
     try {
        // check if user exist
        const user = await User.findById(userId);
        // throw error if not found
        if (!user){
            throw new CustomError("User not found", 404);
        }
        // get the users the user is following
        const followingUsers=user.following
        // get all the stories of users the users is following
        // arrange how best to display it
        const stories = await Story.find(
            {user:{$in:followingUsers}}
        ).populate("user", "fullName username profilePicture");

        res.status(200).json(stories);

     } catch(error) {
        next(error);
     }
}

const getUserStoriesController = async (req, res, next) => {
    // get user id from url
    const { userId } = req.params;
    try {
        // check if user exist
        const user = await User.findById(userId);
        // throw error if not found
        if (!user){
            throw new CustomError("User not found", 404);
        }
        // get the stories partaining to user
        // arrange how it will be displayed
        const stories = await Story.find(
            {user:userId}
        ).populate("user", "fullName username profilePicture");

        res.status(200).json(stories);
    } catch(error) {
        next(error);
    }
}

const deleteStoryController = async (req, res, next) => {
    // get the id of story from url
    const { storyId } = req.params;
    try {
        // check if story exist
        const story = await User.findById(storyId);
        // throw error if not found
        if (!story){
            throw new CustomError("Story not found", 404);
        }
        // find and delete
        await Story.findByIdAndDelete(storyId);
        // save story
        Story.save();

        res.status(200).json({message:"Story Deleted Successfully"});
    } catch(error) {
        next(error);
    }
}

const deleteUserStoriesController = async (req, res, next) => {
    // get user id from url
    const { userId } = req.params;
    try {
        // check if user exist
        const user = await User.findById(userId);
        // throw error if not found
        if (!user){
            throw new CustomError("User not found", 404);
        }
        // find and delete
        await Story.deleteMany({user:userId});

        res.status(200).json({message:"All Stories Deleted Successfully"});

    } catch(error) {
        next(error);
    }
}

module.exports = {
    createStoryController,
    getStoriesController,
    getUserStoriesController,
    deleteStoryController,
    deleteUserStoriesController,
}