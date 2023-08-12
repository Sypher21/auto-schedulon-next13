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

        const team = await prismadb.team.deleteMany({
            where:{
                id: params.teamId,
                userId,
            },
        });

        return NextResponse.json(team);

    } catch (error) {
        console.log("[TEAM_DELETE]", error)
        return new NextResponse("Internal error", {status: 500})
    }
    
};