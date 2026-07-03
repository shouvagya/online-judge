import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav className="bg-slate-900 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-xl font-bold"
        >
          Online Judge
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/problems">Problems</Link>

          <Link to="/contests">Contests</Link>

          <Link to="/submissions">Submissions</Link>

          {token ? (
            <button
              onClick={logout}
              className="rounded bg-red-600 px-3 py-1"
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;