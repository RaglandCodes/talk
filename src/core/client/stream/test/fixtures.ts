export const users = [
  {
    id: "user-0",
    username: "Markus",
  },
  {
    id: "user-1",
    username: "Lukas",
  },
  {
    id: "user-2",
    username: "Isabelle",
  },
];

export const comments = [
  {
    id: "comment-0",
    author: users[0],
    body: "Joining Too",
    createdAt: "2018-07-06T18:24:00",
  },
  {
    id: "comment-1",
    author: users[1],
    body: "What's up?",
    createdAt: "2018-07-06T18:20:00",
  },
  {
    id: "comment-2",
    author: users[2],
    body: "Hey!",
    createdAt: "2018-07-06T18:14:00",
  },
];

export const assets = [
  {
    id: "asset-1",
    isClosed: false,
    comments: {
      edges: [
        { node: comments[0], cursor: comments[0].createdAt },
        { node: comments[1], cursor: comments[1].createdAt },
      ],
      pageInfo: {
        hasNextPage: false,
      },
    },
  },
];
