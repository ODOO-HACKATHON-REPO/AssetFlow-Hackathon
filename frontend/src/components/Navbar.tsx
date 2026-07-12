import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const links = [
    { to: '/dashboard', label: 'Assets' },
    { to: '/bookings', label: 'Bookings' },
  ];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-10 border-b border-[#E3E5ED] bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#2451FF] text-[11px] font-bold text-white">
              A
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight text-[#12141C]">
              AssetFlow
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  location.pathname.startsWith(l.to)
                    ? 'bg-[#EEF1FF] text-[#2451FF]'
                    : 'text-[#6B7280] hover:bg-[#F5F6FA] hover:text-[#12141C]'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right leading-tight">
            <div className="text-[13px] font-medium text-[#12141C]">{user.name}</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-[#9AA1AF]">
              {user.role}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md border border-[#E3E5ED] px-3 py-1.5 text-[13px] font-medium text-[#6B7280] transition-colors hover:border-[#DC2626] hover:text-[#DC2626]"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
