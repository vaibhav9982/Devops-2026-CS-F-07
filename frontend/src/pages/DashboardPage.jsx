import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProjects, deleteProject } from '../services/ProjectService.js';
import { useAuth } from '../context/AuthContext.jsx';
export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function fetchProjects() {
    try {
      setLoading(true);
      const res = await getProjects();
      setProjects(res.data || []);
    } catch {
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // The request resolves asynchronously; this is the initial dashboard load.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    setDeleteId(id);
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setError('Failed to delete project.');
    } finally {
      setDeleteId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen text-[#eef0ff]">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[rgba(151,156,255,.14)] bg-[rgba(9,11,20,.76)] px-[18px] py-[15px] backdrop-blur-[18px] sm:px-[max(20px,5vw)] sm:py-[17px]">
        <div className="flex items-center gap-[15px]">
          <h1 className="m-0 text-lg font-extrabold tracking-[-.65px]"><span className="mr-2 font-mono text-sm font-bold text-[#99f7e8]">&lt;&gt;</span>Code Visualizer</h1>
          {user && <span className="hidden border-l border-[#363950] pl-[15px] text-[13px] text-[#a8abc2] sm:inline">Hi, {user.name}</span>}
        </div>
        <div className="flex items-center gap-[7px] sm:gap-[15px]">
          <Link to="/create" className="inline-flex min-h-[38px] items-center justify-center rounded-[10px] bg-[#a5f8e8] px-[17px] text-[13px] font-extrabold text-[#0a0d1a] no-underline shadow-[0_8px_24px_rgba(113,239,213,.16)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(113,239,213,.25)]">+ New Project</Link>
          <button onClick={handleLogout} className="min-h-[38px] rounded-[10px] border border-[#343850] bg-transparent px-[10px] text-[13px] font-bold text-[#b9bbcf] hover:border-[#727795] hover:text-white sm:px-[13px]">Logout</button>
        </div>
      </header>

      <main className="mx-auto max-w-[1300px] px-[18px] py-[38px] sm:p-[max(32px,6vw)]">
        <p className="mb-3 mt-0 font-mono text-[11px] font-medium tracking-[.16em] text-[#94f2df]">YOUR WORKSPACE</p>
        <p className="mb-9 mt-[-3px] max-w-[540px] text-base leading-[1.65] text-[#a5a8be]">Turn source code into a visual explanation, one meaningful state at a time.</p>
        {error && <div className="mb-5 rounded-xl border border-[rgba(255,100,130,.45)] bg-[rgba(128,25,48,.28)] px-[13px] py-[11px] text-[13px] text-[#ffc4ce]">{error}</div>}

        {loading ? (
          <div className="py-[90px] text-center text-[#a7aac1]">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-[#434762] bg-[rgba(20,23,41,.45)] px-5 py-[75px] text-center">
            <p className="mb-[18px] mt-0 text-[#a8abc1]">No projects yet.</p>
            <Link to="/create" className="inline-flex min-h-[38px] items-center justify-center rounded-[10px] bg-[#a5f8e8] px-[17px] text-[13px] font-extrabold text-[#0a0d1a] no-underline shadow-[0_8px_24px_rgba(113,239,213,.16)]">Create your first project</Link>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,295px),1fr))] gap-[18px]">
            {projects.map((project) => (
              <div key={project._id} className="group relative overflow-hidden rounded-[18px] border border-[rgba(151,156,255,.16)] bg-[linear-gradient(145deg,rgba(30,33,54,.86),rgba(17,19,33,.86))] p-[22px] shadow-[inset_0_1px_rgba(255,255,255,.035)] transition duration-200 before:absolute before:left-0 before:top-0 before:h-0.5 before:w-full before:bg-[linear-gradient(90deg,#9af6e4,transparent_65%)] before:opacity-65 hover:-translate-y-1 hover:border-[rgba(156,160,255,.42)] hover:shadow-[0_18px_45px_rgba(0,0,0,.25)]">
                <div className="mb-[19px] flex items-start justify-between gap-3">
                  <h3 className="m-0 text-base leading-[1.4]">{project.title}</h3>
                  <span className={`whitespace-nowrap rounded-full px-2 py-[5px] font-mono text-[9px] font-bold uppercase tracking-[.08em] ${project.status === 'completed' ? 'border border-[rgba(90,225,145,.2)] bg-[rgba(45,166,105,.16)] text-[#9ef6c3]' : project.status === 'failed' ? 'bg-[rgba(226,66,100,.14)] text-[#ffb0c1]' : 'bg-[rgba(198,139,26,.16)] text-[#ffdc8a]'}`}>
                    {project.status}
                  </span>
                </div>
                <div className="mb-5 grid grid-cols-2 gap-[13px]">
                  <span className="min-w-0">
                    <span className="mb-1 block font-mono text-[10px] font-medium uppercase tracking-[.07em] text-[#777b96]">Language</span>
                    <span className="block truncate text-xs text-[#d6d8e9]">{project.language}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="mb-1 block font-mono text-[10px] font-medium uppercase tracking-[.07em] text-[#777b96]">Visualization</span>
                    <span className="block truncate text-xs text-[#d6d8e9]">{project.generatedVisualization?.type || 'Unavailable'}</span>
                  </span>
                </div>
                <div className="mb-[17px] text-[11px] text-[#777b93]">
                  {new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/project/${project._id}`)} className="min-h-[35px] flex-1 rounded-[9px] border border-[#4d5074] bg-[#292d47] text-xs font-extrabold text-[#f4f5ff] hover:bg-[#3a3e61]">
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="min-h-[35px] flex-none rounded-[9px] border border-[rgba(251,112,137,.32)] bg-transparent px-3 text-xs font-extrabold text-[#ff9fb4] hover:bg-[rgba(161,40,70,.18)] disabled:opacity-50"
                    disabled={deleteId === project._id}
                  >
                    {deleteId === project._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}