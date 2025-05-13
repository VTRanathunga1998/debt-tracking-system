interface MetricCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  title: string;
  value: string;
}

export default function MetricCard({ icon, iconBgColor, title, value }: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center">
        <div className={`p-3 ${iconBgColor} rounded-lg`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl text-black font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}