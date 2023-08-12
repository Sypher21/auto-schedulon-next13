import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

import { SettingsForm } from "./components/settings-form";

const SettingsPage = async ({
  params
}: {
  params: { teamId: string }
}) => {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const team = await prismadb.team.findFirst({
    where: {
      id: params.teamId,
      userId
    }
  });

  if (!team) {
    redirect('/');
  }

    return (  
        <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <SettingsForm initialData={team} />
        </div>
      </div>
    );
}
 
export default SettingsPage;