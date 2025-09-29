import { Card, CardContent } from '@/components/ui/card';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Đang tải...' }: LoadingStateProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="m-9 mt-9 mb-6">
        <Card className="shadow-lg border border-[#E5E7EB] rounded-xl">
          <CardContent className="flex items-center justify-center h-64">
            <p>{message}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}