import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb";

export async function PATCH(
    req: Request,
    {params}: {params: {teamId: string} } 
    ) {
    try {
        const {userId} = auth();

        const body = await req.json();

        const { name } = body;

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        if(!name) {
            return new NextResponse("Name is required", {status: 400})
        }

        if (!params.teamId) {
            return new NextResponse("Team id is required", { status: 400 });
          }

        const team = await prismadb.team.update({
            where:{
                id: params.teamId,
                },
            include:{
                employees:{
                    where:{
                        userId,
                        role: "Admin"
                    },
                },
            },
            data: {
                name,
            }
        });
        return NextResponse.json(team);

    } catch (error) {
        console.log("[TEAM_PATCH]", error)
        return new NextResponse("Internal error", {status: 500})
    }
    
};

export async function DELETE(
    req: Request,
    {params}: {params: {teamId: string} } 
    ) {
    try {
        const {userId} = auth();


        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        if (!params.teamId) {
            return new NextResponse("Team id is required", { status: 400 });
          }

        try {
            const checkIsAdminInTeam = await prismadb.employee.findFirst({
              where: {
                userId,
              },
              include:{
                teams: {
                  where: {
                    id: params.teamId,
                  },
                },
              },
            });
      
            if (checkIsAdminInTeam?.role !== "Admin" ) {
              return new NextResponse("Unauthorized", { status: 403 });
            }
        } catch (error) {
            return new NextResponse("Internal error", { status: 500 });
        } 

        //deleteing all Refs
        await prismadb.team.update({
            where:{
                id: params.teamId,
            },
            data:{
                employees: {
                    set: [],
                }
            }
        })

        const team = await prismadb.team.delete({
            where:{
                id: params.teamId,
            }
        });

        return NextResponse.json(team);

    } catch (error) {
        console.log("[TEAM_DELETE]", error)
        return new NextResponse("Internal error", {status: 500})
    }
    
};