import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
import { Team } from '@prisma/client';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }


  const team = await prismadb.team.findFirst({
    include: {
      employees: {
        where: {
          userId,
        },
      },
    },
  });


  if(team) {
     redirect(`/${team.id}`);
  }; 


  return (
    <>
      {children}
    </>
  );
};