"use client";
import Product from "@/components/Product";
import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

const Page = () => {

  return (
    <div
      style={{ overflowX: "hidden" }}
      className="w-screen h-screen bg-[#D6DEE2] flex flex-col items-center p"
    >
      <p className="text-2xl w-full h-[5%] text-center">
        Info about the custom print page
      </p>
      <div className="w-full h-[110vh] flex flex-row max-sm:items-center max-sm:justify-center max-sm:gap-10 max-sm:flex-col justify-around p-6">
        <div className="h-full w-[50%] max-sm:w-full max-sm:h-[140vh]  flex flex-col items-center gap-7 ">
          <div className="h-[45%] w-[65%] bg-[#dc965a] rounded-2xl flex flex-col justify-center items-center relative">
            <input
              style={{ borderRadius: "inherit" }}
              type="file"
              className="absolute h-full w-full opacity-0 cursor-pointer"
            />
            <FaCloudUploadAlt className="w-[60%] h-[60%] cursor-none" />
            <p className="text-xl cursor-none font-semibold">Upload files</p>
          </div>
          <div className="flex flex-col h-[50%] w-[65%]">
            <p className="font-bold">Suggested Files: </p>
            <Product />
          </div>
        </div>
        <div className="w-[50%] max-sm:w-full max-sm:h-screen h-full border bg-[#dc965a]"></div>
      </div>
    </div>
  );
};

export default Page;
