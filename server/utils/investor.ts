import dayjs from "dayjs";

class Investor {
  private period = 10; // seconds
  private timer;

  constructor() {
    this.timer = setInterval(() => {
      this.calc().then();
    }, this.period * 1000);
  }

  private async calc() {
    const invests = await prisma.investment.findMany({
      where: { closed: false },
    });
    for (const i of invests) {
      const now = dayjs().unix();
      const closed = now >= i.endEpoch;
      const slots = BigInt(Math.round((i.endEpoch - i.startEpoch) / this.period));
      const pass = BigInt(Math.round((now - i.startEpoch) / this.period));
      const full = BigInt((Number(i.amount) * (100 + i.rate)) / 100);
      const interest = closed ? full : ((full - i.amount) / slots) * pass;

      await prisma.investment.update({
        where: { id: i.id },
        data: {
          closed,
          interest,
        },
      });
    }
  }

  // private async checkBalance() {
  //   const users = await prisma.user.findMany({});
  //   for (const u of users) {
  //     const balance = await tron.trx.getBalance(u.address);
  //     if (BigInt(balance) != u.balance + u.locked) {
  //       const txs = await tron.trx.getTransactionsToAddress(u.address);
  //     }
  //   }
  // }
}

export default new Investor();
