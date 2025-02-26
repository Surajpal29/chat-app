import { LogOut, Menu, SunMoon, User } from 'lucide-react';
import { Link } from "react-router-dom";
import { useAuthStore } from '../store/useAuthStore';
import { useRef } from 'react';

const DrawerShownOnlyInMobileScreen = () => {

    const { authUser, logout } = useAuthStore()
    
    const drawerRef = useRef(null); // 🔥 Drawer ka reference store karne ke liye useRef

    const closeDrawer = () => {
      if (drawerRef.current) {
        drawerRef.current.checked = false; // 🔥 Drawer close karne ke liye checkbox unchecked
      }
    };
  return (
    <div className="flex md:hidden justify-end drawer drawer-end">
      <input
        id="my-drawer-4"
        type="checkbox"
        className="drawer-toggle"
        ref={drawerRef}
      />
      <div className="drawer-content">
        {/* Page content here */}
        <label htmlFor="my-drawer-4" className="drawer-button ">
          <Menu />
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content justify-start min-h-full w-50 p-4">
          {/* Sidebar content here */}
          <div className="flex flex-col items-start gap-2 ">
            {authUser && (
              <>
                <div className="border-b w-full">
                  <img
                    src={authUser.profilePic || "/avatar.png"}
                    alt="profilepic"
                    className="size-20 rounded-full"
                  />
                  <h3 className="font-bold text-2xl my-3 capitalize">
                    {authUser.fullName}
                  </h3>
                </div>
                <div className=" flex flex-col gap-3">
                  <Link
                    to="/profile"
                    className={`flex items-center gap-2`}
                    onClick={closeDrawer}>
                    <User className="size-5" />
                    <span className=" sm:inline">Profile</span>
                  </Link>

                  <Link
                    to="settings"
                    className={`flex items-center gap-2 transition-colors`}
                    onClick={closeDrawer}>
                    <SunMoon className="w-4 h-4" />
                    <span className="sm:inline">Themes</span>
                  </Link>

                  <button
                    className="flex gap-2 items-center text-red-500"
                                      onClick={() => (logout(), closeDrawer() )}>
                    <LogOut className="size-5" />
                    <span className="sm:inline">Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
}

export default DrawerShownOnlyInMobileScreen