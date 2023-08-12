import prismadb from "@/lib/prismadb";
import { EmployeeForm } from "./components/employee-form";

const EmployeePage = async({
    params
}: {params: {teamId: string,employeeId: string}}) => {
  

const employee =
  params.employeeId !== "new"
    ? await prismadb.employee.findUnique({
        where: {
          id: params.employeeId,
        },
      })
    : null;

   

    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <EmployeeForm initialData={employee} />
        </div>
      </div>
    );
}
export default EmployeePage;
