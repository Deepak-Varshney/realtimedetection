import { redirect } from 'next/navigation';
import TicketingDashboard from '@/components/TicketingDashboard';
import { currentUser } from '@clerk/nextjs/server';
import AdminView from '@/components/AdminView';
import SupervisorView from '@/components/SupervisorView';
import UserView from '@/components/UserView';



export default async function Home() {
  const user = await currentUser();
  const currentRole = user?.publicMetadata?.role || 'user';



  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-6">
        {currentRole === 'user' && <UserView/>}
        {currentRole === 'supervisor' && <SupervisorView />}
        {currentRole === 'admin' && <AdminView />}
      </main>
    </div>
  );
}

