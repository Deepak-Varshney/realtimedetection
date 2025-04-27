'use client';

import { useEffect, useState } from 'react';
import { Bell, LogIn, LogInIcon, Menu, Ticket, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useClerk, UserButton, useUser } from '@clerk/nextjs';
import { IconLogin } from '@tabler/icons-react';
import { Button } from './ui/button';



export default function Header() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const [unreadEvents, setUnreadEvents] = useState(0);
    const router = useRouter();
    useEffect(() => {
        if (!user) return;

        fetch('/api/events')
            .then(res => res.json())
            .then(data => {
                const unread = data.filter(e => !e.readBy.includes(user.id)).length;
                setUnreadEvents(unread);
            });
    }, [user]);

    const onSignOut = async () => {
        try {
            await signOut();
        } catch (err) {
            console.error('Sign out error:', err);
        }
    };
    const role = user?.publicMetadata?.role || 'user';

    return (
        <header className="shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Ticket className="w-6 h-6 text-blue-600" />
                    <h1 className="text-xl font-bold">Dashboard</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        {
                            role !== 'admin' && (
                                <Button className="p-2 rounded-full relative">
                                    <Bell className="w-5 h-5" />
                                    {unreadEvents > 0 && (
                                        <span className="absolute top-0 right-0 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {unreadEvents}
                                        </span>
                                    )}
                                </Button>
                            )
                        }
                    </div>
                    <div className="relative">
                        <UserButton />
                    </div>

                </div>
            </div >
        </header >
    );
}
