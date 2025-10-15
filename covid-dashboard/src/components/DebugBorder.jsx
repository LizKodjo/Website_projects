import React from "react";

const DebugBorder = () => {
  return (
    <div className="mb-8 p-4 bg-orange-100 dark:bg-orange-900 rounded-lg">
      <h3 className="font-bold mb-2">Border Debug Test:</h3>
      <div className="flex gap-4 flex-wrap">
        <div className="p-4 bg-white border-l-4 border-l-blue-500 border-2 border-gray-300">
          Tailwind Blue Border
        </div>
        <div className="p-4 bg-white border-l-4 border-l-red-500 border-2 border-gray-300">
          Tailwind Red Border
        </div>
        <div className="p-4 bg-white border-l-4 border-l-green-500 border-2 border-gray-300">
          Tailwind Green Border
        </div>
        <div
          className="p-4 bg-white"
          style={{
            borderLeft: "4px solid #3b82f6",
            border: "2px solid #d1d5db",
          }}
        >
          Inline Blue Border
        </div>
      </div>
    </div>
  );
};

export default DebugBorder;
