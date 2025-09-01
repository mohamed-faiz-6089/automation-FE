import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const [isOpen, setIsOpen] = useState(false); 

  return (
<div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex flex-1 flex-col">
        <Header setIsOpen={setIsOpen} />
        <main className="flex-1 overflow-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
