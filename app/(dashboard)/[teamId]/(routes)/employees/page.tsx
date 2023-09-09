import prismadb from "@/lib/prismadb";
import { EmployeeClient } from "./components/client";
import { EmployeeColumn } from "./components/columns";


const EmployeesPage = async ({
  params
}: {
  params: { teamId: string}
}) => {

  const employees = await prismadb.employee.findMany({
    where: {
      teams: {
        some: {
          id: params.teamId,
        },
      },
    },
  });

  const formattedEmployees: EmployeeColumn[] = employees.map((item)=> ({
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      hours: item.hours,
      role: item.role,
      email: item.email,
    }))
  
    await prismadb.$disconnect();
    
    return (
      <div className="flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6">
              <EmployeeClient data={formattedEmployees}/>
          </div>
      </div>
    )
  }

export default EmployeesPage;
