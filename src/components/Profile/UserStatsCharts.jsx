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
  Legend, // Import Legend for better chart understanding
} from "recharts";
import { FaChartBar, FaChartLine, FaSpinner, FaExclamationTriangle } from "react-icons/fa"; // Using react-icons for better visuals

const filters = ["weekly", "monthly", "all"];

// Custom Tooltip for better styling and readability
const CustomTooltip = ({ active, payload, label, unit = "" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-3 rounded-lg shadow-xl border border-gray-700 text-sm">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="flex justify-between items-center text-sm">
            <span style={{ color: entry.color }} className="me-2">•</span>
            {entry.name}: <span className="font-semibold">{entry.value}{unit}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const NoDataOverlay = ({ message }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-70 rounded-xl z-10 text-center p-4">
    <FaExclamationTriangle className="text-yellow-400 text-5xl mb-4 animate-bounce" />
    <p className="text-white text-lg font-semibold">{message}</p>
    <p className="text-gray-300 text-sm mt-2">Try adjusting the filter or check back later.</p>
  </div>
);

const UserStatsCharts = ({ userId }) => {
  const [filter, setFilter] = useState("weekly");
  const [downloadData, setDownloadData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL 

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
        setDownloadData([]); 
        setRevenueData([]); 
        return; 
      }

      const formatDay = (id) => {
        if (!id || !id.year || !id.month || !id.day) return "N/A";
        return `${id.year}-${String(id.month).padStart(2, "0")}-${String(
          id.day
        ).padStart(2, "0")}`;
      };

      const downloads = data.map((item) => ({
        day: formatDay(item._id),
        downloads: item.downloads || 0, // Default to 0 if null/undefined
      }));

      const revenue = data.map((item) => ({
        day: formatDay(item._id),
        purchases: item.purchases || 0, // Default to 0
        revenue: item.revenue || 0, // Default to 0
      }));

      setDownloadData(downloads);
      setRevenueData(revenue);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setError("Currently You Don't have any Insights");
      setDownloadData([]);
      setRevenueData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchStats(filter);
    } else {
      setError("No user ID provided. Please select a user to view statistics.");
      setLoading(false);
      setDownloadData([]);
      setRevenueData([]);
    }
  }, [userId, filter]);

  const hasDownloadData = downloadData.length > 0;
  const hasRevenueData = revenueData.length > 0;

  return (
    <div className="mt-10 space-y-10 border py-2 border-gray-800 rounded-lg  bg-gray-900 min-h-screen text-white">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-4 sm:mb-0">
          <span className="text-blue-400">User</span>{" "}
          <span className="text-purple-400">Statistics</span>
        </h1>
        <select
          className="bg-gray-800 text-white px-5 py-2 rounded-lg shadow-md border border-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
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

      {/* Conditional Loading/Error/No Data/Chart for Downloads */}
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl mb-10 min-h-[350px] flex flex-col justify-center items-center">
        <h2 className="text-xl font-semibold mb-6 text-white text-center">
          <FaChartBar className="inline-block mr-2 text-blue-400" />
          {filter.charAt(0).toUpperCase() + filter.slice(1)} Song Downloads
        </h2>
        {loading ? (
          <div className="text-center py-10">
            <FaSpinner className="text-blue-400 text-5xl animate-spin mb-4" />
            <p className="text-gray-300 text-lg">Loading download stats...</p>
          </div>
        ) : error && !hasDownloadData ? ( // Show general error if charts are truly empty
          <NoDataOverlay message={error} />
        ) : (
          <>
            {!hasDownloadData && (
              <NoDataOverlay message="No download data available for this period." />
            )}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={downloadData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis
                  dataKey="day"
                  stroke="#ccc"
                  tickLine={false}
                  tick={{ fill: "#fff", fontSize: 12 }}
                  axisLine={false}
                  interval="preserveStartEnd" // Helps with crowded labels
                />
                <YAxis
                  stroke="#ccc"
                  tickLine={false}
                  tick={{ fill: "#fff", fontSize: 12 }}
                  axisLine={false}
                  domain={[0, (dataMax) => Math.max(dataMax, 10) + 10]} // Dynamic domain with buffer
                />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} content={<CustomTooltip unit=" downloads" />} />
                <Legend wrapperStyle={{ color: "#fff", paddingTop: "10px" }} />
                <Bar
                  dataKey="downloads"
                  fill="#66ccff" // A vibrant blue
                  barSize={40}
                  radius={[8, 8, 0, 0]} // Rounded top corners for bars
                />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </div>

      {/* Conditional Loading/Error/No Data/Chart for Revenue */}
      <div className="relative bg-gradient-to-br from-cyan-800 to-green-800 rounded-xl p-6 shadow-2xl min-h-[350px] flex flex-col justify-center items-center">
        <h2 className="text-xl font-semibold mb-6 text-white text-center">
          <FaChartLine className="inline-block mr-2 text-green-300" />
          {filter.charAt(0).toUpperCase() + filter.slice(1)} Revenue & Purchases
        </h2>
        {loading ? (
          <div className="text-center py-10">
            <FaSpinner className="text-green-300 text-5xl animate-spin mb-4" />
            <p className="text-gray-300 text-lg">Loading revenue stats...</p>
          </div>
        ) : error && !hasRevenueData ? ( // Show general error if charts are truly empty
          <NoDataOverlay message={error} />
        ) : (
          <>
            {!hasRevenueData && (
              <NoDataOverlay message="No revenue data available for this period." />
            )}
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis
                  dataKey="day"
                  stroke="#ccc"
                  tickLine={false}
                  tick={{ fill: "#fff", fontSize: 12 }}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  yAxisId="left"
                  stroke="#a8dadc" // Light blue for purchases
                  tickLine={false}
                  tick={{ fill: "#fff", fontSize: 12 }}
                  axisLine={false}
                  domain={[0, (dataMax) => Math.max(dataMax, 5) + 5]}
                  label={{ value: 'Purchases', angle: -90, position: 'insideLeft', fill: '#a8dadc', style: { textAnchor: 'middle' } }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#ffc658" // Yellow for revenue
                  tickLine={false}
                  tick={{ fill: "#fff", fontSize: 12 }}
                  axisLine={false}
                  domain={[0, (dataMax) => Math.max(dataMax, 10) + 10]}
                  label={{ value: 'Revenue ($)', angle: 90, position: 'insideRight', fill: '#ffc658', style: { textAnchor: 'middle' } }}
                />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} content={<CustomTooltip unit="" />} />
                <Legend wrapperStyle={{ color: "#fff", paddingTop: "10px" }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="purchases"
                  stroke="#a8dadc"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#a8dadc", stroke: "#a8dadc", strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: "#a8dadc", stroke: "#a8dadc", strokeWidth: 2 }}
                  name="Purchases"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ffc658"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#ffc658", stroke: "#ffc658", strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: "#ffc658", stroke: "#ffc658", strokeWidth: 2 }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
};

export default UserStatsCharts;