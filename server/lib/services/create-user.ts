
export default async function (webAppUser: WebAppUser, refId?: number) {
  const account = await tron.createAccount();
  return prisma.user.create({
    data: {
      id: webAppUser.id,
      firstName: webAppUser.first_name,
      lastName: webAppUser.last_name,
      username: webAppUser.username,
      languageCode: webAppUser.language_code,
      address: account.address.base58,
      privateKey: account.privateKey,
      created: new Date().getTime(),
      ref: refId
        ? {
            connect: {
              id: BigInt(refId),
            },
          }
        : undefined,
    },
  });
}
