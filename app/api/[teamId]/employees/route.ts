import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { Employee } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { firstName, lastName, email, role, hours } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
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

    let newUserObj = {
        needsUpdate: false,
        existed: false,
        userId: "",
        imageUrl: "",
    };

   
    const sessions = await clerkClient.users.getUserList({
      emailAddress: [email],
    });

    
    if (sessions.length === 0) {
      const user = await clerkClient.users.createUser({
        emailAddress: [email],
        firstName: firstName,
        lastName: lastName,
        password: firstName + "." + lastName + "." + "auto",
      });

      newUserObj = {
        needsUpdate: false,
        existed: false,
        userId: user.id,
        imageUrl: user.imageUrl,
      };
    } else {
      newUserObj = {
        needsUpdate: false,
        existed: true,
        userId: sessions[0].id,
        imageUrl: sessions[0].imageUrl,
      };
    }

    const checkIfEmployeeExists = await prismadb.employee.findUnique({
      where: {
        email: email,
      },
    });
    //  Check ob der Mitarbeiter bereits existiert und
    //  noch nicht einem Team angehört.
    if (checkIfEmployeeExists) {
      await prismadb.team
        .findMany({
          include: {
            employees: {
              where: {
                id: checkIfEmployeeExists.id,
              },
            },
          },
        })
        .then((res) => {
          res.forEach((result) => {
           
            if (result.id !== params.teamId) {
              return newUserObj = { 
                ...newUserObj,
                needsUpdate: true
              }
            }
          });
        });
      }
      // Wenn er im aktuell ausgewähltes Team nicht
      // nicht dabei ist, füge ihn hinzu!
      if(newUserObj.needsUpdate){
      await prismadb.employee.update({
        where: {
          id: checkIfEmployeeExists?.id,
        },
        data: {
          teams: {
            connect: {
              id: params.teamId,
            },
          },
        },
      });
      console.log(checkIfEmployeeExists, "employee existed!");
      return NextResponse.json(checkIfEmployeeExists);
    
      //Erstelle einen Mitarbeiter falls er nicht in der DB existiert
    }else {
      const employee = await prismadb.employee.create({
        data: {
          firstName,
          lastName,
          email,
          role,
          hours,
          imageUrl: newUserObj.imageUrl,
          userId: newUserObj.userId,
          teams: {
            connect: {
              id: params.teamId,
            },
          },
        },
      });

      console.log(employee, "employee didn't exist");
      return NextResponse.json(employee);
    }
  } catch (error) {
    console.log("[EMPLOYEES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function GET(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {

    if (!params.teamId) {
      return new NextResponse("Team id is required", { status: 400 });
    }

    const employees = await prismadb.employee.findMany({
      include: {
        teams:{
          where:{
            id: params.teamId
          }
        }
      },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.log("[EMPLOYEES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

