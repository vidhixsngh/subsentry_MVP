import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CategoryBarChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export default function CategoryBarChart({ data }: CategoryBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No category data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <XAxis
          dataKey="name"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip
          formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Spending']}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid #eab308',
            borderRadius: '8px',
            padding: '8px 12px',
          }}
          labelStyle={{
            color: 'hsl(var(--foreground))',
          }}
          itemStyle={{
            color: 'hsl(var(--foreground))',
          }}
          cursor={{ fill: 'rgba(234, 179, 8, 0.1)' }}
        />
        <Bar
          dataKey="value"
          fill="#eab308"
          radius={[8, 8, 0, 0]}
          animationBegin={0}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
