/**
 * Missed Delivery Concession Cron Job
 * 
 * This cron job runs at 11:55 PM every day to handle missed deliveries:
 * 1. Find all deliveries for today that are still in "scheduled" status
 * 2. Mark them as "concession" (delivery was missed by delivery partner)
 * 3. Create a new delivery at the end of subscription as compensation
 * 4. Extend the subscription end date by 1 day for each missed delivery
 * 5. This is company's fault, so customer gets compensated
 */

import cron from 'node-cron';
import Subscription from '../models/subscription.js';

// Process missed deliveries for concession
export const processMissedDeliveries = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log(`\n🕐 [${new Date().toISOString()}] Running Missed Delivery Concession Job...`);

    try {
        // Find all active subscriptions with deliveries for today that are still "scheduled"
        const subscriptions = await Subscription.find({
            status: 'active',
            'deliveries.date': {
                $gte: today,
                $lt: tomorrow
            }
        });

        let totalProcessed = 0;
        let totalConcessions = 0;

        for (const subscription of subscriptions) {
            // Find today's deliveries that are still scheduled (missed)
            const missedDeliveries = subscription.deliveries.filter(delivery => {
                const deliveryDate = new Date(delivery.date);
                deliveryDate.setHours(0, 0, 0, 0);
                return deliveryDate.getTime() === today.getTime() &&
                    delivery.status === 'scheduled';
            });

            if (missedDeliveries.length === 0) continue;

            console.log(`📦 Subscription ${subscription.subscriptionId}: Found ${missedDeliveries.length} missed delivery(ies)`);

            // Process each missed delivery
            for (const missedDelivery of missedDeliveries) {
                // 1. Mark the delivery as concession
                missedDelivery.status = 'concession';
                missedDelivery.concession = true;
                missedDelivery.canceledAt = new Date();

                // Calculate new delivery date (day after current subscription end)
                const currentEndDate = new Date(subscription.endDate);
                const newDeliveryDate = new Date(currentEndDate);
                newDeliveryDate.setDate(newDeliveryDate.getDate() + 1);

                // Store concession details
                missedDelivery.concessionDetails = {
                    originalDate: missedDelivery.date,
                    rescheduledTo: newDeliveryDate,
                    reason: 'Missed by delivery partner - auto-compensated',
                    extendedSubscription: true,
                    processedAt: new Date()
                };

                // 2. Create new delivery at the end as compensation
                const cutoffTime = new Date(newDeliveryDate);
                if (subscription.slot === 'morning') {
                    cutoffTime.setHours(4, 0, 0, 0); // 4 AM cutoff for morning
                } else {
                    cutoffTime.setHours(16, 0, 0, 0); // 4 PM cutoff for evening
                }

                const compensationDelivery = {
                    date: newDeliveryDate,
                    slot: subscription.slot,
                    status: 'scheduled',
                    cutoffTime: cutoffTime,
                    concession: true,
                    concessionDetails: {
                        originalDate: missedDelivery.date,
                        rescheduledTo: newDeliveryDate,
                        reason: 'Compensation for missed delivery',
                        extendedSubscription: true,
                        processedAt: new Date()
                    },
                    products: missedDelivery.products.map(p => ({
                        subscriptionProductId: p.subscriptionProductId,
                        productId: p.productId,
                        productName: p.productName,
                        quantityValue: p.quantityValue,
                        quantityUnit: p.quantityUnit,
                        unitPrice: p.unitPrice,
                        animalType: p.animalType || 'cow',
                        deliveryStatus: 'pending'
                    })),
                    isCustom: false
                };

                subscription.deliveries.push(compensationDelivery);

                // 3. Extend subscription end date by 1 day
                subscription.endDate = newDeliveryDate;

                totalConcessions++;
                console.log(`  ✅ Processed: ${missedDelivery.date.toDateString()} → Rescheduled to ${newDeliveryDate.toDateString()}`);
            }

            // Save the subscription with all changes
            await subscription.save();
            totalProcessed++;
        }

        console.log(`\n📊 Concession Job Summary:`);
        console.log(`   - Subscriptions processed: ${totalProcessed}`);
        console.log(`   - Missed deliveries compensated: ${totalConcessions}`);
        console.log(`   - Subscription expiry dates extended: ${totalConcessions}`);
        console.log(`✅ Missed Delivery Concession Job completed at ${new Date().toISOString()}\n`);

        return { processed: totalProcessed, concessions: totalConcessions };

    } catch (error) {
        console.error('❌ Error in Missed Delivery Concession Job:', error);
        throw error;
    }
};

// Schedule cron job to run at 11:55 PM every day
// Format: minute hour day-of-month month day-of-week
export const startMissedDeliveryCron = () => {
    // Run at 11:55 PM every day (before midnight)
    cron.schedule('55 23 * * *', async () => {
        try {
            await processMissedDeliveries();
        } catch (error) {
            console.error('Cron job error:', error);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata" // Indian Standard Time
    });

    console.log('🔄 Missed Delivery Concession Cron Job scheduled for 11:55 PM IST daily');
};

export default { startMissedDeliveryCron, processMissedDeliveries };
