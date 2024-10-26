import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { userId, temperatureThreshold, conditionType } = await request.json();
  
  // Input validation
  if (typeof temperatureThreshold !== 'number' || !userId || !conditionType) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const existingSetting = await prisma.userSettings.findFirst({ where: { userId } });

    if (existingSetting) {
      const updatedSetting = await prisma.userSettings.update({
        where: { id: existingSetting.id },
        data: { temperatureThreshold, conditionType },
      });
      return NextResponse.json(updatedSetting);
    } else {
      const newSetting = await prisma.userSettings.create({
        data: { userId, temperatureThreshold, conditionType },
      });
      return NextResponse.json(newSetting);
    }
  } catch (error) {
    console.error("Error saving user settings:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
