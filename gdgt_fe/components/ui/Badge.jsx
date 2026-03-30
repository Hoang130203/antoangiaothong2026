const colorMap = {
  green: 'bg-green-100 text-green-700 border-green-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  navy: 'bg-navy-100 text-navy-800 border-navy-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function Badge({ children, color = 'navy', className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border
        ${colorMap[color] || colorMap.navy}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
