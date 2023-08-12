import { EmployeeClient } from "./components/client";


const EmployeesPage = () => {
  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <EmployeeClient/>
        </div>
    </div>
  )
}
export default EmployeesPage;
