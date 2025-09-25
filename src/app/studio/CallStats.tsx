'use client';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
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
  const outcomeColors = ['var(--chart-2)', 'var(--chart-3)'];
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

        {/* Calls Volume Radar Chart */}
        <div className="flex min-h-[260px] w-full flex-col items-center justify-center">
          <h4 className="mb-2 text-sm font-semibold text-neutral-200">
            Calls Volume
          </h4>
          <RadarChart
            cx={180}
            cy={140}
            outerRadius={110}
            width={360}
            height={280}
            data={callsBarData}
          >
            <PolarGrid stroke="var(--neutral-700)" />
            <PolarAngleAxis
              dataKey="name"
              tick={(props) => (
                <text
                  {...props}
                  fill="var(--foreground, #fff)"
                  fontWeight="bold"
                  fontSize={14}
                >
                  {props.payload && props.payload.value}
                </text>
              )}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[
                0,
                Math.max(...callsBarData.map((d) => d.value)) * 1.15 || 1,
              ]}
              tick={{ fill: 'var(--foreground, #fff)', fontSize: 12 }}
              axisLine={false}
            />
            <Radar
              name="Calls"
              dataKey="value"
              stroke="var(--chart-4)"
              fill="var(--chart-4)"
              fillOpacity={0.6}
              isAnimationActive={false}
              label={({ cx, cy, points, value }) =>
                points
                  ? points.map((pt, idx) => (
                      <text
                        key={callsBarData[idx].name}
                        x={pt.x + (pt.x - cx) * 0.08}
                        y={pt.y + (pt.y - cy) * 0.08}
                        textAnchor="middle"
                        fontSize="13"
                        fontWeight="bold"
                        fill="var(--foreground, #fff)"
                        alignmentBaseline="middle"
                      >
                        {callsBarData[idx].value}
                      </text>
                    ))
                  : null
              }
            />
            <Tooltip />
            <Legend />
          </RadarChart>
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

        {/* Success vs Fail Bar Chart */}
        <div className="flex min-h-[200px] w-full flex-col items-center justify-center">
          <h4 className="mb-2 text-sm font-semibold text-neutral-200">
            Success vs Fail
          </h4>
          <BarChart
            width={250}
            height={200}
            data={successFailBarData}
            barCategoryGap={32}
            barGap={8}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="value"
              fill="var(--chart-4)"
              radius={6}
              label={{
                position: 'top',
                fill: 'var(--chart-4)',
                fontWeight: 'bold',
                fontSize: 14,
              }}
            />
          </BarChart>
        </div>

        {/* User vs Bot Turns Pie Chart */}
        <div className="flex min-h-[200px] w-full flex-col items-center justify-center">
          <h4 className="mb-2 text-sm font-semibold text-neutral-200">
            User vs Bot Turns
          </h4>
          <PieChart width={250} height={200}>
            <Pie
              data={userBotPieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={60}
              label
            >
              <Cell key="user" fill="var(--chart-1)" />
              <Cell key="bot" fill="var(--chart-2)" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
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
