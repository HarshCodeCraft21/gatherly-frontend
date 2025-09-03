import React from 'react'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from 'react-toastify';
const GenerateAI = async (description) => {
  const GEMINI_API_KEY = "AIzaSyDqXHj3tCZ4DLtRMgKpgnVRBJh1OawD_K8";
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  if (!description) {
    toast.error("fill out require field to processed ai");
  }
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(`write a short description of ${description}`);
  const text = result.response.text();

  return text;
}

export default GenerateAI;
