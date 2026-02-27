import { getRouteApi } from "@tanstack/react-router";
import { User, Stethoscope, Calendar } from "lucide-react";
import { PurchaseStatusBadge } from "@/features/course-assignments/components/purchase-status-badge";
import { ProgressBadge } from "@/features/course-assignments/components/progress-badge";
import { formatDate } from "@/lib/course-assignment-utils";
import { AssignmentContentSection } from "./assignment-content-section";

const route = getRouteApi("/_authenticated/course-assignments/$id");

export function AssignmentInfoSection() {
  const search = route.useSearch();
  const {
    courseTitle,
    patientFullName,
    assignedByDoctorName,
    assignedAt,
    purchaseStatus,
    hasStarted,
    isCompleted,
  } = search;

  return (
    <AssignmentContentSection
      title="Thông tin phân công"
      desc="Thông tin chi tiết về phân công khóa tập cho bệnh nhân."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoRow icon={<User className="h-4 w-4" />} label="Bệnh nhân">
            {patientFullName || "-"}
          </InfoRow>
          <InfoRow
            icon={<Stethoscope className="h-4 w-4" />}
            label="Bác sĩ phân công"
          >
            {assignedByDoctorName || "-"}
          </InfoRow>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoRow
            icon={<Calendar className="h-4 w-4" />}
            label="Ngày phân công"
          >
            {formatDate(assignedAt)}
          </InfoRow>
          <InfoRow label="Khóa tập">{courseTitle || "-"}</InfoRow>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoRow label="Trạng thái thanh toán">
            <PurchaseStatusBadge status={purchaseStatus} />
          </InfoRow>
          <InfoRow label="Tiến độ">
            <ProgressBadge hasStarted={hasStarted} isCompleted={isCompleted} />
          </InfoRow>
        </div>
      </div>
    </AssignmentContentSection>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  );
}
