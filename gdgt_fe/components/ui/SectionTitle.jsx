export default function SectionTitle({ children, subtitle, className = '' }) {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-bold text-navy-800 relative inline-block">
        {children}
        <span className="absolute -bottom-1 left-0 right-0 h-1 bg-orange-500 rounded-full" />
      </h2>
      {subtitle && (
        <p className="mt-3 text-slate-500 text-base">{subtitle}</p>
      )}
    </div>
  );
}
