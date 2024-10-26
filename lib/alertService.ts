import { PrismaClient } from '@prisma/client';
import { sendAlert } from '@/utils/websocket';

const prisma = new PrismaClient();

export async function checkAndTriggerAlerts(city: string, temperature: number) {
    const userSettings = await prisma.userSettings.findMany();

    for (const setting of userSettings) {
        if (setting.conditionType === 'hot' && temperature > setting.temperatureThreshold) {
            const alert = await prisma.alert.create({
                data: {
                    city,
                    triggeredAt: new Date(),
                    alertType: 'hot',
                    threshold: setting.temperatureThreshold,
                },
            });

            console.log("Alert triggered:", alert);
            // Send WebSocket alert to connected clients
            sendAlert(setting.userId, `Temperature alert for ${city}! Current temp: ${temperature}°C exceeds threshold.`);
        }
    }
}
