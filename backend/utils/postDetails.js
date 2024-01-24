const User = require("../models/MongoUser");
const Post = require("../models/MongoPost");

async function fetchQuoteData(quoteId) {
  const quote = await Post.findById(quoteId);
  const user = await User.findById(quote.user_id);
  return {
    id: quote.id,
    text: quote.text,
    user: {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
    },
    date: quote.date,
  };
}

const fetchPostDetails = async (posts) => {
  const postsDetails = await Promise.all(
    posts.map(async (post) => {
      const quoteData = post.quote_id
        ? await fetchQuoteData(post.quote_id)
        : null;
      const referenceData = post.reference_id
        ? await Post.findById(post.reference_id)
        : null;

      let user = await User.findById(post.user_id);
      return {
        id: post.id,
        text: post.text,
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        },
        comments: post.comments,
        date: post.date,
        quote: quoteData,
        reference: referenceData,
      };
    })
  );

  return postsDetails;
};

module.exports = { fetchPostDetails, fetchQuoteData };
