import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";

interface DashboardPageProps {
  params: {
    teamId: string;
  };
};



const DashboardPage: React.FC<DashboardPageProps> = async ({
  params
}) => {

  const team = await prismadb.team.findFirst({
    where: {
      id: params.teamId
    }
  })

  await prismadb.$disconnect();
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Übersicht deiner Gruppe" />
        <Separator />
        <h2>{team?.name}</h2>
      </div>
    </div>
  );
}

export default DashboardPage