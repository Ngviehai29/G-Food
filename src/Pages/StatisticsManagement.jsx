import React, { useState, useEffect } from "react";
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Users,
    Package,
    MapPin,
    Calendar,
    DollarSign,
    Download,
    Filter,
    RefreshCw,
    Eye,
    ShoppingBag,
    Clock,
    CheckCircle,
    XCircle,
    Activity,
    ArrowUp,
    ArrowDown,
    MoreVertical,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart as RePieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area,
} from "recharts";

const PRIMARY_COLOR = "#97b545";
const SECONDARY_COLOR = "#4f46e5";
const API_URL = "https://be-g-food.onrender.com/api";

const StatisticsManagement = () => {
    // State chính
    const [stats, setStats] = useState({
        overview: {},
        dailyData: [],
        categoryData: [],
        locationData: [],
        userData: [],
        trends: {},
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState("7days"); // 7days, 30days, 90days
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Colors cho biểu đồ
    const COLORS = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#8884d8",
        "#82ca9d",
    ];
    const CATEGORY_COLORS = {
        "Trái cây": "#10b981",
        "Rau xanh": "#3b82f6",
        Thịt: "#ef4444",
        Cá: "#8b5cf6",
        "Ngũ cốc": "#f59e0b",
        "Đồ khô": "#6366f1",
        Khác: "#6b7280",
    };

    // Fetch data khi component mount hoặc timeRange thay đổi
    useEffect(() => {
        fetchStatistics();
    }, [timeRange]);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            setError(null);

            // Giả lập API call - trong thực tế sẽ gọi API thật
            const response = await fetch(`${API_URL}/_postnewshare/`);

            if (!response.ok) {
                throw new Error("Không thể tải dữ liệu thống kê");
            }

            const data = await response.json();

            // Giả lập xử lý dữ liệu thống kê
            const mockStats = generateMockStatistics(data.data || []);
            setStats(mockStats);
        } catch (error) {
            console.error("Error fetching statistics:", error);
            setError("Không thể tải dữ liệu thống kê");
            // Dữ liệu mẫu
            setStats(generateMockStatistics([]));
        } finally {
            setLoading(false);
        }
    };

    // Hàm tạo dữ liệu thống kê mẫu
    const generateMockStatistics = (apiData) => {
        // Overview stats
        const totalProducts = apiData.length || 156;
        const activeProducts = Math.floor(totalProducts * 0.85);
        const totalUsers = 89;
        const activeUsers = Math.floor(totalUsers * 0.78);

        // Generate daily data
        const dailyData = [];
        const days =
            timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90;

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            dailyData.push({
                date: date.toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                }),
                products: Math.floor(Math.random() * 20) + 5,
                views: Math.floor(Math.random() * 500) + 100,
                requests: Math.floor(Math.random() * 50) + 10,
                revenue: Math.floor(Math.random() * 5000000) + 1000000,
            });
        }

        // Category data
        const categoryData = [
            { name: "Trái cây", value: 35, products: 42 },
            { name: "Rau xanh", value: 25, products: 30 },
            { name: "Thịt", value: 15, products: 18 },
            { name: "Cá", value: 12, products: 15 },
            { name: "Ngũ cốc", value: 8, products: 10 },
            { name: "Đồ khô", value: 5, products: 6 },
        ];

        // Location data
        const locationData = [
            { location: "Hà Nội", products: 45, users: 23 },
            { location: "TP.HCM", products: 38, users: 28 },
            { location: "Đà Nẵng", products: 22, users: 15 },
            { location: "Quảng Nam", products: 18, users: 12 },
            { location: "Other", products: 33, users: 11 },
        ];

        // User activity
        const userData = [
            { day: "T2", active: 45, new: 8 },
            { day: "T3", active: 52, new: 12 },
            { day: "T4", active: 48, new: 6 },
            { day: "T5", active: 60, new: 15 },
            { day: "T6", active: 55, new: 10 },
            { day: "T7", active: 40, new: 5 },
            { day: "CN", active: 35, new: 3 },
        ];

        // Trends
        const trends = {
            productGrowth: 15.5,
            userGrowth: 8.2,
            requestGrowth: 22.3,
            revenueGrowth: 18.7,
        };

        return {
            overview: {
                totalProducts,
                activeProducts,
                totalUsers,
                activeUsers,
                totalRequests: 342,
                totalRevenue: 45600000,
                avgResponseTime: "2.4 giờ",
            },
            dailyData,
            categoryData,
            locationData,
            userData,
            trends,
        };
    };

    // Format số
    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + "M";
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + "K";
        }
        return num.toString();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Export data
    const handleExport = () => {
        alert("Chức năng xuất báo cáo đang được phát triển!");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                            Quản lý thống kê
                        </h1>
                        <p className="text-gray-600">
                            Theo dõi và phân tích hiệu suất hệ thống
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
                        >
                            <option value="7days">7 ngày qua</option>
                            <option value="30days">30 ngày qua</option>
                            <option value="90days">90 ngày qua</option>
                        </select>

                        <button
                            onClick={fetchStatistics}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Làm mới
                        </button>

                        <button
                            onClick={handleExport}
                            className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
                            style={{ backgroundColor: PRIMARY_COLOR }}
                        >
                            <Download className="w-4 h-4" />
                            Xuất báo cáo
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
                        <p className="text-gray-600">
                            Đang tải dữ liệu thống kê...
                        </p>
                    </div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchStatistics}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Thử lại
                    </button>
                </div>
            ) : (
                <>
                    {/* Overview Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Tổng sản phẩm
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {stats.overview.totalProducts}
                                    </p>
                                </div>
                                <div className="relative">
                                    <Package className="w-10 h-10 text-blue-500 bg-blue-50 p-2 rounded-lg" />
                                    <span
                                        className={`absolute -top-1 -right-1 text-xs px-2 py-1 rounded-full ${
                                            stats.trends.productGrowth > 0
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {stats.trends.productGrowth > 0
                                            ? "+"
                                            : ""}
                                        {stats.trends.productGrowth}%
                                    </span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                <span>
                                    {stats.overview.activeProducts} đang hoạt
                                    động
                                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Người dùng
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {stats.overview.totalUsers}
                                    </p>
                                </div>
                                <div className="relative">
                                    <Users className="w-10 h-10 text-green-500 bg-green-50 p-2 rounded-lg" />
                                    <span
                                        className={`absolute -top-1 -right-1 text-xs px-2 py-1 rounded-full ${
                                            stats.trends.userGrowth > 0
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {stats.trends.userGrowth > 0 ? "+" : ""}
                                        {stats.trends.userGrowth}%
                                    </span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Activity className="w-4 h-4" />
                                <span>
                                    {stats.overview.activeUsers} đang hoạt động
                                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Yêu cầu nhận
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {formatNumber(
                                            stats.overview.totalRequests
                                        )}
                                    </p>
                                </div>
                                <div className="relative">
                                    <ShoppingBag className="w-10 h-10 text-purple-500 bg-purple-50 p-2 rounded-lg" />
                                    <span
                                        className={`absolute -top-1 -right-1 text-xs px-2 py-1 rounded-full ${
                                            stats.trends.requestGrowth > 0
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {stats.trends.requestGrowth > 0
                                            ? "+"
                                            : ""}
                                        {stats.trends.requestGrowth}%
                                    </span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                    TB: {stats.overview.avgResponseTime} phản
                                    hồi
                                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Tổng giá trị
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {formatCurrency(
                                            stats.overview.totalRevenue
                                        )}
                                    </p>
                                </div>
                                <div className="relative">
                                    <DollarSign className="w-10 h-10 text-yellow-500 bg-yellow-50 p-2 rounded-lg" />
                                    <span
                                        className={`absolute -top-1 -right-1 text-xs px-2 py-1 rounded-full ${
                                            stats.trends.revenueGrowth > 0
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {stats.trends.revenueGrowth > 0
                                            ? "+"
                                            : ""}
                                        {stats.trends.revenueGrowth}%
                                    </span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                <span>Giá trị sản phẩm được chia sẻ</span>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Daily Activity Chart */}
                        <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        Hoạt động hàng ngày
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Sản phẩm mới & Yêu cầu
                                    </p>
                                </div>
                                <BarChart3 className="w-8 h-8 text-blue-500" />
                            </div>

                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.dailyData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#e5e7eb"
                                        />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#6b7280"
                                            fontSize={12}
                                        />
                                        <YAxis stroke="#6b7280" fontSize={12} />
                                        <Tooltip
                                            formatter={(value) => [value, ""]}
                                            labelFormatter={(label) =>
                                                `Ngày: ${label}`
                                            }
                                            contentStyle={{
                                                borderRadius: "8px",
                                                border: "1px solid #e5e7eb",
                                                backgroundColor: "white",
                                            }}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="products"
                                            name="Sản phẩm mới"
                                            fill={PRIMARY_COLOR}
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="requests"
                                            name="Yêu cầu"
                                            fill={SECONDARY_COLOR}
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Category Distribution */}
                        <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        Phân bố theo danh mục
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Tỷ lệ sản phẩm
                                    </p>
                                </div>
                                <PieChart className="w-8 h-8 text-green-500" />
                            </div>

                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={stats.categoryData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) =>
                                                `${name}: ${(
                                                    percent * 100
                                                ).toFixed(0)}%`
                                            }
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {stats.categoryData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            CATEGORY_COLORS[
                                                                entry.name
                                                            ] ||
                                                            COLORS[
                                                                index %
                                                                    COLORS.length
                                                            ]
                                                        }
                                                    />
                                                )
                                            )}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value, name, props) => [
                                                `${value}% (${props.payload.products} sản phẩm)`,
                                                name,
                                            ]}
                                        />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 2 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Location Distribution */}
                        <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        Phân bố theo địa điểm
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Sản phẩm & Người dùng
                                    </p>
                                </div>
                                <MapPin className="w-8 h-8 text-purple-500" />
                            </div>

                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.locationData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#e5e7eb"
                                        />
                                        <XAxis
                                            dataKey="location"
                                            stroke="#6b7280"
                                            fontSize={12}
                                        />
                                        <YAxis stroke="#6b7280" fontSize={12} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey="products"
                                            name="Sản phẩm"
                                            fill="#4f46e5"
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="users"
                                            name="Người dùng"
                                            fill="#10b981"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* User Activity Trend */}
                        <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        Xu hướng người dùng
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Hoạt động hàng tuần
                                    </p>
                                </div>
                                <Users className="w-8 h-8 text-orange-500" />
                            </div>

                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.userData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#e5e7eb"
                                        />
                                        <XAxis
                                            dataKey="day"
                                            stroke="#6b7280"
                                            fontSize={12}
                                        />
                                        <YAxis stroke="#6b7280" fontSize={12} />
                                        <Tooltip />
                                        <Area
                                            type="monotone"
                                            dataKey="active"
                                            name="Người dùng hoạt động"
                                            stroke="#f59e0b"
                                            fill="#fef3c7"
                                            fillOpacity={0.6}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="new"
                                            name="Người dùng mới"
                                            stroke="#10b981"
                                            fill="#d1fae5"
                                            fillOpacity={0.6}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Tables */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Categories */}
                        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                            <div className="p-5 border-b">
                                <h3 className="text-lg font-bold text-gray-800">
                                    Top danh mục
                                </h3>
                            </div>
                            <div className="divide-y">
                                {stats.categoryData.map((category, index) => (
                                    <div
                                        key={index}
                                        className="p-4 flex items-center justify-between hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        CATEGORY_COLORS[
                                                            category.name
                                                        ] || COLORS[index],
                                                }}
                                            ></div>
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {category.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {category.products} sản phẩm
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-800">
                                                {category.value}%
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Tỷ lệ
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                            <div className="p-5 border-b">
                                <h3 className="text-lg font-bold text-gray-800">
                                    Chỉ số hiệu suất
                                </h3>
                            </div>
                            <div className="divide-y">
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <TrendingUp className="w-5 h-5 text-green-500" />
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                Tăng trưởng sản phẩm
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Hàng tháng
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className={`flex items-center gap-2 ${
                                            stats.trends.productGrowth > 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {stats.trends.productGrowth > 0 ? (
                                            <ArrowUp className="w-4 h-4" />
                                        ) : (
                                            <ArrowDown className="w-4 h-4" />
                                        )}
                                        <span className="font-bold">
                                            {stats.trends.productGrowth}%
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5 text-blue-500" />
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                Tăng trưởng người dùng
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Hàng tháng
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className={`flex items-center gap-2 ${
                                            stats.trends.userGrowth > 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {stats.trends.userGrowth > 0 ? (
                                            <ArrowUp className="w-4 h-4" />
                                        ) : (
                                            <ArrowDown className="w-4 h-4" />
                                        )}
                                        <span className="font-bold">
                                            {stats.trends.userGrowth}%
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <ShoppingBag className="w-5 h-5 text-purple-500" />
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                Tỷ lệ chuyển đổi
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Xem → Nhận
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-green-600 font-bold">
                                        12.5%
                                    </div>
                                </div>

                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-orange-500" />
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                Thời gian phản hồi TB
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Yêu cầu nhận sản phẩm
                                            </p>
                                        </div>
                                    </div>
                                    <div className="font-bold text-gray-800">
                                        {stats.overview.avgResponseTime}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Insights & Recommendations */}
                    <div className="mt-6 bg-white rounded-xl shadow border border-gray-100 p-5">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            Phân tích & Khuyến nghị
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-semibold text-blue-800 mb-2">
                                    📈 Xu hướng tích cực
                                </h4>
                                <p className="text-sm text-blue-700">
                                    Tăng trưởng yêu cầu nhận sản phẩm{" "}
                                    {stats.trends.requestGrowth}% cho thấy nhu
                                    cầu cao.
                                </p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <h4 className="font-semibold text-green-800 mb-2">
                                    🎯 Cơ hội
                                </h4>
                                <p className="text-sm text-green-700">
                                    Danh mục "Trái cây" chiếm{" "}
                                    {stats.categoryData[0]?.value || 0}% - tập
                                    trung phát triển.
                                </p>
                            </div>
                            <div className="p-4 bg-yellow-50 rounded-lg">
                                <h4 className="font-semibold text-yellow-800 mb-2">
                                    ⚡ Hành động
                                </h4>
                                <p className="text-sm text-yellow-700">
                                    Cần tăng cường sản phẩm ở khu vực có ít
                                    người dùng hoạt động.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default StatisticsManagement;
