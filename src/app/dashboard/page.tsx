"use client";

import AppSidebar from "./(admin)/sidebar/page";

const Admin = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 border-r">
        <AppSidebar />
      </div>

      {/* Content Area */}
      <div className="flex flex-1 items justify-center p-5">
        <div className="w-full max-w-5xl">{children}</div>
      </div>
    </div>
  );
};

export default Admin;
