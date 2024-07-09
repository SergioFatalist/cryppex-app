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
      console.log(i);
      console.log(
        `now: ${now}, closed: ${closed}, slots: ${slots}, pass: ${pass}, full: ${full}, interest: ${interest}`
      );
      await prisma.investment.update({
        where: { id: i.id },
        data: {
          closed,
          interest,
        },
      });
    }
  }
}

export default new Investor();
