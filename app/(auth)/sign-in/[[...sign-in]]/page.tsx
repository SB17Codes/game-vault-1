import { SignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

const Page = async () => {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex justify-center items-center">
      <SignIn />
    </div>
  );
};

export default Page;
