const BlogDataValidate = ({ title, textBody, userId }) => {
  return new Promise((resolve, reject) => {
    if (!title || !textBody || !userId) {
      reject("Missing credentials");
    }

    if (typeof title !== "string" || typeof textBody !== "string") {
      reject("Invalid Data format");
    }

    if (title.length > 100) {
      reject("Title Length should be less than 100");
    }

    if (textBody.length > 1000) {
      reject("Text body length should be less than 1000");
    }

    resolve();
  });
};

module.exports = { BlogDataValidate };
