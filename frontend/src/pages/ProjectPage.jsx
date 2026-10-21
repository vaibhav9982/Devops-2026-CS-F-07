import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProject, updateProject } from "../services/ProjectService.js";
import CodePanel from "../components/CodePanel.jsx";
import GeneratedVisualizationPreview from "../components/GeneratedVisualizationPreview.jsx";

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getProject(id)
      .then((res) => {
        if (active) {
          setProject(res.data);
          setError("");
        }
      })
      .catch((err) => {
        if (active)
          setError(err.response?.data?.message || "Failed to load project.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const startEdit = () => {
    setEditData({
      title: project.title,
      prompt: project.prompt,
      language: project.language,
      code: project.code,
    });
    setEditing(true);
  };
  const save = async () => {
    setSaving(true);
    try {
      const res = await updateProject(id, editData);
      setProject(res.data);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };
  const regenerate = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await updateProject(id, { regenerate: true });
      setProject(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Visualization regeneration failed.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="grid min-h-screen place-items-center text-[#abb0c9]">Loading project...</div>;
  if (error && !project)
    return <div className="grid min-h-screen place-items-center text-[#ffafbf]">{error}</div>;
  if (!project) return null;
  const generated = project.generatedVisualization;

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1180px] px-4 pb-[55px] pt-[21px] text-[#edf0ff] sm:px-[max(18px,5vw)] sm:pb-[76px] sm:pt-7">
      <nav className="mb-[33px] flex items-start justify-between gap-4 sm:mb-12 sm:items-center">
        <Link to="/dashboard" className="text-[13px] font-extrabold text-[#acacff] no-underline hover:text-[#a5f8e8]">
          &larr; Dashboard
        </Link>
        <div className="flex flex-wrap justify-end gap-2">
          {!editing && (
            <>
              <button
                onClick={regenerate}
                disabled={saving}
                className="min-h-9 rounded-[9px] border border-[#3a3f5e] bg-[#20243a] px-3 text-xs font-extrabold text-[#e6e8f7] hover:bg-[#30354f] disabled:cursor-wait disabled:opacity-60"
              >
                {saving ? "Generating..." : "Regenerate visualization"}
              </button>
              <button onClick={startEdit} className="min-h-9 rounded-[9px] border border-[#3a3f5e] bg-[#20243a] px-3 text-xs font-extrabold text-[#e6e8f7] hover:bg-[#30354f]">
                Edit Project
              </button>
            </>
          )}
        </div>
      </nav>
      {error && <div className="mb-5 rounded-[13px] border border-[rgba(255,105,135,.38)] bg-[rgba(128,25,48,.25)] px-[15px] py-[13px] text-[13px] leading-[1.55] text-[#ffc2cc]">{error}</div>}
      {editing && (
        <div className="mb-7 rounded-2xl border border-[rgba(151,156,255,.16)] bg-[rgba(25,28,46,.73)] p-[17px] sm:p-[23px]">
          <h3 className="mb-[17px] mt-0 text-lg">Edit Project</h3>
          <div className="flex flex-col gap-[14px]">
            {["title", "prompt", "language"].map((field) => (
              <div className="flex flex-1 flex-col gap-[7px]" key={field}>
                <label className="text-xs font-bold tracking-[.02em] text-[#d6d8ea]">{field[0].toUpperCase() + field.slice(1)}</label>
                <input
                  className="w-full rounded-xl border border-[#373b58] bg-[rgba(6,8,18,.46)] px-[13px] py-3 text-[#f6f7ff] outline-none transition focus:border-[#807dff] focus:bg-[rgba(10,12,26,.8)] focus:shadow-[0_0_0_4px_rgba(113,110,255,.13)]"
                  value={editData[field]}
                  onChange={(e) =>
                    setEditData({ ...editData, [field]: e.target.value })
                  }
                />
              </div>
            ))}
            <div className="flex flex-1 flex-col gap-[7px]">
              <label className="text-xs font-bold tracking-[.02em] text-[#d6d8ea]">Code</label>
              <textarea
                className="min-h-[180px] w-full rounded-xl border border-[#373b58] bg-[rgba(6,8,18,.46)] px-[13px] py-3 font-mono text-[13px] leading-[1.6] text-[#f6f7ff] outline-none transition focus:border-[#807dff] focus:bg-[rgba(10,12,26,.8)] focus:shadow-[0_0_0_4px_rgba(113,110,255,.13)]"
                rows="10"
                value={editData.code}
                onChange={(e) =>
                  setEditData({ ...editData, code: e.target.value })
                }
                spellCheck="false"
              />
            </div>
            <div className="mt-[6px] flex gap-2">
              <button onClick={save} disabled={saving} className="min-h-[37px] rounded-[9px] bg-[#a5f8e8] px-[15px] text-xs font-extrabold text-[#0c1020] disabled:cursor-wait disabled:opacity-60">
                {saving ? "Generating..." : "Save Changes"}
              </button>
              <button onClick={() => setEditing(false)} className="min-h-9 rounded-[9px] border border-[#3a3f5e] bg-[#20243a] px-3 text-xs font-extrabold text-[#e6e8f7] hover:bg-[#30354f]">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mb-[26px] flex flex-col items-start gap-[13px] sm:flex-row sm:items-center">
        <h1 className="m-0 text-[31px] font-extrabold leading-[1.08] sm:text-[50px]">{project.title}</h1>
        <span className={`rounded-full px-[9px] py-1.5 font-mono text-[9px] font-bold uppercase tracking-[.07em] ${project.status === 'completed' ? 'bg-[rgba(45,166,105,.16)] text-[#9ef6c3]' : project.status === 'failed' ? 'bg-[rgba(226,66,100,.14)] text-[#ffb0c1]' : 'bg-[rgba(198,139,26,.16)] text-[#ffdc8a]'}`}>
          {project.status}
        </span>
      </div>
      <div className="mb-[15px] grid grid-cols-1 gap-[13px] min-[651px]:grid-cols-2">
        <div className="rounded-2xl border border-[rgba(151,156,255,.16)] bg-[rgba(25,28,46,.73)] p-4 sm:px-[18px]">
          <h4 className="mb-[7px] mt-0 font-mono text-[10px] font-medium uppercase tracking-[.11em] text-[#888da7]">Language</h4>
          <p className="m-0 text-sm text-[#eff1fb]">{project.language}</p>
        </div>
        <div className="rounded-2xl border border-[rgba(151,156,255,.16)] bg-[rgba(25,28,46,.73)] p-4 sm:px-[18px]">
          <h4 className="mb-[7px] mt-0 font-mono text-[10px] font-medium uppercase tracking-[.11em] text-[#888da7]">Visualization</h4>
          <p className="m-0 text-sm text-[#eff1fb]">{generated?.type || "Unavailable"}</p>
        </div>
      </div>
      {generated?.explanation && (
        <div className="mb-[25px] rounded-2xl border border-[rgba(151,156,255,.16)] bg-[rgba(25,28,46,.73)] p-[17px_18px]">
          <h4 className="mb-[7px] mt-0 font-mono text-[10px] font-medium uppercase tracking-[.11em] text-[#888da7]">AI explanation</h4>
          <p className="m-0 text-sm leading-[1.65] text-[#bcc0d4]">{generated.explanation}</p>
        </div>
      )}
      <CodePanel language={project.language} code={project.code} />
      <section className="mt-[34px]">
        <h2 className="mb-[13px] mt-0 text-[19px]"><span className="mr-2 text-[#9df8e7]">✦</span>Generated Visualization</h2>
        {project.status === "completed" && generated?.code ? (
          <GeneratedVisualizationPreview
            key={generated.code}
            code={generated.code}
          />
        ) : (
          <div className="mb-5 rounded-[13px] border border-[rgba(255,105,135,.38)] bg-[rgba(128,25,48,.25)] px-[15px] py-[13px] text-[13px] leading-[1.55] text-[#ffc2cc]">
            Generated visualization could not be rendered.{" "}
            {generated?.explanation ||
              "No safe generated component is available."}
          </div>
        )}
      </section>
    </div>
  );
}
