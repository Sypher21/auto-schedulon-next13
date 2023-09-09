"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"


export type EmployeeColumn = {
  id: string
  firstName: string
  lastName: string
  hours: number
  role: string
  email: string
} 

export const columns: ColumnDef<EmployeeColumn>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "firstName",
    header: "Vorname",
  },
  {
    accessorKey: "lastName",
    header: "Nachname",
  },
  {
    accessorKey: "hours",
    header: "Wochenstunden",
  },
  {
    accessorKey: "role",
    header: "Rolle",
  },
  {
    id: "actions",
    cell: ({row}) => <CellAction data={row.original}/>
  }
];
