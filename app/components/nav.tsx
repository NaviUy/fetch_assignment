"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Nav({api}: {api:string}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  async function logoutHandler() {
    try {
        await fetch(`${api}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        router.push('/login');
    } catch(error) {
        console.error(error);
    }
  }

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-white shadow-md transform transition-transform duration-300 z-20 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 mt-20 flex justify-center items-center">
            <button onClick={logoutHandler} className="text-black text-2xl hover:underline">Logout</button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div className="flex flex-row-reverse w-full p-6 z-20 relative">
        <div
          className="w-10 h-8 flex flex-col justify-between items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className={`block h-1 w-full bg-white rounded transition-all ${
              isOpen ? "rotate-45 translate-y-4 !bg-black" : ""
            }`}
          ></span>
          <span
            className={`block h-1 w-full bg-white rounded transition-all ${
              isOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block h-1 w-full bg-white rounded transition-all ${
              isOpen ? "-rotate-45 -translate-y-3 !bg-black" : ""
            }`}
          ></span>
        </div>
      </div>
    </>
  );
}
