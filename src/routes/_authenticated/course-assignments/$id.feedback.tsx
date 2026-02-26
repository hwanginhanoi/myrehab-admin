import { createFileRoute } from "@tanstack/react-router";
import { DailyFeedbackSection } from "@/features/course-assignment-detail/components/daily-feedback-section";

export const Route = createFileRoute(
  "/_authenticated/course-assignments/$id/feedback",
)({
  component: DailyFeedbackSection,
});
