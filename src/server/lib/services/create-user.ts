export default async function (webAppUser: WebAppUser, refId?: number) {
  const config = useRuntimeConfig();
  const created = new Date().getTime();
  const account = await tron.createAccount();
  const user = await prisma.user.create({
    data: {
      id: webAppUser.id,
      firstName: webAppUser.first_name,
      lastName: webAppUser.last_name,
      username: webAppUser.username,
      languageCode: webAppUser.language_code,
      address: account.address.base58,
      privateKey: account.privateKey,
      created,
      ref: refId
        ? {
            connect: {
              id: BigInt(refId),
            },
          }
        : undefined,
    },
  });
  if (refId) {
    await prisma.bonus.create({
      data: {
        userId: refId,
        refId: user.id,
        amount: config.finance.regBonusAbsolute,
        applied: false,
        created,
      },
    });
  }
  return user;
}
