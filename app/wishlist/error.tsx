"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">
        Oops! You need to be signed in to view your wishlist.
      </h1>
      <p className="text-gray-400 mb-8">
        Please sign in to access your wishlist.
      </p>
      <Link href="/sign-in">
        <Button variant={"default"}>Sign In</Button>
      </Link>
    </div>
  );
};

export default Error;
