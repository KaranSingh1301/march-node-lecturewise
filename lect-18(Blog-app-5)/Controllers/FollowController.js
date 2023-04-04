const reset = require("cli-color/reset");
const express = require("express");
const {
  followUser,
  followingUsersList,
  followerUsersList,
} = require("../Models/FollowModel");
const User = require("../Models/UserModel");
const { off } = require("../Schemas/FollowSchema");
const FollowRouter = express.Router();

FollowRouter.post("/follow-user", async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;

  //validate followerUserId
  try {
    await User.verifyUserId({ userId: followerUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid follower userID",
      error: error,
    });
  }

  //validate followingUserId
  try {
    await User.verifyUserId({ userId: followingUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid following userID",
      error: error,
    });
  }

  //create an entry in follow collection
  try {
    const followDb = await followUser({ followingUserId, followerUserId });
    return res.send({
      status: 201,
      message: "Follow successfull",
      data: followDb,
    });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Database error",
      error: error,
    });
  }
});

FollowRouter.post("/following-list", async (req, res) => {
  const followerUserId = req.session.user.userId;
  const skip = req.query.skip || 0;

  //validate the userID
  try {
    await User.verifyUserId({ userId: followerUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid follower userID",
      error: error,
    });
  }

  try {
    const followingList = await followingUsersList({ followerUserId, skip });

    if (followingList.length === 0) {
      return res.send({
        status: 200,
        message: "Following list is empty",
      });
    }

    return res.send({
      status: 200,
      messge: "Read successs",
      data: followingList,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

FollowRouter.post("/follower-list", async (req, res) => {
  const followingUserId = req.session.user.userId;
  const skip = req.query.skip || 0;

  //validate id
  try {
    await User.verifyUserId({ userId: followingUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid follower userID",
      error: error,
    });
  }

  try {
    const followerList = await followerUsersList({ followingUserId, skip });

    return res.send({
      status: 200,
      messge: "Read successs",
      data: followerList,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

module.exports = FollowRouter;
