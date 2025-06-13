"use client";

import React, { useState, useCallback, JSX } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ResponsiveContainer,
} from "recharts";
import {
  Trash2,
  Download,
  Save,
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  Zap,
} from "lucide-react";

// Types and Interfaces
interface DataPoint {
  name: string;
  sales: number;
  profit: number;
  customers: number;
  region: string;
  category: string;
}

interface ChartConfig {
  xAxis: string;
  yAxis: string;
  width: number;
  height: number;
}

interface DashboardItem {
  id: string;
  type: string;
  component: ChartComponent;
  name: string;
  config: ChartConfig;
}

interface ChartType {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  component: ChartComponent;
}

interface DraggedField {
  field: string;
  type: "dimensions" | "measures";
}

interface FieldTypes {
  dimensions: string[];
  measures: string[];
}

type ChartComponent = "BarChart" | "LineChart" | "PieChart" | "ScatterChart";

// Sample data
const sampleData: DataPoint[] = [
  { name: "Jan", sales: 4000, profit: 2400, customers: 240, region: "North", category: "Electronics" },
  { name: "Feb", sales: 3000, profit: 1398, customers: 221, region: "South", category: "Clothing" },
  { name: "Mar", sales: 2000, profit: 9800, customers: 229, region: "East", category: "Electronics" },
  { name: "Apr", sales: 2780, profit: 3908, customers: 200, region: "West", category: "Books" },
  { name: "May", sales: 1890, profit: 4800, customers: 218, region: "North", category: "Clothing" },
  { name: "Jun", sales: 2390, profit: 3800, customers: 250, region: "South", category: "Electronics" },
];

const fieldTypes: FieldTypes = {
  dimensions: ["name", "region", "category"],
  measures: ["sales", "profit", "customers"],
};

const chartTypes: ChartType[] = [
  { id: "bar", name: "Bar Chart", icon: BarChart3, component: "BarChart" },
  { id: "line", name: "Line Chart", icon: TrendingUp, component: "LineChart" },
  { id: "pie", name: "Pie Chart", icon: PieChartIcon, component: "PieChart" },
  { id: "scatter", name: "Scatter Plot", icon: Zap, component: "ScatterChart" },
];

const colors: string[] = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0"];

export default function TableauDashboard(): JSX.Element {
  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([]);
  const [draggedField, setDraggedField] = useState<DraggedField | null>(null);
  const [dashboardName, setDashboardName] = useState<string>("My Dashboard");

  const handleFieldDragStart = (field: string, type: "dimensions" | "measures"): void => {
    setDraggedField({ field, type });
  };

  const handleChartDrop = useCallback((e: React.DragEvent<HTMLDivElement>, chartId: string): void => {
    e.preventDefault();
    if (!draggedField) return;

    setDashboardItems((prev) =>
      prev.map((item) => {
        if (item.id === chartId) {
          const updatedConfig: ChartConfig = { ...item.config };
          if (draggedField.type === "dimensions") {
            updatedConfig.xAxis = draggedField.field;
          } else {
            updatedConfig.yAxis = draggedField.field;
          }
          return { ...item, config: updatedConfig };
        }
        return item;
      })
    );

    setDraggedField(null);
  }, [draggedField]);

  const addChart = (chartType: ChartType): void => {
    const newChart: DashboardItem = {
      id: `chart-${Date.now()}`,
      type: chartType.id,
      component: chartType.component,
      name: `${chartType.name} ${dashboardItems.length + 1}`,
      config: { xAxis: "name", yAxis: "sales", width: 400, height: 300 },
    };
    setDashboardItems((prev) => [...prev, newChart]);
  };

  const removeChart = (chartId: string): void => {
    setDashboardItems((prev) => prev.filter((item) => item.id !== chartId));
  };

  const renderChart = (item: DashboardItem): JSX.Element => {
    const { config, component } = item;
    const chartData = sampleData;

    switch (component) {
      case "BarChart":
        return (
          <ResponsiveContainer width="100%" height={config.height}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={config.yAxis} fill={colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "LineChart":
        return (
          <ResponsiveContainer width="100%" height={config.height}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={config.yAxis} stroke={colors[1]} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case "PieChart":
        return (
          <ResponsiveContainer width="100%" height={config.height}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey={config.yAxis}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case "ScatterChart":
        return (
          <ResponsiveContainer width="100%" height={config.height}>
            <ScatterChart data={chartData}>
              <CartesianGrid />
              <XAxis dataKey={config.xAxis} />
              <YAxis dataKey={config.yAxis} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="Data" dataKey={config.yAxis} fill={colors[3]} />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="p-4 text-gray-500">Chart type not supported</div>;
    }
  };

  const handleDashboardNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDashboardName(e.target.value);
  };

  const handleSave = (): void => {
    console.log("Saving dashboard...", { dashboardName, dashboardItems });
  };

  const handleExport = (): void => {
    console.log("Exporting dashboard...", { dashboardName, dashboardItems });
  };

  return (
    <div className="flex h-screen bg-gray-50 text-black">
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Data</h2>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Dimensions</h3>
          <div className="space-y-1">
            {fieldTypes.dimensions.map((field: string) => (
              <div key={field} draggable onDragStart={() => handleFieldDragStart(field, "dimensions")} className="p-2 bg-blue-50 border border-blue-200 rounded cursor-move hover:bg-blue-100 transition-colors text-sm">
                📊 {field.charAt(0).toUpperCase() + field.slice(1)}
              </div>
            ))}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Measures</h3>
          <div className="space-y-1">
            {fieldTypes.measures.map((field: string) => (
              <div key={field} draggable onDragStart={() => handleFieldDragStart(field, "measures")} className="p-2 bg-green-50 border border-green-200 rounded cursor-move hover:bg-green-100 transition-colors text-sm">
                🔢 {field.charAt(0).toUpperCase() + field.slice(1)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input type="text" value={dashboardName} onChange={handleDashboardNameChange} aria-label="Dashboard name" className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2" />
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={handleSave} className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                <Save size={16} className="mr-1" /> Save
              </button>
              <button onClick={handleExport} className="flex items-center px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm">
                <Download size={16} className="mr-1" /> Export
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            {chartTypes.map((chart: ChartType) => {
              const IconComponent = chart.icon;
              return (
                <button key={chart.id} onClick={() => addChart(chart)} className="p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors flex flex-col items-center text-xs">
                  <IconComponent size={16} className="mb-1" />
                  {chart.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          {dashboardItems.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <h3 className="text-lg font-medium mb-2">Start building your dashboard</h3>
                <p className="text-sm">Add charts from the buttons above and drag fields to customize them</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardItems.map((item: DashboardItem) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4" onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()} onDrop={(e: React.DragEvent<HTMLDivElement>) => handleChartDrop(e, item.id)}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <button onClick={() => removeChart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Delete chart">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="relative">
                    {renderChart(item)}
                    <div className="absolute inset-0 border-2 border-dashed border-transparent hover:border-blue-300 transition-colors rounded"></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">X: {item.config.xAxis} | Y: {item.config.yAxis}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
