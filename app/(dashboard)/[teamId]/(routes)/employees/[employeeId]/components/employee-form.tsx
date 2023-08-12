"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import {  Employee } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"

const EmployeeRole = {
    Admin: "Admin",
    Mitarbeiter: "Mitarbeiter",
} as const

export type EmployeeRole = keyof typeof EmployeeRole


const formSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  role: z.string(),
  hours: z.coerce.number().min(10).max(50),
});

type EmployeeFormValues = z.infer<typeof formSchema>

interface EmployeeFormProps {
  initialData: Employee | null;
};

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Bearbeite Mitarbeiter' : 'Erstelle Mitarbeiter';
  const description = initialData ? 'Bearbeite Mitarbeiter.' : 'Erstelle neuen Mitarbeiter';
  const toastMessage = initialData ? 'Mitarbeiter updated.' : 'Mitarbeiter erstellt';
  const action = initialData ? 'Änderungen speichern' : 'Erstellen';

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        hours: 0,
    }
  });

  const onSubmit = async (data: EmployeeFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.teamId}/employees/${params.employeeId}`, data);
      } else {
        await axios.post(`/api/${params.teamId}/employees`, data);
      }
      router.refresh();
      router.push(`/${params.teamId}/employees`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.teamId}/employees/${params.employeeId}`);
      router.refresh();
      router.push(`/${params.teamId}/employees`);
      toast.success('Mitarbeiter gelöscht.');
    } catch (error: any) {
      toast.error('Es müssen zuerst alle Mitarbeiter entfernt werden');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 space-y-8 sm:w-[25
            %] w-full"
        >
        <div className="grid gap-4 grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vorname</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Vorname" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nachname</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Nachname" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
          <div className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stunden</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={loading}
                    placeholder="Stunden"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rolle</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wähle eine Rolle aus" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={EmployeeRole.Admin}>Admin</SelectItem>
                    <SelectItem value={EmployeeRole.Mitarbeiter}>
                      Mitarbeiter
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Button disabled={loading} className="mr-auto" type="submit">
            {action}
          </Button>
          </div>
        </form>
      </Form>
    </>
  );
};