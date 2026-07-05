const DashboardCard = ({ label, value, icon, accent }) => {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-panel/70 to-brand/60 p-6 shadow-lg transition duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] text-slate-300">{label}</h3>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{value}</p>
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-3xl bg-accent/10 text-accent ${accent || ''}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
