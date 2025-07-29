"use client";

import AppSidebar from "./(admin)/sidebar/page";

const Admin = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-64 border-r">
        <AppSidebar />
      </div>

      <div className="flex flex-1 items justify-center p-5">
        <div className="w-full max-w-5xl">{children}</div>
      </div>
    </div>
  );
};

export default Admin;
