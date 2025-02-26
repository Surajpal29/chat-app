import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null); // 🆕 Emoji Picker ke liye ref
  const { sendMessage } = useChatStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false); // 🆕 Bahar click hone par picker band ho jayega
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleEmojiClick = (emoji) => {
    setText((prev) => prev + emoji.emoji);
  };

  return (
    <div className="p-4 w-full bottom-0 relative">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button">
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="relative flex items-center gap-2">
        {/* Input Box with Emoji Inside */}
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg  input-sm sm:input-md md:input-md  pr-10"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {/* Emoji Icon Inside Input */}
          <button
            type="button"
            className="absolute right-2 bottom-[-50%] md:bottom-[-10%] -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <Smile size={22} />
          </button>
        </div>

        {/* Emoji Picker (Dropdown) */}
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-12 right-4 bg-white shadow-lg rounded-lg z-10">
            <EmojiPicker
              width={300}
              unified="1f423"
              onEmojiClick={handleEmojiClick}
            />
          </div>
        )}

        {/* File Input */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {/* Image Upload Button */}
        <button
          type="button"
          className={`flex size-7 md:size-10 items-center justify-center rounded-full ${
            imagePreview ? "text-emerald-500" : "text-zinc-400"
          }`}
          onClick={() => fileInputRef.current?.click()}>
          <Image size={30}  />
        </button>

        {/* Send Button */}
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}>
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
