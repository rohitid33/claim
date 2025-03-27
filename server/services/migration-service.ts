import User from '../models/User';

const MIGRATION_DEADLINE_DAYS = 30; // Days until password auth is removed
const REMINDER_INTERVALS = [7, 3, 1]; // Days before deadline to send reminders

export class MigrationService {
  /**
   * Start migration process for a user
   */
  static async startMigration(userId: string) {
    const user = await User.findById(userId);
    if (!user || !user.hasPassword) return;

    const scheduledDeletionDate = new Date();
    scheduledDeletionDate.setDate(scheduledDeletionDate.getDate() + MIGRATION_DEADLINE_DAYS);

    user.migrationStatus = {
      notifiedAt: new Date(),
      reminderCount: 0,
      scheduledDeletionDate
    };

    await user.save();
    return user;
  }

  /**
   * Process reminders for all users in migration
   */
  static async processReminders() {
    const users = await User.find({
      hasPassword: true,
      'migrationStatus.scheduledDeletionDate': { $exists: true }
    });

    for (const user of users) {
      if (!user.migrationStatus?.scheduledDeletionDate) continue;

      const daysUntilDeletion = Math.ceil(
        (user.migrationStatus.scheduledDeletionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      if (REMINDER_INTERVALS.includes(daysUntilDeletion)) {
        if (daysUntilDeletion !== user.migrationStatus.reminderCount) {
          // Send reminder (implement your notification system here)
          console.log(`Sending reminder to ${user.username}. ${daysUntilDeletion} days remaining.`);
          
          user.migrationStatus.reminderCount++;
          user.migrationStatus.lastReminder = new Date();
          await user.save();
        }
      }
    }
  }

  /**
   * Remove password authentication for users past deadline
   */
  static async processPasswordDeletion() {
    const users = await User.find({
      hasPassword: true,
      'migrationStatus.scheduledDeletionDate': { $lt: new Date() }
    });

    for (const user of users) {
      // Remove password authentication
      user.password = undefined;
      user.hasPassword = false;
      user.preferredAuthMethod = 'otp';
      user.migrationStatus = undefined;
      
      await user.save();
      
      // Log the migration completion
      console.log(`Completed migration for user: ${user.username}`);
    }
  }

  /**
   * Get migration status for a user
   */
  static async getMigrationStatus(userId: string) {
    const user = await User.findById(userId);
    if (!user || !user.migrationStatus) return null;

    const daysRemaining = user.migrationStatus.scheduledDeletionDate 
      ? Math.ceil((user.migrationStatus.scheduledDeletionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    return {
      startedAt: user.migrationStatus.notifiedAt,
      daysRemaining,
      remindersSent: user.migrationStatus.reminderCount,
      lastReminder: user.migrationStatus.lastReminder,
      scheduledDeletionDate: user.migrationStatus.scheduledDeletionDate
    };
  }
} 