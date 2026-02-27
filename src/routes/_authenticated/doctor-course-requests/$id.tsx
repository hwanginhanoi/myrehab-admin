import { createFileRoute, useLocation } from "@tanstack/react-router";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  type CourseAssignmentRequestResponse,
  useGetCourseRequests,
} from "@/api";
import { DoctorCourseRequestDetail } from "@/features/doctor-course-request-detail";

const searchSchema = z.object({
  mode: z.enum(["view", "review"]).optional().catch(undefined),
});

function DoctorCourseRequestDetailPage() {
  const { id } = Route.useParams();
  const { mode } = Route.useSearch();
  const location = useLocation();
  const state = location.state as
    | { requestData?: CourseAssignmentRequestResponse }
    | undefined;
  const stateRequest = state?.requestData;

  // Fetch from API to ensure data is available even without router state
  const { data, isLoading } = useGetCourseRequests(
    { pageable: { page: 0, size: 100 } },
    { query: { enabled: !stateRequest } },
  );

  const apiRequest = (
    data?.content as CourseAssignmentRequestResponse[] | undefined
  )?.find((r) => String(r.id) === id);

  const request = stateRequest ?? apiRequest;

  if (isLoading && !stateRequest) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="text-muted-foreground">
          Không tìm thấy dữ liệu yêu cầu. Vui lòng quay lại danh sách.
        </span>
      </div>
    );
  }

  return (
    <DoctorCourseRequestDetail request={request} mode={mode ?? "review"} />
  );
}

export const Route = createFileRoute(
  "/_authenticated/doctor-course-requests/$id",
)({
  validateSearch: searchSchema,
  component: DoctorCourseRequestDetailPage,
});
