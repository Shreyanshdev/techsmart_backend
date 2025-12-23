/**
 * Subscription Expiry Cron Job
 * 
 * This cron job runs daily at 11:59 PM to check and expire subscriptions:
 * 1. Find all active subscriptions where the last scheduled delivery date has passed
 * 2. Mark them as "expired" (NOT deleted)
 * 3. Customer still has access to subscription history and invoices
 */

import cron from 'node-cron';
import Subscription from '../models/subscription.js';

// Process subscription expiry
export const processSubscriptionExpiry = async () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    console.log(`\n🕐 [${new Date().toISOString()}] Running Subscription Expiry Check Job...`);

    try {
        // Find all active subscriptions where endDate has passed
        const expiredSubscriptions = await Subscription.find({
            status: 'active',
            endDate: { $lt: today }
        });

        let totalExpired = 0;

        for (const subscription of expiredSubscriptions) {
            // Double-check: verify last delivery date has passed
            const lastScheduledDelivery = subscription.deliveries
                .filter(d => d.status !== 'canceled' && d.status !== 'paused')
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

            if (!lastScheduledDelivery || new Date(lastScheduledDelivery.date) < today) {
                subscription.status = 'expired';
                await subscription.save();
                totalExpired++;
                console.log(`📦 Subscription ${subscription.subscriptionId} marked as expired (End Date: ${subscription.endDate.toDateString()})`);
            }
        }

        console.log(`\n📊 Subscription Expiry Job Summary:`);
        console.log(`   - Subscriptions checked: ${expiredSubscriptions.length}`);
        console.log(`   - Subscriptions expired: ${totalExpired}`);
        console.log(`✅ Subscription Expiry Job completed at ${new Date().toISOString()}\n`);

        return { checked: expiredSubscriptions.length, expired: totalExpired };

    } catch (error) {
        console.error('❌ Error in Subscription Expiry Job:', error);
        throw error;
    }
};

// Schedule cron job to run at 11:59 PM every day
// Format: minute hour day-of-month month day-of-week
export const startSubscriptionExpiryCron = () => {
    // Run at 11:59 PM every day (just before midnight)
    cron.schedule('59 23 * * *', async () => {
        try {
            await processSubscriptionExpiry();
        } catch (error) {
            console.error('Cron job error:', error);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata" // Indian Standard Time
    });

    console.log('🔄 Subscription Expiry Cron Job scheduled for 11:59 PM IST daily');
};

export default { startSubscriptionExpiryCron, processSubscriptionExpiry };
