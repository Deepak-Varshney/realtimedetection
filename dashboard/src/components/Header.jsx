'use client';

import { useEffect, useState } from 'react';
import { Bell, LogIn, LogInIcon, Menu, Ticket, User } from 'lucide-react';
import { router } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';
import { IconLogin } from '@tabler/icons-react';



export default function Header() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const [unreadEvents, setUnreadEvents] = useState(0);

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
        await signOut();
        router.push('/login');
    };
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const role = user?.publicMetadata?.role || 'user';

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Ticket className="w-6 h-6 text-blue-600" />
                    <h1 className="text-xl font-bold">Dashboard</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button className="p-2 rounded-full hover:bg-gray-100 relative">
                            <Bell className="w-5 h-5 text-gray-600" />
                            {unreadEvents > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {unreadEvents}
                                </span>
                            )}
                        </button>
                    </div>
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                            >
                                <User className="w-4 h-4" />
                                <span>{user?.firstName} ({role})</span>
                                <Menu className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                    <button
                                        onClick={onSignOut}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="relative">
                            <button
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                <IconLogin className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    )}

                </div>
            </div >
        </header >
    );
}
