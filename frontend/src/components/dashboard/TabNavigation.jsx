function TabNavigation({
  tabs,
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="sticky top-4 z-50 mb-10 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur p-3 shadow-lg">

      <div className="flex flex-wrap gap-3">

        {tabs.map((tab) => (

          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-xl px-5 py-3 font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
            }`}
          >
            {tab.label}
          </button>

        ))}

      </div>

    </div>
  );
}

export default TabNavigation;