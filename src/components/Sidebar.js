'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', path: '/admin' },
        { name: 'Users', path: '/admin/users' },
        { name: 'Regions', path: '/admin/regions' },
        { name: 'Categories', path: '/admin/categories' },
        { name: 'User Infos', path: '/admin/user-infos' },
        { name: 'Portfolios', path: '/admin/portfolios' },
        { name: 'Portfolio Images', path: '/admin/portfolio-images' },
        { name: 'Comments', path: '/admin/comments' },
    ];

    return (
        <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>
            <nav>
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                href={item.path}
                                className={`block px-4 py-2 rounded transition-colors ${pathname === item.path
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-gray-700'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
