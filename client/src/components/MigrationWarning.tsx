import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuthContext } from "@/providers/AuthProvider";

interface MigrationStatus {
  startedAt: string;
  daysRemaining: number | null;
  remindersSent: number;
  lastReminder: string | null;
  scheduledDeletionDate: string;
}

interface MigrationWarningProps {
  migrationStatus: MigrationStatus;
  onSwitchToOTP?: () => void;
}

export function MigrationWarning({ migrationStatus, onSwitchToOTP }: MigrationWarningProps) {
  const { changeAuthMethodMutation } = useAuthContext();

  const handleSwitchToOTP = async () => {
    try {
      await changeAuthMethodMutation.mutateAsync('otp');
      onSwitchToOTP?.();
    } catch (error) {
      console.error('Failed to switch to OTP:', error);
    }
  };

  const progressValue = migrationStatus.daysRemaining 
    ? ((30 - migrationStatus.daysRemaining) / 30) * 100 
    : 0;

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTitle className="text-lg font-semibold mb-2">
        Important: Password Authentication Deprecation
      </AlertTitle>
      <AlertDescription className="space-y-4">
        <p>
          Password authentication is being deprecated and will be removed in{' '}
          <strong>{migrationStatus.daysRemaining} days</strong>. Please switch to OTP
          authentication to ensure uninterrupted access to your account.
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Migration Progress</span>
            <span>{Math.round(progressValue)}%</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        <div className="text-sm space-y-1">
          <p>
            • Migration started: {new Date(migrationStatus.startedAt).toLocaleDateString()}
          </p>
          <p>
            • Scheduled removal: {new Date(migrationStatus.scheduledDeletionDate).toLocaleDateString()}
          </p>
          {migrationStatus.lastReminder && (
            <p>
              • Last reminder: {new Date(migrationStatus.lastReminder).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            onClick={handleSwitchToOTP}
            disabled={changeAuthMethodMutation.isPending}
            className="w-full bg-white text-red-600 hover:bg-red-50"
          >
            {changeAuthMethodMutation.isPending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                Switching to OTP...
              </div>
            ) : (
              "Switch to OTP Authentication Now"
            )}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
} 