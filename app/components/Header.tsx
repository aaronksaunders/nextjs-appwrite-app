import Link from "next/link";

const Header = () => {
  return (
    <div>
      <h1>HEADER</h1>
      <Link href="/home">
        <div>Projects</div>
      </Link>
      <Link href="/dashboard">
        <div>Dashboard</div>
      </Link>
      <button>Logout</button>
    </div>
  );
};

export default Header;
