const AccessModel = require("../models/AccessModel");

const rateLimiting = async (req, res, next) => {
  const sessionId = req.session.id;
  //   console.log(sessionId);
  //rate limiting logic

  //check if the user has access before or not

  const sessionDb = await AccessModel.findOne({ sessionId: sessionId });
  console.log(sessionDb);
  //if sessionD is null, that means user is accessing the server for the first time, create a fresh entry in accessmodel
  if (!sessionDb) {
    //create a new entry

    const accessObj = new AccessModel({
      sessionId: sessionId,
      time: Date.now(),
    });

    await accessObj.save();
    next();
    return;
  }

  //if entry was there, then we need to compare the time
  const previousAccessTime = sessionDb.time;
  const currentTime = Date.now();
  //   console.log(previousAccessTime);
  //   console.log(currentTime);

  //if the diff < 2 sec not allow
  if (currentTime - previousAccessTime < 2000) {
    console.log("here");
    return res.send({
      status: 401,
      message: "Too many request, Please try in some time",
    });
  }

  //allow the person to make request but before that update the time to latest
  try {
    await AccessModel.findOneAndUpdate(
      { sessionId: sessionId },
      { time: Date.now() }
    );
    next();
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error in access model",
      error: error,
    });
  }
};

module.exports = { rateLimiting };
