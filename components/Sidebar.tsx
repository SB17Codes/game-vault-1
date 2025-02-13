"use client";

import Link from "next/link";
import { useState } from "react";
import { Home, Heart, Menu, X, BookmarkPlus, Gamepad } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const navItems = [{ name: "Home", href: "/", icon: Home }];

const authNavItems = [
  { name: "Favorites", href: "/favorites", icon: Heart },
  { name: "Wishlist", href: "/wishlist", icon: BookmarkPlus },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const { isSignedIn } = useUser();

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-20 text-white"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
      </button>
      <aside
        className={`bg-black w-64 fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 ease-in-out md:static md:block border-r border-gray-800 z-10`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 border-b border-gray-800 px-4">
            <div className=" flex gap-2 ">
              <Gamepad />
              <Link href="/" className="text-white font-semibold">
                GameStack
              </Link>
            </div>
            <button className="md:hidden text-white" onClick={toggleSidebar}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
            {isSignedIn &&
              authNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
