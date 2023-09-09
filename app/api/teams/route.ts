import { auth, clerkClient } from "@clerk/nextjs"
import { NextResponse } from "next/server"


import prismadb from "@/lib/prismadb";
import { Employee } from "@prisma/client";
import { AxiosError } from "axios";


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
    
        const employeeData = await clerkClient.users.getUser(userId);
        

        const team = await prismadb.team.create({
            data: {
                name,
                userId
            }
        });

        try {
          if (employeeData.firstName && employeeData.lastName) {
            const checkIfEmployeeExists = await prismadb.employee.findMany({
              where: {
                userId: userId,
              },
            });
            if (checkIfEmployeeExists) {
              await prismadb.employee.update({
                where: {
                  userId: userId,
                },
                data: {
                  teams: {
                    connect: {
                      id: team.id,
                    },
                  },
                },
              });
            } else {
              await prismadb.employee.create({
                data: {
                  firstName: employeeData.firstName,
                  lastName: employeeData.lastName,
                  email: employeeData.emailAddresses[0].emailAddress,
                  userId: userId,
                  role: "Admin",
                  hours: 0,
                  imageUrl: employeeData.imageUrl,
                  teams: {
                    connect: {
                      id: team.id,
                    },
                  },
                },
              });
            }
          }
        } catch (error) {
          return new NextResponse("Internal error", { status: 500 });
        }

        return NextResponse.json(team);

    } catch (error) {
        console.log("[TEAMS_POST]", error)
        return new NextResponse("Internal error", {status: 500})
    }
    
}