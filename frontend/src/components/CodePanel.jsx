export default function CodePanel({ language, code }) {
    if (!code) return null;
    const lines = code.split('\n');

    return (
        <div className="my-6 overflow-hidden rounded-2xl border border-[#292e48] bg-[#0c0f1b] shadow-[0_16px_35px_rgba(0,0,0,.19)]">
            <div className="flex items-center gap-2.5 border-b border-[#252a42] bg-[#141827] px-4 py-3">
                <span className="mr-[30px] flex gap-[7px] before:size-[9px] before:rounded-full before:bg-[#ff6d7e] after:size-[9px] after:rounded-full after:bg-[#ffc46b] [&>i]:size-[9px] [&>i]:rounded-full [&>i]:bg-[#75e5c8]"><i /></span>
                <span className="rounded-md bg-[rgba(99,228,207,.1)] px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[.07em] text-[#9ff7e6]">{language}</span>
                <span className="text-xs text-[#a8abc0]">Source Code</span>
            </div>
            <div className="max-h-[430px] overflow-auto">
                <table className="w-full border-collapse font-mono text-[13px] leading-[1.65]">
                    <tbody>
                        {lines.map((line, i) => (
                            <tr key={i} className="hover:bg-[rgba(116,114,255,.07)]">
                                <td className="w-px select-none border-r border-[#242941] px-4 text-right align-top text-[#575d78]">{i + 1}</td>
                                <td className="px-[17px] text-[#d9ddec]">
                                    <pre className="m-0 whitespace-pre font-inherit">{line || ' '}</pre>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
