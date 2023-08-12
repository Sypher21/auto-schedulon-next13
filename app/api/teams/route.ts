import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


import prismadb from "@/lib/prismadb";


export async function POST(
    req: Request,
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


        const team = await prismadb.team.create({
            data: {
                name,
                userId
            }
        });

        return NextResponse.json(team);

    } catch (error) {
        console.log("[TEAMS_POST]", error)
        return new NextResponse("Internal error", {status: 500})
    }
    
}