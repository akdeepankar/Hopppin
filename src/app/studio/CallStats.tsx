'use client';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Pie,
  PieChart,
  Cell,
  Line,
  LineChart,
  Tooltip,
  Legend,
} from 'recharts';

interface CallStatsProps {
  total: number;
  callsToday: number;
  callsThisWeek: number;
  withRecording: number;
  successful: number;
  failed: number;
  userTurns: number;
  botTurns: number;
  avgResponseTime?: number;
  avgUserConfidence?: number;
  successRate?: string;
}

export function CallStats({
  total,
  callsToday,
  callsThisWeek,
  withRecording,
  successful,
  failed,
  userTurns,
  botTurns,
  avgResponseTime,
  avgUserConfidence,
  successRate,
}: CallStatsProps) {
  const outcomeData = [
    { name: 'Successful', value: successful },
    { name: 'Failed', value: failed },
  ];
  const outcomeColors = ['#10b981', '#ef4444']; // green for success, red for failed
  const callsBarData = [
    { name: 'Total', value: total },
    { name: 'Today', value: callsToday },
    { name: 'This Week', value: callsThisWeek },
    { name: 'With Recording', value: withRecording },
  ];
  const turnsBarData = [{ name: 'Turns', User: userTurns, Bot: botTurns }];
  const successFailBarData = [
    { name: 'Success', value: successful },
    { name: 'Fail', value: failed },
  ];
  const userBotPieData = [
    { name: 'User', value: userTurns },
    { name: 'Bot', value: botTurns },
  ];
  const avgMetricsBarData = [
    { name: 'Avg Resp Time', value: Number(avgResponseTime) || 0 },
    { name: 'Avg Confidence', value: Number(avgUserConfidence) || 0 },
    {
      name: 'Success Rate',
      value: Number((successRate || '').replace('%', '')) || 0,
    },
  ];

  return (
    <>
      <div className="mb-8 grid w-full grid-cols-2 gap-4 md:grid-cols-4">
        <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <span className="mb-1 text-xs text-neutral-400">Total</span>
          <span className="text-2xl font-bold text-white">{total}</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <span className="mb-1 text-xs text-neutral-400">Calls Today</span>
          <span className="text-2xl font-bold text-white">{callsToday}</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <span className="mb-1 text-xs text-neutral-400">Success Rate</span>
          <span className="text-2xl font-bold text-emerald-400">
            {successRate ?? '-'}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <span className="mb-1 text-xs text-neutral-400">
            Avg Response Time
          </span>
          <span className="text-2xl font-bold text-indigo-400">
            {avgResponseTime ?? '-'}
          </span>
          <span className="text-xs text-neutral-400">ms</span>
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Outcomes Pie Chart */}
        <div className="flex min-h-[200px] w-full flex-col items-center justify-center">
          <h4 className="mb-2 text-sm font-semibold text-neutral-200">
            Call Outcomes
          </h4>
          <PieChart width={250} height={200}>
            <Pie
              data={outcomeData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={60}
              label
            >
              {outcomeData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={outcomeColors[idx]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Calls Volume Bar Chart */}
        <div className="flex min-h-[260px] w-full flex-col items-center justify-center">
          <h4 className="mb-2 text-sm font-semibold text-neutral-200">
            Calls Volume
          </h4>
          <BarChart
            width={360}
            height={220}
            data={callsBarData}
            layout="vertical"
            barCategoryGap={24}
            barGap={8}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              stroke="#fff"
            />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              stroke="#fff"
            />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="value"
              fill="#87cefa" // light sky blue
              radius={6}
              label={{
                position: 'right',
                fill: '#87cefa',
                fontWeight: 'bold',
                fontSize: 14,
              }}
            />
          </BarChart>
        </div>

        {/* Turns Bar Chart */}
        <div className="flex min-h-[200px] w-full flex-col items-center justify-center">
          <h4 className="mb-2 text-sm font-semibold text-neutral-200">Turns</h4>
          <BarChart
            width={250}
            height={200}
            data={turnsBarData}
            barCategoryGap={32}
            barGap={8}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="User"
              fill="var(--chart-1)"
              radius={6}
              label={{
                position: 'top',
                fill: 'var(--chart-1)',
                fontWeight: 'bold',
                fontSize: 14,
              }}
              name="User"
            />
            <Bar
              dataKey="Bot"
              fill="var(--chart-2)"
              radius={6}
              label={{
                position: 'top',
                fill: 'var(--chart-2)',
                fontWeight: 'bold',
                fontSize: 14,
              }}
              name="Bot"
            />
          </BarChart>
        </div>

        {/* Average Metrics Bar Chart */}
        <div className="flex min-h-[200px] w-full flex-col items-center justify-center">
          <h4 className="mb-2 text-sm font-semibold text-neutral-200">
            Averages
          </h4>
          <BarChart
            width={250}
            height={200}
            data={avgMetricsBarData}
            barCategoryGap={32}
            barGap={8}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="value"
              fill="var(--chart-5)"
              radius={6}
              label={{
                position: 'top',
                fill: 'var(--chart-5)',
                fontWeight: 'bold',
                fontSize: 14,
              }}
            />
          </BarChart>
        </div>
      </div>
    </>
  );
}
