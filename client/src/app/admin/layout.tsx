import React from "react";

import Reset from "../../components/admin/resetStore";
import MakeAdmin from "../../components/admin/makeAdmin";
import AdminSidebar from "../../components/admin/adminSidebar";
function layout({ children }) {
  return (
    <div className="flex flex-row justify-start items-center ">
      <div className="border border-r border-charcoal w-1/6 ">
        <AdminSidebar />
      </div>

      {children}
    </div>
  );
}

export default layout;
