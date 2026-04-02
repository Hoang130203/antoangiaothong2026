export default function SectionTitle({ children, subtitle, className = '' }) {
  return (
    <div className={`mb-8 ${className}`}>
      <h2
        className="text-2xl md:text-3xl font-black relative inline-block"
        style={{ color: 'var(--text-heading)', fontFamily: 'Nunito, sans-serif' }}
      >
        {children}
        <span
          className="absolute -bottom-1 left-0 right-0 h-1 rounded-full"
          style={{ background: `linear-gradient(90deg, var(--primary), var(--accent))` }}
        />
      </h2>
      {subtitle && (
        <p className="mt-3 text-base font-semibold" style={{ color: 'var(--text-muted)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
