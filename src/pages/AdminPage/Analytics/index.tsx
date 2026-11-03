import HeaderAdmin from "@organisms/Header/Admin";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { TrendingUp, Users, BookOpen, Award, ArrowUp, ArrowDown } from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const AnalyticsDashboard = () => {
    // Mock data for charts
    const userGrowthData = [
        { month: "T1", users: 1200 },
        { month: "T2", users: 1450 },
        { month: "T3", users: 1680 },
        { month: "T4", users: 1890 },
        { month: "T5", users: 2100 },
        { month: "T6", users: 2543 },
    ];

    const lessonCompletionData = [
        { lesson: "Hiragana", completed: 1250, inProgress: 320 },
        { lesson: "Katakana", completed: 890, inProgress: 280 },
        { lesson: "Kanji N5", completed: 2100, inProgress: 450 },
        { lesson: "Ngữ pháp", completed: 1680, inProgress: 380 },
        { lesson: "Hội thoại", completed: 1450, inProgress: 290 },
    ];

    const levelDistributionData = [
        { name: "N5", value: 1200, color: "hsl(var(--chart-1))" },
        { name: "N4", value: 850, color: "hsl(var(--chart-2))" },
        { name: "N3", value: 380, color: "hsl(var(--chart-3))" },
        { name: "N2", value: 90, color: "hsl(var(--chart-4))" },
        { name: "N1", value: 23, color: "hsl(var(--chart-5))" },
    ];

    const activityData = [
        { day: "T2", active: 450 },
        { day: "T3", active: 520 },
        { day: "T4", active: 480 },
        { day: "T5", active: 610 },
        { day: "T6", active: 720 },
        { day: "T7", active: 892 },
        { day: "CN", active: 680 },
    ];

    return (
        <div className="p-8">
            {/* Header */}
            <HeaderAdmin title="Phân tích & Thống kê" description="Tổng quan về hiệu suất và hoạt động của hệ thống" />

            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-4 mb-8">
                <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng người dùng</CardTitle>
                            <Users className="h-4 w-4 text-chart-1" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">2,543</div>
                        <div className="flex items-center text-sm mt-2">
                            <ArrowUp className="h-4 w-4 text-chart-4 mr-1" />
                            <span className="text-chart-4 font-medium">12.5%</span>
                            <span className="text-muted-foreground ml-2">so với tháng trước</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Bài học hoàn thành
                            </CardTitle>
                            <BookOpen className="h-4 w-4 text-chart-2" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">7,370</div>
                        <div className="flex items-center text-sm mt-2">
                            <ArrowUp className="h-4 w-4 text-chart-4 mr-1" />
                            <span className="text-chart-4 font-medium">8.2%</span>
                            <span className="text-muted-foreground ml-2">so với tháng trước</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Tỷ lệ hoàn thành
                            </CardTitle>
                            <Award className="h-4 w-4 text-chart-3" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">68.4%</div>
                        <div className="flex items-center text-sm mt-2">
                            <ArrowDown className="h-4 w-4 text-destructive mr-1" />
                            <span className="text-destructive font-medium">2.1%</span>
                            <span className="text-muted-foreground ml-2">so với tháng trước</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Hoạt động hôm nay
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-chart-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">892</div>
                        <div className="flex items-center text-sm mt-2">
                            <ArrowUp className="h-4 w-4 text-chart-4 mr-1" />
                            <span className="text-chart-4 font-medium">15.3%</span>
                            <span className="text-muted-foreground ml-2">so với hôm qua</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
                {/* User Growth Chart */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Tăng trưởng người dùng</CardTitle>
                        <p className="text-sm text-muted-foreground">Số lượng người dùng mới theo tháng</p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                                <YAxis stroke="hsl(var(--muted-foreground))" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    stroke="hsl(var(--chart-1))"
                                    strokeWidth={2}
                                    dot={{ fill: "hsl(var(--chart-1))" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Level Distribution Chart */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Phân bố cấp độ</CardTitle>
                        <p className="text-sm text-muted-foreground">Số lượng học viên theo cấp độ</p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={levelDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {levelDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
                {/* Lesson Completion Chart */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Hoàn thành bài học</CardTitle>
                        <p className="text-sm text-muted-foreground">Số lượng bài học đã hoàn thành và đang học</p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={lessonCompletionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="lesson" stroke="hsl(var(--muted-foreground))" />
                                <YAxis stroke="hsl(var(--muted-foreground))" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="completed" fill="hsl(var(--chart-4))" name="Đã hoàn thành" />
                                <Bar dataKey="inProgress" fill="hsl(var(--chart-2))" name="Đang học" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Daily Activity Chart */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Hoạt động hàng ngày</CardTitle>
                        <p className="text-sm text-muted-foreground">Số người dùng hoạt động theo ngày trong tuần</p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                                <YAxis stroke="hsl(var(--muted-foreground))" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Bar dataKey="active" fill="hsl(var(--chart-3))" name="Người dùng hoạt động" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Top Performers */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Bài học phổ biến nhất</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: "Kanji N5", students: 2100, growth: "+15%" },
                                { name: "Hội thoại hàng ngày", students: 1680, growth: "+12%" },
                                { name: "Hiragana cơ bản", students: 1250, growth: "+8%" },
                                { name: "Katakana nâng cao", students: 890, growth: "+5%" },
                            ].map((lesson, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{lesson.name}</p>
                                            <p className="text-sm text-muted-foreground">{lesson.students} học viên</p>
                                        </div>
                                    </div>
                                    <span className="text-chart-4 font-medium">{lesson.growth}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Học viên xuất sắc</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: "Nguyễn Văn A", lessons: 45, points: 2850 },
                                { name: "Trần Thị B", lessons: 42, points: 2680 },
                                { name: "Lê Văn C", lessons: 38, points: 2420 },
                                { name: "Phạm Thị D", lessons: 35, points: 2210 },
                            ].map((student, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-chart-1/10 flex items-center justify-center text-chart-1 font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{student.name}</p>
                                            <p className="text-sm text-muted-foreground">{student.lessons} bài học</p>
                                        </div>
                                    </div>
                                    <span className="text-chart-1 font-medium">{student.points} điểm</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
