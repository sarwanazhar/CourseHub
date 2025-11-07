'use client'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import SidebarContent from './sidebarContent';
import { useState } from 'react';

const Sidebar = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Menu className='text-white cursor-pointer hover:text-gray-400 transition-colors' size={30}/>
                </SheetTrigger>
                <SheetContent side='left' className='p-0 bg-zinc-900 text-white flex gap-0 flex-col'>
                    <SidebarContent onClose={() => setOpen(false)}/>
                </SheetContent>
            </Sheet>
        </>
    )
}

export default Sidebar;