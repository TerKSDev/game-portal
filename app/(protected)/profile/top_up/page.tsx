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
    <main className="flex flex-1 w-full min-h-screen justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col w-full max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-5xl font-black text-zinc-200">
            Top Up Orbs
          </h1>
          <p className="text-zinc-500 mt-2 text-sm sm:text-base">
            Add orbs to your Game Portal wallet
          </p>
        </div>
        <TopUpForm currentOrbs={currentOrbs} />
      </div>
    </main>
  );
}
