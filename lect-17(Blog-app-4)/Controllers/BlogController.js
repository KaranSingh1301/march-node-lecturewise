const express = require("express");
const Blogs = require("../Models/BlogModel");
const User = require("../Models/UserModel");
const { BlogDataValidate } = require("../utils/BlogUtils");
const BlogRouter = express.Router();

BlogRouter.post("/create-blog", async (req, res) => {
  const { title, textBody } = req.body;
  const userId = req.session.user.userId;
  const creationDateTime = new Date();

  //data valdation

  await BlogDataValidate({ title, textBody, userId })
    .then(async () => {
      try {
        await User.verifyUserId({ userId });
      } catch (error) {
        return res.send({
          status: 400,
          message: "UserId issue",
          error: error,
        });
      }

      const blogObj = new Blogs({ title, textBody, userId, creationDateTime });

      try {
        const blogDb = await blogObj.createBlog();
        console.log(blogDb);
        return res.send({
          status: 201,
          message: "Blog created Successfully",
          data: blogDb,
        });
      } catch (error) {
        return res.send({
          status: 500,
          message: "Database error",
          error: error,
        });
      }

      return res.send(true);
    })
    .catch((err) => {
      console.log(err);
      return res.send({
        status: 400,
        message: "Data Error",
        error: err,
      });
    });
});

// /blog/get-blogs?skip=5
BlogRouter.get("/get-blogs", async (req, res) => {
  const skip = req.query.skip || 0;

  try {
    const blogDb = await Blogs.getBlogs({ skip });

    return res.send({
      status: 200,
      message: "Read Success",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

BlogRouter.get("/my-blogs", async (req, res) => {
  const skip = req.query.skip || 0;
  const userId = req.session.user.userId;

  try {
    // await User.verifyUserId({userId})

    const myBlogDb = await Blogs.myBlogs({ skip, userId });

    return res.send({
      status: 200,
      message: "Read Success",
      data: myBlogDb,
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

BlogRouter.post("/edit-blog", async (req, res) => {
  const { title, textBody } = req.body.data;
  const blogId = req.body.blogId;
  const userId = req.session.user.userId;

  try {
    //find the blog with blogId
    const blogObj = new Blogs({ title, textBody, userId, blogId });
    const blogDb = await blogObj.getBlogDataFromId();

    //compare the owner and the user making the request to edit
    //if(userId1.toString() === userId2.toString())
    if (!blogDb.userId.equals(userId)) {
      return res.send({
        status: 401,
        message: "Not allowed to edit, Authorization Failed",
      });
    }

    //compare the time, within 30 mins
    const creationDateTime = new Date(blogDb.creationDateTime).getTime();
    const currentDateTime = Date.now();

    console.log((currentDateTime - creationDateTime) / (1000 * 60));
    const diff = (currentDateTime - creationDateTime) / (1000 * 60);

    if (diff > 30) {
      return res.send({
        status: 401,
        message: "Not allowed to edit after 30 mins of creation",
      });
    }

    // if < 30, then update the blog

    const oldBlogDb = await blogObj.updateBlog();

    return res.send({
      status: 200,
      message: "Update successfull",
      data: oldBlogDb,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      status: 400,
      message: "Data Error",
      error: err,
    });
  }
});

BlogRouter.post("/delete-blog", async (req, res) => {
  const blogId = req.body.blogId;
  const userId = req.session.user.userId;

  try {
    //find the blog with blogId
    const blogObj = new Blogs({ userId, blogId });
    const blogDb = await blogObj.getBlogDataFromId();

    if (!blogDb.userId.equals(userId)) {
      return res.send({
        status: 401,
        message: "Not allowed to delete, Authorization Failed",
      });
    }

    const oldBlogDb = await blogObj.deleteBlog();

    return res.send({
      status: 200,
      message: "Delete successfull",
      data: oldBlogDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Data Error",
      error: error,
    });
  }
});

module.exports = BlogRouter;
