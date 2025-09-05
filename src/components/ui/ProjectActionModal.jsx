import React from "react";
import { FiChevronDown } from "react-icons/fi";

export function ProjectActionModal({ isOpen, onClose, projectId }) {
  if (!isOpen) return null;

  return (
    <div className="absolute bg-white shadow-lg rounded-md z-50 w-48">
      <div className="flex flex-col">

        <button className="text-sm text-gray-700 w-full text-left p-2 hover:bg-gray-100">
          Copy link
        </button>

        <button className="text-sm text-gray-700 w-full text-left p-2 hover:bg-gray-100">
          Add flag
        </button>
        <button className="text-sm text-gray-700 w-full text-left p-2 hover:bg-gray-100 flex justify-between items-center">
          Assignee <FiChevronDown />
        </button>
        <button className="text-sm text-gray-700 w-full text-left p-2 hover:bg-gray-100 flex justify-between items-center">
          Priority <FiChevronDown />
        </button>


        <button className="text-red-600 text-sm w-full text-left p-2 hover:bg-red-100" >
          Delete
        </button>
      </div>
    </div>
  );
}
