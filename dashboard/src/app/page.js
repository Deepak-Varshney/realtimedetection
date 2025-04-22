import { redirect } from 'next/navigation';
import TicketingDashboard from './components/TicketingDashboard';
import { currentUser } from '@clerk/nextjs/server';



export default async function Home() {
  const user = await currentUser();

  
  if (!user) {
    redirect('/login');
  }

  return <TicketingDashboard />;
}

