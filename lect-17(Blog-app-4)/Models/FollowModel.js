const FollowSchema = require("../Schemas/FollowSchema");

const followUser = ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    //check if the follow exist or not

    try {
      const followExitDb = await FollowSchema.findOne({
        followerUserId,
        followingUserId,
      });

      if (followExitDb) {
        return reject("User already follow");
      }

      //create a new entry
      const follow = new FollowSchema({
        followerUserId,
        followingUserId,
        creationDateTime: new Date(),
      });

      const followDb = await follow.save();
      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { followUser };
