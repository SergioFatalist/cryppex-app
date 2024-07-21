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
      const now = BigInt(new Date().getTime());
      const closed = now >= i.finish;
      const slots = (i.finish - i.start) / BigInt(this.period);
      const pass = (now - i.start) / BigInt(this.period);
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
}

const investor = new Investor();

export default investor;
