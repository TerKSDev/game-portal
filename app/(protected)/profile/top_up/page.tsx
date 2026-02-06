import { auth } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PATHS } from "@/app/_config/routes";
import TopUpForm from "./TopUpForm";

export const metadata = {
  title: "Top Up",
  description: "Add orbs to your Game Portal wallet.",
};

export const dynamic = "force-dynamic";

export default async function TopUp() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect(PATHS.LOGIN);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      orbs: true,
    },
  });

  if (!user) {
    redirect(PATHS.PROFILE);
  }

  const currentOrbs = user.orbs;

  return (
    <div className="flex flex-1 pt-32 px-4 sm:px-6 lg:px-8 pb-12 min-h-screen">
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Top Up Orbs
        </h1>
        <TopUpForm currentOrbs={currentOrbs} />
      </div>
    </div>
  );
}
