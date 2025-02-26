import { CircleX, EllipsisVertical, Trash2 } from "lucide-react";
import { useChatStore } from "../store/useChatStore"
import { useAuthStore } from "../store/useAuthStore";

import SelectedUserProfile from "./selectedUserProfile";
const ChatHeader = () => {
  
  const { selectedUser, setSelectedUser, deleteAllMessages } = useChatStore();
  const { onlineUsers,authUser } = useAuthStore();
  
  const handleDeleteAllMessages = async () => {
    await deleteAllMessages(authUser._id, selectedUser._id);
  };

  return (
    <div className="p-2.5 border-b bordr-base-300  ">
      <div className="flex items-center justify-between">
        <div className="flex items-center  gap-5">
          <button onClick={() => setSelectedUser(null)}>
            <CircleX />
          </button>
          {/* Open the modal using document.getElementById('ID').showModal() method */}
          <button
            className=""
            onClick={() => document.getElementById("my_modal_1").showModal()}>
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="avatar">
                <div className="size-10 rounded-full relative">
                  <img
                    src={selectedUser.profilePic || "/avatar.png"}
                    alt={selectedUser.fullName}
                  />
                </div>
              </div>

              {/* user Info */}
              <div className="flex flex-col items-start">
                <h2 className="font-medium">{selectedUser.fullName}</h2>
                <p className="text-sm text-base-content/70">
                  {onlineUsers.includes(selectedUser._id) ? (
                    <span className="text-green-400">online</span>
                  ) : (
                    "offline"
                  )}
                </p>
              </div>
            </div>
          </button>
          <SelectedUserProfile />

          {/* close btn */}
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className=" m-1">
            <EllipsisVertical/>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content  menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li>
              <span className="flex gap-3" onClick={handleDeleteAllMessages}>
                <Trash2 />
                Delete All
              </span>
            </li>
            
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader



