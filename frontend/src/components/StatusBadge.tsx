const ASSET_STYLES: Record<string, string> = {
  AVAILABLE: 'bg-[#EAFBF1] text-[#16A34A]',
  ALLOCATED: 'bg-[#EEF1FF] text-[#2451FF]',
  MAINTENANCE: 'bg-[#FEF6E7] text-[#D97706]',
  RETIRED: 'bg-[#F1F2F5] text-[#6B7280]',
};

const BOOKING_STYLES: Record<string, string> = {
  PENDING: 'bg-[#FEF6E7] text-[#D97706]',
  CONFIRMED: 'bg-[#EEF1FF] text-[#2451FF]',
  CANCELLED: 'bg-[#FDECEC] text-[#DC2626]',
  COMPLETED: 'bg-[#EAFBF1] text-[#16A34A]',
};

export function StatusBadge({ status }: { status: string }) {
  const style = ASSET_STYLES[status] || BOOKING_STYLES[status] || 'bg-[#F1F2F5] text-[#6B7280]';
  return (
    <span
      className={`relative inline-flex items-center gap-1 rounded-[3px] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${style}`}
    >
      <span className="absolute -left-[3px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 bg-white" />
      {status}
    </span>
  );
}
