import React from 'react'
import Link from "next/link";
import connectDB from "../../lib/mongodb";
import Product from "";

async function getProductById(id) {
  if (!id) {
    return null;
  }

  try {
    await connectDB();
    const project = await Project.findById(id).lean();
    return project;
  } catch (error) {
    return null;
  }
}

export default async function ProductSlugPage({params}) {
  const { id } = params;
  const project = await getProductById(id);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="bg-[#c8c8c8] w-screen min-h-screen">
      <div className="bg-[#dc965a] w-100% p-2 m-5">
        <h1 className="text-5xl text-[#242325]">{project.title}</h1>
        <p className="text-lg text-[#242325] mt-4">{project.description}</p>
        <Link href={project.link} className="text-blue-500 mt-4 inline-block">View Project</Link>
      </div>
    </div>
  );
}