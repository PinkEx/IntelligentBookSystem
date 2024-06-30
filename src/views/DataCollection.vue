<template>
    <el-container>
        <!-- <el-header>
            <h1 class="header-title">数据统计</h1>
        </el-header> -->
        <el-main>
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="chart-container bordered" ref="chart1"></div>
                </el-col>
                <el-col :span="12">
                    <div class="chart-container bordered" ref="chart2"></div>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top: 20px;">
                <el-col :span="12">
                    <div class="chart-container bordered" ref="chart3"></div>
                </el-col>
                <el-col :span="12">
                    <div class="chart-container bordered" ref="chart4"></div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import { init } from "echarts";
export default {
    data() {
        return {
            palette: [
                { name: "古典", color: "#FFB6C1" },          // 浅粉红色
                { name: "文学", color: "#B39EB5" },          // 淡紫色
                { name: "科幻", color: "#98FB98" },          // 淡绿色
                { name: "政治", color: "#E6E6FA" },         // 淡紫色
                { name: "历史", color: "#ADD8E6" },         // 淡蓝色
                { name: "社科", color: "#F5DEB3" },         // 小麦色
                { name: "儿童文学", color: "#FFDAB9" },     // 桃色
                { name: "悬疑推理", color: "#E0FFFF" },     // 淡青色
                { name: "小说", color: "#FFE4E1" },         // 雪白色
                { name: "神话史诗", color: "#F0E68C" },     // 卡其色
                { name: "奇幻文学", color: "#D8BFD8" },     // 紫丁香色
                { name: "武侠世界", color: "#AFEEEE" },     // 淡青绿色
                { name: "人物传记", color: "#F08080" },     // 浅珊瑚色
                { name: "散文诗歌", color: "#EEDC82" },     // 浅棕色
                { name: "哲学", color: "#FFEFD5" },         // 帕累托橙色
                { name: "纪实文学", color: "#FFFACD" },     // 柠檬薄纱色
                { name: "经济管理", color: "#E0FFFF" },     // 浅天蓝色
                { name: "其他", color: "#F5F5F5" }          // 白色
            ],
            statistics: {}
        };
    },
    async mounted() {
        await this.$store.dispatch("fetchLendHistory");
        this.fetchStatistics();
    },
    methods: {
        getColorByCategory(category) {
            // 从 palette 中找到与类别匹配的颜色
            const paletteItem = this.palette.find(item => item.name === category);
            return paletteItem ? paletteItem.color : "#000000"; // 默认黑色
        },
        fetchStatistics() {
            const totalBooksByCategory = this.$store.state.books.reduce((counter, item) => {
                counter[item.className] = (counter[item.className] || 0) + 1;
                return counter;
            }, {});
            const totalBorrowingsByCategory = this.$store.state.lendHistory.reduce((counter, item) => {
                counter[item.bookClass] = (counter[item.bookClass] || 0) + 1;
                return counter;
            }, {});

            // 统计借阅数量按日期
            const totalBorrowingsByDate = this.$store.state.lendHistory.reduce((counter, item) => {
                const date = item.lendDate;
                counter[date] = (counter[date] || 0) + 1;
                return counter;
            }, {});
            
            // 统计归还数量按日期
            const totalReturnsByDate = this.$store.state.lendHistory.reduce((counter, item) => {
                const returnDate = item.backDate;
                counter[returnDate] = (counter[returnDate] || 0) + 1;
                return counter;
            }, {});

            // 将日期排序
            const sortedDates = Array.from(new Set([
                ...Object.keys(totalBorrowingsByDate),
                ...Object.keys(totalReturnsByDate)
            ])).sort();

            const borrowingCounts = sortedDates.map(date => totalBorrowingsByDate[date] || 0);
            const returnCounts = sortedDates.map(date => totalReturnsByDate[date] || 0);

            // 统计每个用户的借阅次数
            const userBorrowCounts = this.$store.state.lendHistory.reduce((counter, item) => {
                counter[item.userId] = (counter[item.userId] || 0) + 1;
                return counter;
            }, {});

            // 借阅次数分布统计
            const borrowFrequency = Object.values(userBorrowCounts).reduce((counter, count) => {
                counter[count] = (counter[count] || 0) + 1;
                return counter;
            }, {});

            // 累计分布计算
            const sortedBorrowFrequencies = Object.keys(borrowFrequency).map(Number).sort((a, b) => a - b);
            let cumulativeCount = 0;
            const cumulativePercentages = sortedBorrowFrequencies.map(freq => {
                cumulativeCount += borrowFrequency[freq];
                return (cumulativeCount / Object.keys(userBorrowCounts).length) * 100;
            });

            this.statistics = {
                "totalBooksByCategory": totalBooksByCategory,
                "totalBorrowingsByCategory": totalBorrowingsByCategory,
                "totalBorrowingsByDate": { dates: sortedDates, borrowingCounts, returnCounts },
                "borrowFrequency": { frequencies: sortedBorrowFrequencies, cumulativePercentages },
            }

            this.initCharts();
        },
        initCharts() {
            const chart1 = init(this.$refs.chart1);
            const chart2 = init(this.$refs.chart2);
            const chart3 = init(this.$refs.chart3);
            const chart4 = init(this.$refs.chart4);

            const totalBooksByCategory = Object.keys(this.statistics.totalBooksByCategory).map(key => ({
                name: key,
                value: this.statistics.totalBooksByCategory[key],
                itemStyle: { color: this.getColorByCategory(key) }
            }));

            const totalBorrowingsByCategory = Object.keys(this.statistics.totalBorrowingsByCategory).map(key => ({
                name: key,
                value: this.statistics.totalBorrowingsByCategory[key],
                itemStyle: { color: this.getColorByCategory(key) }
            }));

            const options = [
                {
                    title: { text: "按类别统计 - 书本数量", x: "center" },
                    tooltip: {
                        trigger: "item",
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: "vertical",
                        left: "left",
                        data: Object.keys(this.statistics.totalBooksByCategory).sort()
                    },
                    series: [
                        {
                            name: "书本数量",
                            type: "pie",
                            radius: "55%",
                            center: ["50%", "60%"],
                            data: totalBooksByCategory,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: "rgba(0, 0, 0, 0.5)"
                                }
                            }
                        }
                    ]
                },
                {
                    title: { text: "按类别统计 - 借阅次数", x: "center" },
                    tooltip: {
                        trigger: "item",
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: "vertical",
                        left: "left",
                        data: Object.keys(this.statistics.totalBorrowingsByCategory).sort()
                    },
                    series: [
                        {
                            name: "借阅次数",
                            type: "pie",
                            radius: "55%",
                            center: ["50%", "60%"],
                            data: totalBorrowingsByCategory,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: "rgba(0, 0, 0, 0.5)"
                                }
                            }
                        }
                    ]
                },
                {
                    title: { text: "按日期统计 - 借出与归还数量", x: "center" },
                    tooltip: { trigger: "axis" },
                    legend: { data: ["借出数量", "归还数量"], x: "left" },
                    xAxis: {
                        name: "日期",
                        type: "category",
                        data: this.statistics.totalBorrowingsByDate.dates,
                        axisLabel: { interval: "auto", rotate: 30 }
                    },
                    yAxis: {
                        name: "数量",
                        type: "value"
                    },
                    series: [
                        {
                            name: "借出数量",
                            type: "line",
                            data: this.statistics.totalBorrowingsByDate.borrowingCounts
                        },
                        {
                            name: "归还数量",
                            type: "line",
                            data: this.statistics.totalBorrowingsByDate.returnCounts
                        }
                    ]
                },
                {
                    title: { text: "按借阅次数统计 - 用户累计分布图", x: "center" },
                    tooltip: { trigger: "axis" },
                    xAxis: {
                        name: "借阅次数",
                        type: "category",
                        data: this.statistics.borrowFrequency.frequencies,
                        axisLabel: { interval: "auto", rotate: 30 }
                    },
                    yAxis: {
                        name: "用户数量百分比",
                        type: "value",
                        axisLabel: { formatter: "{value}%" }
                    },
                    series: [
                        {
                            name: "累计百分比",
                            type: "line",
                            data: this.statistics.borrowFrequency.cumulativePercentages,
                            smooth: true,
                            areaStyle: {}
                        }
                    ]
                }
            ];

            chart1.setOption(options[0]);
            chart2.setOption(options[1]);
            chart3.setOption(options[2]);
            chart4.setOption(options[3]);
        }
    }
};
</script>

<style>
.header-title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin: 20px 0;
}

.chart-container {
    width: 100%;
    height: 400px;
    padding: 6px;
    background: #fff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.bordered {
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
}

.bordered:hover {
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
}

.el-container {
    background-color: #f5f7fa;
    padding: 20px;
}
</style>
