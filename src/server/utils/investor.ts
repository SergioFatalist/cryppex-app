import dayjs from "dayjs";
import { TransactionType } from "~/server/lib/schema";

class Investor {
  private period = 10; // seconds
  private timer;

  constructor() {
    this.timer = setInterval(() => {
      this.calc().then();
    }, this.period * 1000);
  }

  public async launch() {
    return true;
  }

  private async calc() {
    const invests = await prisma.investment.findMany({
      where: { closed: false },
    });
    for (const i of invests) {
      const now = dayjs().unix();
      const start = dayjs(Number(i.start)).unix();
      const finish = dayjs(Number(i.finish)).unix();
      const closed = now >= finish;
      const slots = (finish - start) / this.period;
      const pass = (now - start) / this.period;
      const full = Math.round(Number(i.amount) * (1 + i.rate / 100) - Number(i.amount));
      const interest = Math.round(closed ? full : (full / slots) * pass);

      console.log(
        `${dayjs().unix()}: ${i.id} start:${start} finish:${finish} closed:${closed} slots:${slots} pass:${pass} full:${full} interest:${interest}`
      );

      await prisma.investment.update({
        where: { id: i.id },
        data: { closed, interest },
      });
      if (closed) {
        await prisma.user.update({
          where: { id: i.userId },
          data: {
            balance: {
              increment: i.amount + BigInt(full),
            },
          },
        });
        await prisma.transaction.create({
          data: {
            type: TransactionType.INTEREST,
            internal: true,
            success: true,
            pending: false,
            amount: i.amount + BigInt(full),
            txTime: now.valueOf(),
            user: {
              connect: {
                id: i.userId,
              },
            },
          },
        });
      }
    }
  }
}

const investor = new Investor();

export default investor;
