import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";

async function getBalance(userId: number) {
  const balance = await prisma.balance.findFirst({
    where: { userId },
  });

  return {
    amount: balance?.amount ?? 0,
    locked: balance?.locked ?? 0,
  };
}

async function getOnRampTransactions(userId: number) {
  const txns = await prisma.onRampTransaction.findMany({
    where: { userId },
    orderBy: { startTime: "desc" },
  });

  return txns.map((t) => ({
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
  }));
}

export default async function TransferPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div className="p-8 text-red-500">Unauthorized</div>;
  }

  const userId = Number(session.user.id);

  const [balance, transactions] = await Promise.all([
    getBalance(userId),
    getOnRampTransactions(userId),
  ]);

  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Transfer
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <AddMoney />
        </div>

        <div>
          <BalanceCard amount={balance.amount} locked={balance.locked} />
          <div className="pt-4">
            <OnRampTransactions transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
