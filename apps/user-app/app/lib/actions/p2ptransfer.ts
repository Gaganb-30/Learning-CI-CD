"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
  const session = await getServerSession(authOptions);
  const from = session?.user?.id || null;

  if (!from) {
    return { message: "Unauthorized" };
  }

  if (amount <= 0) {
    return { message: "Invalid amount" };
  }

  const toUser = await prisma.user.findFirst({
    where: { number: to },
  });

  if (!toUser) {
    return { message: "User not found" };
  }

  if (toUser.id === Number(from)) {
    return { message: "Cannot transfer to yourself" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 🔒 Row-level lock
      await tx.$queryRaw`
        SELECT * FROM "Balance"
        WHERE "userId" = ${Number(from)}
        FOR UPDATE
      `;

      const fromBalance = await tx.balance.findUnique({
        where: { userId: Number(from) },
      });

      if (!fromBalance || fromBalance.amount < amount) {
        throw new Error("Insufficient funds");
      }

      await tx.balance.update({
        where: { userId: Number(from) },
        data: { amount: { decrement: amount } },
      });

      await tx.balance.update({
        where: { userId: toUser.id },
        data: { amount: { increment: amount } },
      });

      await tx.p2pTransfer.create({
        data: {
          fromUserId: Number(from),
          toUserId: toUser.id,
          amount,
          timestamp: new Date(),
        },
      });
    });

    return { message: "Transfer successful" };
  } catch (error) {
    console.error(error);
    return { message: "Transfer failed" };
  }
}
