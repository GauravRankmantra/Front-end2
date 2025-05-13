import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

const filters = ["weekly", "monthly", "all"];

const UserStatsCharts = ({ userId }) => {
  const [filter, setFilter] = useState("weekly");
  const [downloadData, setDownloadData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const fetchStats = async (selectedFilter) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${apiUrl}api/v1/userStats/stats/${userId}?filter=${selectedFilter}`
      );
      const data = res.data.data || [];

      if (!data.length) {
        setError("No data available for this period.");
      }

      const formatDay = (id) => {
        if (!id || !id.year || !id.month || !id.day) return "";
        return `${id.year}-${String(id.month).padStart(2, "0")}-${String(
          id.day
        ).padStart(2, "0")}`;
      };

      const downloads = data.map((item) => ({
        day: formatDay(item._id),
        downloads: item.downloads,
      }));

      const revenue = data.map((item) => ({
        day: formatDay(item._id),
        purchases: item.purchases,
        revenue: item.revenue,
      }));

      setDownloadData(downloads);
      setRevenueData(revenue);
    } catch (err) {
      setError("Failed to fetch stats. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchStats(filter);
  }, [userId, filter]);

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">User Statistics</h1>
        <select
          className="bg-gray-800 text-white px-4 py-2 rounded-md shadow border border-gray-600"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {filters.map((f) => (
            <option key={f} value={f}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Downloads Chart */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg mb-10">
        <h2 className="text-lg font-semibold mb-4 text-white">
          {filter.charAt(0).toUpperCase() + filter.slice(1)} Song Downloads
        </h2>
        {loading ? (
          <p className="text-gray-300">Loading...</p>
        ) : error ? (
          <p className="text-red-400 font-medium">{error}</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={downloadData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey="day"
                stroke="#ccc"
                tickLine={false}
                tick={{ fill: "#fff", fontSize: 12 }}
                axisLine={false}
              />
              <YAxis
                stroke="#ccc"
                tickLine={false}
                tick={{ fill: "#fff", fontSize: 12 }}
                axisLine={false}
                domain={[
                  0,
                  Math.max(...downloadData.map((d) => d.downloads), 10) + 10,
                ]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#2a2f3a",
                  borderColor: "#444",
                }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#eee" }}
                formatter={(value) => [`${value}`, "Downloads"]}
              />
              <Bar
                dataKey="downloads"
                fill="#66ccff"
                barSize={40}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Revenue & Purchases Chart */}
      <div className="bg-gradient-to-br from-cyan-800 to-green-600 rounded-xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-white">
          {filter.charAt(0).toUpperCase() + filter.slice(1)} Revenue & Purchases
        </h2>
        {loading ? (
          <p className="text-gray-200">Loading...</p>
        ) : error ? (
          <p className="text-red-100 font-medium">{error}</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey="day"
                stroke="#ccc"
                tickLine={false}
                tick={{ fill: "#fff", fontSize: 12 }}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="#a8dadc"
                tickLine={false}
                tick={{ fill: "#fff", fontSize: 12 }}
                axisLine={false}
                domain={[
                  0,
                  Math.max(...revenueData.map((d) => d.purchases), 5) + 5,
                ]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#ffc658"
                tickLine={false}
                tick={{ fill: "#fff", fontSize: 12 }}
                axisLine={false}
                domain={[
                  0,
                  Math.max(...revenueData.map((d) => d.revenue), 10) + 10,
                ]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#2a2f3a",
                  borderColor: "#444",
                }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#eee" }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="purchases"
                stroke="#a8dadc"
                strokeWidth={3}
                dot={{ r: 5, fill: "#a8dadc" }}
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#ffc658"
                strokeWidth={3}
                dot={{ r: 5, fill: "#ffc658" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default UserStatsCharts;
