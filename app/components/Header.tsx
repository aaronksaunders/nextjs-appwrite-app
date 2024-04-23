"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutUser } from "../actions";

const Header = () => {
  const path = usePathname();
  console.log('path', path);

  return (
    <header className="bg-gray-800 text-white p-4 mb-16">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-8">
          <Link
            href="/dashboard"
            className={`hover:text-gray-400  ${path === '/dashboard' ? 'underline underline-offset-8' : ''}`}
          >
            <div>Dashboard</div>
          </Link>
          <Link
            href="/home"
            className={`hover:text-gray-400  ${path === '/home' || path.startsWith('/tasks') ? 'underline underline-offset-8' : ''}`}

          >
            <div>Projects</div>
          </Link>
        </div>
        <form action={signOutUser}>
        <button>LOGOUT</button>
      </form>
      </div>
    </header>
  );
};

export default Header;
