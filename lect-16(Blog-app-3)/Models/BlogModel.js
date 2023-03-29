const { BLOGLIMIT } = require("../privateConstants");
const BlogSchema = require("../Schemas/BlogSchema");
const ObjectId = require("mongodb").ObjectId;

const Blogs = class {
  title;
  textBody;
  userId;
  creationDateTime;

  constructor({ title, textBody, userId, creationDateTime }) {
    this.title = title;
    this.creationDateTime = creationDateTime;
    this.textBody = textBody;
    this.userId = userId;
  }

  createBlog() {
    return new Promise(async (resolve, reject) => {
      this.title.trim();
      this.textBody.trim();

      const blog = new BlogSchema({
        title: this.title,
        textBody: this.textBody,
        creationDateTime: this.creationDateTime,
        userId: this.userId,
      });

      try {
        const blogDb = await blog.save();
        resolve(blogDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static getBlogs({ skip }) {
    return new Promise(async (resolve, reject) => {
      //sort, pagination
      try {
        const blogsDb = await BlogSchema.aggregate([
          { $sort: { creationDateTime: -1 } },
          {
            $facet: {
              data: [{ $skip: parseInt(skip) }, { $limit: BLOGLIMIT }],
            },
          },
        ]);
        console.log(blogsDb[0].data);
        resolve(blogsDb[0].data);
      } catch (error) {
        reject(error);
      }
    });
  }

  static myBlogs({ skip, userId }) {
    return new Promise(async (resolve, reject) => {
      //match, sort, pagination
      console.log(skip, userId);
      try {
        const myBlogsDb = await BlogSchema.aggregate([
          { $match: { userId: new ObjectId(userId) } },
          { $sort: { creationDateTime: -1 } },
          {
            $facet: {
              data: [{ $skip: parseInt(skip) }, { $limit: BLOGLIMIT }],
            },
          },
        ]);

        console.log(myBlogsDb[0].data);

        resolve(myBlogsDb[0].data);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = Blogs;
