import { redirect } from "next/navigation";

import { PATHS } from "@/app/_config/routes";
import { auth } from "@/lib/actions/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect(PATHS.LOGIN);
  }

  return <>{children}</>;
}
