import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

export default async function DashboardLayout({
    children,
    params
}:{
    children: React.ReactNode
    params: {teamId: string}
}) {
    const {userId} = auth();

    if(!userId) {
        redirect("/sign-in");
    }
     
  
    try {
      const team = await prismadb.team.findFirst({
        include: {
          employees: {
              where:{
                userId
              },
              include: {
                teams:  {
                  where: {
                    id: params.teamId,
                  }
                },
            },
          },
        },
      });
      if (!team) {
        redirect("/");
      }
    } catch (err) {
      redirect("/");
    }


   

   

    return(
        <>
        <Navbar/>
        {children}
        </>
    )
}