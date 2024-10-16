import { randomUUID } from "crypto";
import { db } from "./client";
import { comments, posts } from "./schema";

async function seed() {
  const postsData = [
    {
      id: randomUUID(),
      title: "Introduction to TypeScript",
      content:
        "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.",
      author: "Alice Johnson",
    },
    {
      id: randomUUID(),
      title: "React Hooks Explained",
      content:
        "Hooks are a new addition in React. They let you use state and other React features without writing a class.",
      author: "Bob Smith",
    },
    {
      id: randomUUID(),
      title: "Python vs JavaScript: A Comparison",
      content:
        "This post compares Python and JavaScript, exploring their similarities and differences.",
      author: "Charlie Brown",
    },
  ];

  await db.insert(posts).values(postsData);

  const commentsData = [
    {
      id: randomUUID(),
      postId: postsData[0].id,
      content:
        "Great introduction! Looking forward to more TypeScript content.",
      author: "User123",
    },
    {
      id: randomUUID(),
      postId: postsData[0].id,
      content: "Could you explain more about TypeScript interfaces?",
      author: "TypeScriptFan",
    },
    {
      id: randomUUID(),
      postId: postsData[0].id,
      content: "How does TypeScript compare to Flow?",
      author: "JavaScriptDev",
    },
    {
      id: randomUUID(),
      postId: postsData[1].id,
      content: "Hooks have revolutionized how I write React components!",
      author: "ReactEnthusiast",
    },
    {
      id: randomUUID(),
      postId: postsData[1].id,
      content: "Can you write a post about custom hooks?",
      author: "HookLearner",
    },
    {
      id: randomUUID(),
      postId: postsData[2].id,
      content:
        "Interesting comparison. I prefer Python for data science tasks.",
      author: "DataScientist101",
    },
  ];

  await db.insert(comments).values(commentsData);

  console.log("Seed data inserted successfully!");
}

seed().catch((error) => {
  console.error("Error seeding data:", error);
  process.exit(1);
});
