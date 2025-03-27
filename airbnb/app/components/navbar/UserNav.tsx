"use client";
import { useState } from "react";
import MenuLink from "./MenuLink";
import LoginModal from "../modals/LoginModal"; // component
import useLoginModal from "@/app/hooks/useLoginModal"; // hook
import useSignupModal from "@/app/hooks/useSignupModal";
import LogoutButton from "../LogoutButton";

interface UserNavProps {
  userId?: string | null;
}

const UserNav: React.FC<UserNavProps> = ({ userId }) => {
  const loginModal = useLoginModal();
  const signupModal = useSignupModal();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-2 cursor-pointer relative inline-block border rounded-full hover:shadow-md hover:shadow-gray-400 transition-shadow duration-200">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>

        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="w-[220px] absolute top-[50px] right-0 bg-white border rounded-xl shadow-md flex flex-col cursor-pointer">
          {userId ? (
            <>
              <LogoutButton />
              {/* Show these links only if user is logged in */}
              <MenuLink
                label="Airbnb Your Home"
                onClick={() => console.log("Clicked Button")}
              />
              <MenuLink
                label="Host an Experience"
                onClick={() => console.log("Clicked Button")}
              />
            </>
          ) : (
            <>
              {/* Show these links if user is not logged in */}
              <MenuLink
                label="Login"
                onClick={() => {
                  setIsOpen(false); // making the MenuLink disappear.
                  loginModal.open(); // Correctly call open() from the hook
                }}
              />

              <MenuLink
                label="Sign up"
                onClick={() => {
                  setIsOpen(false); // making the MenuLink disappear.
                  signupModal.open(); // Correctly call open() from the hook
                }}
              />
            </>
          )}

          <hr />
          {/* "Help Center" is shown regardless of login status */}
          <MenuLink
            label="Help Center"
            onClick={() => console.log("Clicked Button")}
          />
        </div>
      )}

      {/* Render the LoginModal component */}
      <LoginModal />
    </div>
  );
};

export default UserNav;
