const reset = require("cli-color/reset");
const express = require("express");
const { followUser } = require("../Models/FollowModel");
const User = require("../Models/UserModel");
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

  return res.send("All working in follow route");
});

module.exports = FollowRouter;
