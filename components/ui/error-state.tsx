import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  onBack?: () => void;
}

export function ErrorState({ error, onBack }: ErrorStateProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="m-9 mt-9 mb-6">
        <Card className="shadow-lg border border-[#E5E7EB] rounded-xl">
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-4">Lỗi: {error}</p>
              {onBack && (
                <Button onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}