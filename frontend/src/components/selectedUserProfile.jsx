import { CircleX, Copy, Mail, User } from 'lucide-react';

import { useChatStore } from '../store/useChatStore';
import { useRef } from 'react';
import toast from 'react-hot-toast';

const SelectedUserProfile = () => {
     
  
  const textRef = useRef(null);

  const copyToClipboard = () => {
    const text = textRef.current.innerText;
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard! ✅"))
      .catch((err) => console.error("Error copying text: ", err));
  };(null);

  const { selectedUser } = useChatStore();
  
  return (
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
                  <Copy onClick={copyToClipboard} />
                  <ul
                    tabIndex={0}
                    className="dropdown-content bg-base-100 rounded-box z-[1]  p-2 shadow">
                    <li>copy</li>
                  </ul>
                </div>
              </p>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default SelectedUserProfile