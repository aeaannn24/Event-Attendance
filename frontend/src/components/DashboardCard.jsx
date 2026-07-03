const DashboardCard = ({ label, value, icon, accent }) => {
  return (
    <div className="rounded-3xl bg-white/95 p-6 shadow-xl shadow-slate-200/30 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</h3>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-3xl ${accent}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
