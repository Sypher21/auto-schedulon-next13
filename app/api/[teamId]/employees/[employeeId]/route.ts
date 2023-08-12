import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { clerkClient } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  {params}: {params: { employeeId: string} } 
  ) {
  try {
      if (!params.employeeId) {
        return new NextResponse("Team id is required", { status: 400 });
      }

      const employee = await prismadb.employee.findUnique({
          where:{
              id: params.employeeId,
          },
      });
     

      return NextResponse.json(employee);

  } catch (error) {
      console.log("[EMPLOYEE_GET]", error)
      return new NextResponse("Internal error", {status: 500})
  }
  
};


export async function PATCH(
    req: Request,
    {params}: {params: {teamId: string, employeeId: string} } 
    ) {
    try {
        const {userId} = auth();

        const body = await req.json();

        const { firstName, lastName, email, role, hours } = body;

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        if (!firstName) {
            return new NextResponse("Firstname is required", { status: 400 });
          }
      
          if (!lastName) {
            return new NextResponse("Lastname is required", { status: 400 });
          }
      
          if (!email) {
            return new NextResponse("Email is required", { status: 400 });
          }
      
          if (!hours) {
            return new NextResponse("Hours are required", { status: 400 });
          }

        if (!params.employeeId) {
            return new NextResponse("Employee id is required", { status: 400 });
          }
        try {
          const teamByUserId = await prismadb.team.findFirst({
            where: {
              id: params.teamId,
              userId,
            },
          });

          if (!teamByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
          }
        } catch (error) {
          return new NextResponse("Internal error", { status: 500 });
        }

        const employee = await prismadb.employee.updateMany({
            where:{
                id: params.employeeId,
            },
            data: {
                firstName, 
                lastName, 
                email, 
                role, 
                hours
            }
        });
        return NextResponse.json(employee);

    } catch (error) {
        console.log("[EMPLOYEE_PATCH]", error)
        return new NextResponse("Internal error", {status: 500})
    }
    
};

export async function DELETE(
    req: Request,
    {params}: {params: {teamId: string, employeeId: string} } 
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
          const checkForAdminInTeam = await prismadb.employee.findFirst({
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
    
          if (checkForAdminInTeam?.role !== "Admin" ) {
            return new NextResponse("Unauthorized", { status: 403 });
          }
        } catch (error) {
          return new NextResponse("Internal error", { status: 500 });
        } 
       
        const clerkUserId = await prismadb.employee.findFirst({
            where: {
                id: params.employeeId,
            }
        })
        console.log(clerkUserId?.userId, "den gibts");
        if(clerkUserId) {
            await clerkClient.users.deleteUser(clerkUserId.userId);
        }

        const employee = await prismadb.employee.deleteMany({
            where:{
                id: params.employeeId,
            },
        });
       

        return NextResponse.json(employee);

    } catch (error) {
        console.log("[EMPLOYEE_DELETE]", error)
        return new NextResponse("Internal error", {status: 500})
    }
    
};