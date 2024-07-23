import dayjs from "dayjs";

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
      const full = Math.round(Number(i.amount) * (1 + i.rate / 100));
      const interest = Math.round(closed ? full : ((full - Number(i.amount)) / slots) * pass);

      console.log(
        `${dayjs().unix()}: ${i.id} start:${start} finish:${finish} closed:${closed} slots:${slots} pass:${pass} full:${full} interest:${interest}`
      );

      await prisma.investment.update({
        where: { id: i.id },
        data: { closed, interest },
      });
    }
  }
}

const investor = new Investor();

export default investor;
