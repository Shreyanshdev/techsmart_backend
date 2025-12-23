import cron from 'node-cron';
import Subscription from '../models/subscription.js';
import { Customer } from '../models/user.js';

/**
 * Cron job to automatically delete expired subscriptions
 * Runs every day at midnight (00:00)
 * Deletes subscriptions where endDate < current date
 */
export const startSubscriptionCleanupCron = () => {
    // Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log('🧹 Running subscription cleanup cron job...');

            const now = new Date();
            now.setHours(0, 0, 0, 0); // Start of today

            // Find all expired subscriptions
            const expiredSubscriptions = await Subscription.find({
                endDate: { $lt: now },
                status: { $in: ['active', 'paused', 'Cancelled'] }
            });

            console.log(`📊 Found ${expiredSubscriptions.length} expired subscriptions to clean up`);

            if (expiredSubscriptions.length === 0) {
                console.log('✅ No expired subscriptions to delete');
                return;
            }

            // Delete each expired subscription and clear customer reference
            for (const subscription of expiredSubscriptions) {
                try {
                    // Remove subscription reference from customer
                    const customer = await Customer.findById(subscription.customer);
                    if (customer && customer.subscription?.toString() === subscription._id.toString()) {
                        customer.subscription = undefined;
                        await customer.save();
                        console.log(`✅ Cleared subscription reference for customer: ${customer.phone || customer._id}`);
                    }

                    // Delete the subscription
                    await Subscription.findByIdAndDelete(subscription._id);
                    console.log(`🗑️  Deleted expired subscription: ${subscription.subscriptionId} (ended: ${subscription.endDate.toLocaleDateString()})`);

                } catch (error) {
                    console.error(`❌ Error deleting subscription ${subscription.subscriptionId}:`, error.message);
                }
            }

            console.log(`✅ Subscription cleanup completed. Deleted ${expiredSubscriptions.length} expired subscriptions`);

        } catch (error) {
            console.error('❌ Subscription cleanup cron job failed:', error);
        }
    });

    console.log('✅ Subscription cleanup cron job started (runs daily at midnight)');
};

/**
 * Manual cleanup function for testing or immediate execution
 */
export const cleanupExpiredSubscriptions = async () => {
    try {
        console.log('🧹 Manual subscription cleanup started...');

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const expiredSubscriptions = await Subscription.find({
            endDate: { $lt: now },
            status: { $in: ['active', 'paused', 'Cancelled'] }
        });

        console.log(`📊 Found ${expiredSubscriptions.length} expired subscriptions`);

        for (const subscription of expiredSubscriptions) {
            // Remove subscription reference from customer
            const customer = await Customer.findById(subscription.customer);
            if (customer && customer.subscription?.toString() === subscription._id.toString()) {
                customer.subscription = undefined;
                await customer.save();
            }

            // Delete the subscription
            await Subscription.findByIdAndDelete(subscription._id);
            console.log(`🗑️  Deleted: ${subscription.subscriptionId}`);
        }

        console.log(`✅ Manual cleanup completed. Deleted ${expiredSubscriptions.length} subscriptions`);
        return { deleted: expiredSubscriptions.length };

    } catch (error) {
        console.error('❌ Manual cleanup failed:', error);
        throw error;
    }
};
