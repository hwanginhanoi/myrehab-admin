import { type Row } from "@tanstack/react-table";
import { MoreHorizontal, Eye } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CourseAssignmentDetail } from "../types";

type CourseAssignmentsRowActionsProps = {
  row: Row<CourseAssignmentDetail>;
};

export function CourseAssignmentsRowActions({
  row,
}: CourseAssignmentsRowActionsProps) {
  const navigate = useNavigate();
  const a = row.original;

  const handleViewDetails = () => {
    if (!a.id || !a.courseId) return;
    navigate({
      to: "/course-assignments/$id",
      params: { id: String(a.id) },
      search: {
        courseId: a.courseId!,
        courseTitle: a.courseTitle,
        patientFullName: a.patientFullName,
        assignedByDoctorName: a.assignedByDoctorName,
        assignedAt: a.assignedAt,
        purchaseStatus: a.purchaseStatus,
        hasStarted: a.hasStarted,
        isCompleted: a.isCompleted,
        patientId: a.patientId,
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleViewDetails}
          disabled={!a.id || !a.courseId}
        >
          <Eye className="size-4" />
          Xem chi tiết
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
