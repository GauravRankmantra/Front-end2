import React, { useEffect, useState } from "react";
import axios from "axios";

const Terms = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}api/v1/terms`)
      .then((res) => setContent(res.data?.content || "<p>Terms And Conditions not found.</p>"));
  }, []);

  return (
    <div className="bg-gray-900 py-20">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
        <h1 className="text-4xl font-extrabold text-center text-cyan-500 mb-10">
          Our Terms And Conditions
        </h1>
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 text-gray-300 leading-relaxed">
          <div
            className="prose prose-sm sm:prose-base lg:prose-lg text-gray-300 max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <div className="mt-8 border-t border-gray-700 pt-6 text-sm text-gray-500">
            <p>Last updated: {content.updatedAt}</p>
            <p>If you have any questions or concerns about our Privacy Policy, please contact us.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;