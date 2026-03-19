const mockData = {
  members: [
    { id: 1, name: 'Alice', age: 30, badges: [1, 2] },
    { id: 2, name: 'Bob', age: 25, badges: [2] },
    { id: 3, name: 'Charlie', age: 28, badges: [1, 3] },
  ],
  posts: [
    { id: 1, memberId: 1, content: 'Hello, this is a post!', date: '2026-03-19 05:10:14' },
    { id: 2, memberId: 2, content: 'Another post!', date: '2026-03-19 05:10:15' },
  ],
  badges: [
    { id: 1, name: 'Contributor' },
    { id: 2, name: 'Commenter' },
    { id: 3, name: 'Liker' },
  ],
  interactions: [
    { postId: 1, memberId: 2, type: 'comment', content: 'Nice post!' },
    { postId: 1, memberId: 3, type: 'like' },
  ],
};

export default mockData;