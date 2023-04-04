const FollowSchema = require("../Schemas/FollowSchema");
const UserSchema = require("../Schemas/UserSchema");
const { BLOGLIMIT } = require("../privateConstants");
const ObjectId = require("mongodb").ObjectId;

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

const followingUsersList = ({ followerUserId, skip }) => {
  return new Promise(async (resolve, reject) => {
    //pagination, sort, match

    const followingList = await FollowSchema.aggregate([
      { $match: { followerUserId: new ObjectId(followerUserId) } },
      { $sort: { creationDateTime: -1 } },
      {
        $facet: {
          data: [{ $skip: parseInt(skip) }, { $limit: BLOGLIMIT }],
        },
      },
    ]);
    console.log("here");

    //populate the data
    // const followDb = await FollowSchema.find({
    //   followerUserId: followerUserId,
    // }).populate("followingUserId");

    let followingUserIds = [];
    followingList[0].data.forEach((followObj) => {
      followingUserIds.push(followObj.followingUserId);
    });

    const followingUserDetails = await UserSchema.aggregate([
      {
        $match: {
          _id: { $in: followingUserIds },
        },
      },
    ]);
    // console.log(followingList[0].data);
    // console.log(followingUserIds);
    // console.log(followingUserDetails);

    resolve(followingUserDetails);
  });
};

const followerUsersList = ({ followingUserId, skip }) => {
  return new Promise(async (resolve, reject) => {
    try {
      //match, sort, pagination

      const followerDb = await FollowSchema.aggregate([
        { $match: { followingUserId: new ObjectId(followingUserId) } },
        { $sort: { creationDateTime: -1 } }, //DESC order of time
        {
          $facet: {
            data: [{ $skip: parseInt(skip) }, { $limit: BLOGLIMIT }],
          },
        },
      ]);

      let followerUserIds = [];
      followerDb[0].data.forEach((obj) => {
        followerUserIds.push(obj.followerUserId);
      });

      const followersUserDetails = await UserSchema.aggregate([
        {
          $match: { _id: { $in: followerUserIds } },
        },
      ]);

      resolve(followersUserDetails);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { followUser, followingUsersList, followerUsersList };

//test -->test1
//test1 --->test
//test->>test2
//test --->test3
//test2-->test
//test3-->test
//test4-->test
//test5-->test
//test6-->test
