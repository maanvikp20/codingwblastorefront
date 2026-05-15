import React from 'react'
import Link from "next/link";
// import connectDB from "../lib/mongodb";

async function getAuthorById(id) {
  if (!id) {
    return null;
  }

  try {
    await connectDB();
    const author = await Author.findById(id).lean();
    return author;
  } catch (error) {
    return null;
  }
}

export default async function AuthorSlugPage({params}) {
  const { id } = params;
  const author = await getAuthorById(id);

  if (!author) {
    return <div>Author not found</div>;
  }

  return (
    <div className="bg-[#c8c8c8] w-screen min-h-screen">
      <div className="bg-[#dc965a] w-100% p-2 m-5">
        <h1 className="text-5xl text-[#242325]">{author.name}</h1>
        <p className="text-lg text-[#242325] mt-4">{author.bio}</p>
        <Link href={author.link} className="text-blue-500 mt-4 inline-block">View Author</Link>
      </div>
    </div>
  );
}
