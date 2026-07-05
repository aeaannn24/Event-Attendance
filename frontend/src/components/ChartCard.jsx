const ChartCard = ({ title, children }) => {
  return (
    <div className="rounded-3xl border border-panel/70 bg-panel/70 p-6 shadow-xl shadow-black/20">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Overview</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ChartCard;
