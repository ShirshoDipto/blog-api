const Post = require("./models/post");
const Comment = require("./models/comment");
const Reply = require("./models/reply");
const Like = require("./models/like");
const mongoose = require("mongoose");
require("dotenv").config();

async function createPostWithLotOfCommentsAndReplies() {
  try {
    const post = new Post({
      title: "Test Post for delete operation. ",
      content: "Test content for delete opration. ",
      author: {
        authorId: "6403019202a8f139409779e7",
        firstName: "Shirsho",
        lastName: "Dipto",
      },
      isPublished: false,
    });

    allComments = [];
    allReplies = [];

    for (let i = 1; i < 21; i++) {
      const comment = new Comment({
        content: `Test Comment ${i}`,
        author: {
          authorId: `6403019202a8f139409779e7`,
          firstName: "Random",
          lastName: "Guy",
        },
        postId: `${post._id}`,
      });
      allComments.push(comment);
      post.numComments += 1;
      console.log(`...Comment ${i} pushed. `);
      for (let x = 1; x < 6; x++) {
        const reply = new Reply({
          author: {
            authorId: "6403019202a8f139409779e7",
            firstName: "Random",
            lastName: "Guy",
          },
          content: `Test reply ${i} ${x}`,
          commentId: `${comment._id}`,
        });
        allReplies.push(reply);
        comment.numReplies += 1;
        console.log(`...Reply ${x} pushed. `);
      }
    }
    await Promise.all([
      Comment.insertMany(allComments),
      Reply.insertMany(allReplies),
      post.save(),
    ]);
    console.log("Finished. ");
    console.log(post._id);
  } catch (err) {
    console.log(err);
  }
}

async function createLikesForComments() {
  const blogOwner = "6403019202a8f139409779e7";
  const otherUser = "641bf2101af1040baa64fcbe";
  const commentIdOne = "64084bb1c340d86121d155e2";
  // test comment 10
  const commentIdTwo = "64084bb1c340d86121d155e8";
  // test comment 11
  let allLikesOne = [];
  let commentIdOneLikes = 0;
  let allLikesTwo = [];
  let commentIdTwoLikes = 0;

  for (let i = 1; i < 11; i++) {
    const like = new Like({
      author: blogOwner,
      referenceId: commentIdOne,
    });
    allLikesOne.push(like);
    commentIdOneLikes++;
  }

  for (let i = 1; i < 11; i++) {
    const like = new Like({
      author: otherUser,
      referenceId: commentIdTwo,
    });
    allLikesTwo.push(like);
    commentIdTwoLikes++;
  }

  const comment1 = await Comment.findById(commentIdOne);
  const comment2 = await Comment.findById(commentIdTwo);

  // console.log(comment1);
  // console.log(comment2);

  comment1.numLikes = commentIdOneLikes;
  comment2.numLikes = commentIdTwoLikes;

  await Promise.all([
    Like.insertMany(allLikesOne),
    Like.insertMany(allLikesTwo),
    comment1.save(),
    comment2.save(),
  ]);

  console.log("finished");
}

mongoose.set("strictQuery", false);
const mongodb = process.env.MONGODB_URI;
async function main() {
  await mongoose.connect(mongodb);
  console.log("Connection Successful. ");
  // an id "640189b3c2dc3b9e1a4b2446"
  // const newReply = new Reply({
  //   author: {
  //     authorId: "640189b3c2dc3b9e1a4b2446",
  //     firstName: "Shusme",
  //     lastName: "Islam"
  //   },
  //   content: "Hello amr jaan",
  //   numLikes: "5000",
  // })

  // const savedReply = await newReply.save()

  // const newComment = new Comment({
  //   content: "Hello",
  //   author: {
  //     authorId: "640189b3c2dc3b9e1a4b2446",
  //     firstName: "Shirsho",
  //     lastName: "Dipto"
  //   },
  //   replies: [savedReply._id],
  //   numLikes: "1000",
  //   postId: "640189b3c2dc3b9e1a4b2446"
  // })

  // const savedComment = await newComment.save()
  // const comment = await Comment.findOne({}).populate("replies")
  // console.log(comment.replies[0].date_formatted)

  // const newCommentLike = new CommentLike({
  //   author: "640189b3c2dc3b9e1a4b2446",
  // })

  // const savedLikeComment = await newCommentLike.save()
  // console.log("comment like", savedLikeComment)

  // const newPostLike = new PostLike({
  //   author: "640189b3c2dc3b9e1a4b2446",
  // })

  // const savedLikePost = await newPostLike.save()
  // console.log("post like", savedLikePost)

  // const newPost = new Post({
  //   title: "New title 2",
  //   content: "Hahahahahahahahahahahaha",
  //   author: {
  //     authorId: "640189b3c2dc3b9e1a4b2446",
  //     firstName: "Ahmad",
  //     lastName: "Nibras"
  //   },
  //   numLikes: "200",
  //   numComments: "100",
  //   isPublished: false
  // })

  // const savedPost = await newPost.save()

  // console.log(savedPost)
  // createPostWithLotOfCommentsAndReplies();
  createLikesForComments();
}

main().catch((err) => console.log(err));
