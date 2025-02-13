import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

const Navbar = async () => {
  const { userId } = await auth();

  return (
    <nav className="bg-black border-b border-gray-800 h-16 flex items-center justify-end px-4">
      {userId ? (
        <UserButton />
      ) : (
        <Link href={"/sign-in"}>
          <button className="text-white">Login</button>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
