const cron = require("node-cron");
const BlogSchema = require("./Schemas/BlogSchema");
const clc = require("cli-color");

function cleanUpBin() {
  cron.schedule("* 1 * * *", async () => {
    console.log("cron working");

    //find the blogs where isDeleted is true
    const deletedBlogs = await BlogSchema.aggregate([
      { $match: { isDeleted: true } },
    ]);

    if (deletedBlogs.length > 0) {
      deletedBlogs.forEach(async (blog) => {
        //check the time if it is greater than 30 days or not
        //console.log(new Date(blog.deletionDateTime).getTime());

        const diff =
          (Date.now() - new Date(blog.deletionDateTime).getTime()) /
          (1000 * 60 * 60 * 24);
        console.log(diff);

        //if > 30 days find and delete

        if (diff > 30) {
          await BlogSchema.findOneAndDelete({ _id: blog._id })
            .then(() => {
              console.log(clc.green(`Blog deleted successfully : ${blog._id}`));
            })
            .catch((err) => {
              console.log(clc.red(err));
            });
        }
      });
    }

    // console.log(deletedBlogs);
  });
}

module.exports = cleanUpBin;
