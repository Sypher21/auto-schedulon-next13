import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { clerkClient } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { boolean } from "zod";

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

        if (!firstName || !lastName || !email || !hours) {
            return new NextResponse("Fields are required", { status: 400 });
        }

        if (!params.employeeId) {
            return new NextResponse("Employee id is required", { status: 400 });
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
       
        const checkIsInMoreTeams = await prismadb.employee.findFirst({
            where: {
                id: params.employeeId,
            },
            include:{
              _count: {
                select: {
                  teams: true
                },
              }
            }
        })

      var disconnectFromTeam: boolean = false;

        if(checkIsInMoreTeams) {
          // Teams count < 2 (1 oder 0) dann lösche die Email auch bei AuthProvider!
          if(checkIsInMoreTeams?._count.teams < 2){
            await clerkClient.users.deleteUser(checkIsInMoreTeams.userId);

          } else {
            disconnectFromTeam = true;
          }
        }

        var employee;

        if(!disconnectFromTeam) {

         employee = await prismadb.employee.deleteMany({
            where:{
                id: params.employeeId,
            },
          });
        } else {
         employee = await prismadb.employee.update({
            where:{
                id: params.employeeId,
            },
            data:{
              teams:{
                disconnect:{
                  id: params.teamId
                }
              }
            }
          });
        }
        

        return NextResponse.json(employee);

    } catch (error) {
        console.log("[EMPLOYEE_DELETE]", error)
        return new NextResponse("Internal error", {status: 500})
    }
    
};