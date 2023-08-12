import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import TeamSwitcher from "@/components/team-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

const Navbar = async () => {

    const { userId } = auth();

    if (!userId) {
      redirect('/sign-in');
    }
    
    const teams = await prismadb.team.findMany({
      include:{
        employees:{
          where: {
            userId,
          }
        }
      }
    });

  return (
    <div className="border-h">
      <div className="flex h-16 items-center px-4">
        <TeamSwitcher items={teams}/>
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
            <UserButton afterSignOutUrl="/" showName={true}/>
        </div>
      </div>
    </div>
  );
}

export default Navbar