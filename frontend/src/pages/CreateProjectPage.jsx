import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../services/ProjectService.js';

const LANGUAGES = ['C++', 'Java', 'Python', 'JavaScript', 'C', 'Go', 'Rust', 'TypeScript', 'C#', 'Ruby', 'PHP', 'Kotlin', 'Swift'];

export default function CreateProjectPage() {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('C++');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !prompt.trim() || !code.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await createProject({ title, prompt, language, code });
      if (res.success && res.data?._id) {
        navigate(`/project/${res.data._id}`);
      } else {
        setError(res.message || 'Failed to create project.');
      }
    } catch (err) {
      const message = err.response?.data?.message;
      setError(
        !message || message === 'Something went wrong.'
          ? 'The server could not create this project. Confirm that MongoDB and the backend are running, then try again.'
          : message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-[35px] sm:px-[22px] sm:py-[max(28px,6vw)]">
      <div className="mx-auto w-full max-w-[940px]">
        <p className="mb-3 mt-0 font-mono text-[11px] font-medium tracking-[.16em] text-[#9cf7e5]">NEW VISUALIZATION</p>
        <h1 className="m-0 text-[30px] font-extrabold leading-[1.05] tracking-[-2.2px] sm:text-5xl">Create New Project</h1>
        <p className="mb-[34px] mt-[13px] text-[15px] text-[#a8abc0]">Submit your code and let AI analyze it</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-[17px] border border-[rgba(151,156,255,.18)] bg-[linear-gradient(145deg,rgba(30,33,53,.85),rgba(16,18,32,.87))] p-[19px] shadow-[0_28px_65px_rgba(0,0,0,.23)] sm:rounded-[22px] sm:p-[clamp(20px,4vw,34px)]">
          {error && <div className="mb-[-2px] rounded-xl border border-[rgba(255,100,130,.45)] bg-[rgba(128,25,48,.28)] px-[13px] py-[11px] text-[13px] leading-[1.45] text-[#ffc4ce]">{error}</div>}

          <div className="flex flex-1 flex-col gap-[7px]">
            <label htmlFor="title" className="text-xs font-bold tracking-[.02em] text-[#d6d8ea]">Project Title</label>
            <input
              className="w-full rounded-xl border border-[#373b58] bg-[rgba(6,8,18,.46)] px-[13px] py-3 text-[#f6f7ff] outline-none transition focus:border-[#807dff] focus:bg-[rgba(10,12,26,.8)] focus:shadow-[0_0_0_4px_rgba(113,110,255,.13)] placeholder:text-[#73778f]"
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Bubble Sort Implementation"
            />
          </div>

          <div className="flex flex-col gap-4 min-[621px]:flex-row">
            <div className="flex flex-1 flex-col gap-[7px]">
              <label htmlFor="language" className="text-xs font-bold tracking-[.02em] text-[#d6d8ea]">Language</label>
              <select className="w-full cursor-pointer rounded-xl border border-[#373b58] bg-[rgba(6,8,18,.46)] px-[13px] py-3 text-[#f6f7ff] outline-none transition focus:border-[#807dff] focus:bg-[rgba(10,12,26,.8)] focus:shadow-[0_0_0_4px_rgba(113,110,255,.13)]" id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-[2] flex-col gap-[7px]">
              <label htmlFor="prompt" className="text-xs font-bold tracking-[.02em] text-[#d6d8ea]">Visualization Prompt</label>
              <input
                className="w-full rounded-xl border border-[#373b58] bg-[rgba(6,8,18,.46)] px-[13px] py-3 text-[#f6f7ff] outline-none transition focus:border-[#807dff] focus:bg-[rgba(10,12,26,.8)] focus:shadow-[0_0_0_4px_rgba(113,110,255,.13)] placeholder:text-[#73778f]"
                id="prompt"
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Visualize bubble sort step by step"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-[7px]">
            <label htmlFor="code" className="text-xs font-bold tracking-[.02em] text-[#d6d8ea]">Code</label>
            <textarea
              className="min-h-[230px] w-full rounded-xl border border-[#373b58] bg-[rgba(6,8,18,.46)] px-[13px] py-3 font-mono text-[13px] leading-[1.7] text-[#f6f7ff] outline-none transition focus:border-[#807dff] focus:bg-[rgba(10,12,26,.8)] focus:shadow-[0_0_0_4px_rgba(113,110,255,.13)] placeholder:text-[#73778f] min-[621px]:min-h-[290px]"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              rows="14"
              spellCheck="false"
            />
          </div>

          <button type="submit" className="mt-1 min-h-[50px] rounded-xl bg-[linear-gradient(105deg,#a4f8e8,#7775ff_62%,#a88bff)] px-[18px] py-[13px] text-[15px] font-extrabold text-[#0d1020] shadow-[0_12px_26px_rgba(104,95,255,.22)] transition hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_16px_34px_rgba(104,95,255,.32)] disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>
            {loading ? 'Analyzing code...' : 'Create & Analyze'}
          </button>
        </form>
      </div>
    </div>
  );
}