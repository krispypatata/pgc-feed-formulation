function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-white p-4 shadow-sm md:items-start">
      <div className="flex items-center gap-3">
        <Icon className="text-deepbrown h-6 w-6" />
        <span className="text-deepbrown text-2xl font-bold">{value}</span>
      </div>
      <span className="text-darkbrown mt-1">{label}</span>
    </div>
  )
}

export default StatCard
