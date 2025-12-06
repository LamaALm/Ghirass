import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,        
} from "recharts";


export default function OverviewTab({ stats, chartData, pieChartData }) {
  return (
    <div className="space-y-8">

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white shadow p-4 rounded-xl border border-[#e0e6dc]">
          <h3 className="text-gray-600">Total Farmers</h3>
          <p className="text-3xl font-semibold text-[#3e5e40]">{stats.totalFarmers}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-xl border border-[#e0e6dc]">
          <h3 className="text-gray-600">Total Crops</h3>
          <p className="text-3xl font-semibold text-[#3e5e40]">{stats.totalCrops}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-xl border border-[#e0e6dc]">
          <h3 className="text-gray-600">System Users</h3>
          <p className="text-3xl font-semibold text-[#3e5e40]">{stats.totalUsers}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-xl border border-[#e0e6dc]">
          <h3 className="text-gray-600">Top City (most crops)</h3>
          <p className="text-xl font-semibold text-[#3e5e40]">{stats.topCity}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bar Chart */}
        <div className="bg-white shadow rounded-xl border border-[#e0e6dc] p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Crop Distribution by City
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8FAE8D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
<div className="bg-white shadow rounded-xl border border-[#e0e6dc] p-6">
  <h3 className="text-lg font-semibold mb-4 text-gray-700">
    Crops by Type
  </h3>
  <ResponsiveContainer width="100%" height={260}>
    <PieChart>
      <Pie
        data={pieChartData}
        dataKey="value"
        nameKey="type"
        cx="50%"
        cy="50%"
        outerRadius={90}
        label={({ name, value, percent }) =>
          `${name} ${Math.round(percent * 100)}% (${value})`
        }
      >
        <Cell fill="#8FAE8D" />  {/* Vegetables */}
        <Cell fill="#B7C9A9" />  {/* Fruits */}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>


      </div>

    </div>
  );
}

