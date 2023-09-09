"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter} from "next/navigation"
import { EmployeeColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

interface EmployeeClientPorps {
    data: EmployeeColumn[],
}

export const EmployeeClient: React.FC<EmployeeClientPorps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();

    return(
    <>
        <div className="flex items-center justify-between">
            <Heading 
            title={`Mitarbeiter ${data.length}`}
            description="Manage Mitarbeiter für diese Gruppe"/>
            <Button
                onClick={() => router.push(`/${params.teamId}/employees/new`)}>
                <Plus className="mr-2 h-4 w-4"/>
                Neuer Mitarbeiter
            </Button>
        </div>
        <Separator/>
        <DataTable columns={columns} data={data} searchKey="lastName" />
    </>
    )
}