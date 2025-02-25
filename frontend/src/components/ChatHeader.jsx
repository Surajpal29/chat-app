import { CircleX, Mail, User,Copy } from "lucide-react";
import { useChatStore } from "../store/useChatStore"
import { useAuthStore } from "../store/useAuthStore";
import { useRef } from "react";
import toast from "react-hot-toast";
const ChatHeader = () => {
  
  const textRef = useRef(null);

    const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  

   const copyToClipboard = () => {
     const text = textRef.current.innerText;
     navigator.clipboard
       .writeText(text)
       .then(() => toast.success("Copied to clipboard! ✅"))
       .catch((err) => console.error("Error copying text: ", err));
   };

  return (
    <div className="p-2.5 border-b bordr-base-300  ">
      <div className="flex items-center justify-between">
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
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box flex flex-col gap-5">
            <div className="flex justify-between relative ">
              <div className="size-32 ">
                <img
                  src={selectedUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4  "
                />
              </div>
              <div className="modal-action absolute top-0 right-0">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="">
                    <CircleX />
                  </button>
                </form>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {selectedUser?.fullName}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
                <div className="w-full flex items-center justify-between px-4 py-2.5 bg-base-200 rounded-lg border ">
                  <p
                    ref={textRef}
                    className=" flex items-center justify-between w-full ">
                    {selectedUser?.email}
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn m-1 flex items-center justify-center dropdown dropdown-left dropdown-hover">
                      <Copy onClick={copyToClipboard}  />
                    <ul
                      tabIndex={0}
                      className="dropdown-content bg-base-100 rounded-box z-[1]  p-2 shadow">
                      <li>
                        copy 
                      </li>
                      
                    </ul>
                    </div>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </dialog>

        {/* close btn */}
        <button onClick={() => setSelectedUser(null)}>
          <CircleX />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader



