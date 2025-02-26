
import { useAuthStore } from '../store/useAuthStore'
import { Link } from 'react-router-dom'
import { LogOut, Settings, User } from "lucide-react";
import DrawerShownOnlyInMobileScreen from './DrawerShownOnlyInMobileScreen';

const Navbar = () => {
    const {authUser,logout}=useAuthStore()
  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container  md:mx-auto px-5 md:px-24 h-16 flex justify-between items-center gap-5 ">
        <div className="flex items-center gap-8 ">
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              {/* <MessageCircleHeart className="w-5 h-5 text-primary" /> */}
              <img src="/logo.png" alt="logo" />
            </div>
            <h1 className="text-lg font-bold">letstalk</h1>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2 ">
          <Link to="settings" className={`btn btn-sm gap-2 transition-colors`}>
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>

          {authUser && (
            <>
              <Link to="/profile" className={`btn btn-sm gap-2`}>
                <User className="size-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button className="flex gap-2 items-center" onClick={logout}>
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>

        <DrawerShownOnlyInMobileScreen/>
      </div>
    </header>
  );
}

export default Navbar