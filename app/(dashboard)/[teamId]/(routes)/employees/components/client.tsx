"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter} from "next/navigation"



export const EmployeeClient = () => {

    const router = useRouter();
    const params = useParams();

    return(
    <>
        <div className="flex items-center justify-between">
            <Heading 
            title="Mitarbeiter (0)"
            description="Manage Mitarbeiter für diese Gruppe"/>
            <Button
                onClick={() => router.push(`/${params.teamId}/employees/new`)}>
                <Plus className="mr-2 h-4 w-4"/>
                Neuer Mitarbeiter
            </Button>
        </div>
        <Separator/>

    </>
    )
}