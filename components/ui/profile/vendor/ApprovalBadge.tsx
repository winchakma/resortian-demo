import { ApprovalStatus } from "@/types";
import { APPROVAL_CONFIG } from "@/utils";

export default function ApprovalBadge({
  status,
  sm,
}: {
  status: ApprovalStatus;
  sm?: boolean;
}) {
  const cfg = APPROVAL_CONFIG[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold ${sm ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"} ${cfg.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
