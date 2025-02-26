import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore"
import {useAuthStore} from "../store/useAuthStore.js"
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users,Search } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUserLoading } = useChatStore();
  
 

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)
  const [searchText, setSearchText] = useState("")
  
    useEffect(() => {
        getUsers()
    }, [getUsers])
  
  let filteredUsers = users.filter(
    (user) =>
      (!showOnlineOnly || onlineUsers.includes(user._id)) &&
      user.fullName.toLowerCase().includes(searchText.toLowerCase())
  );


    
    if(isUserLoading)  return <SidebarSkeleton/>   
  return (
    <aside
      className={`h-full min-w-56 w-full md:w-20 lg:w-72 border-r border-base-300 justify-start flex flex-col transition-all duration-200 ${
        selectedUser ? "hidden md:flex " : ""
      }`}>
      <div className="border-b border-base-300 flex justify-between w-full p-5">
        <div className="">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium  block">Contacts</span>
          </div>
          {/* Todo online filter toggle */}
          <div className="mt-3 flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className=" radio checkboc-sm"
              />
              <span className="text-sm">Show Online Only</span>
            </label>
            <span className="text-xs text-zinc-500 ">
              ({onlineUsers.length - 1} online)
            </span>
          </div>
        </div>
        <div className="dropdown dropdown-left">
          <div
            tabIndex={0}
            role="button"
            className="tooltip tooltip-left"
            data-tip="search">
            <Search size={25} strokeWidth={3} className="font-extrabold" />
          </div>
          <div
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit  p-2 shadow "
            >
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow w-32"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                autoFocus
              />
             
            </label>
          </div>
        </div>
      </div>
      <div className="overflow-y-auto w-full py-1">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-start md:items-center md:gap-3 hover:bg-base-300  transition-colors ${
              selectedUser?._id ? "bg-base-600 ring-1 ring-base-300" : ""
            } `}>
            <div className="relative mr-5 md:mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>
            {/* user info only visible on large screens */}
            <div className=" block  text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length == 0 && (
          <div className="text-center text-zinc-500 py-4">No online Users</div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar