const userDataCache = new Map();
const DATABASE_SYNC_INTERVAL = 15*1000;

function startDBSyncing(prisma) {
    setInterval(async () => {
      const now = Date.now();
      const updatePromises = [];
      
      userDataCache.forEach((userData, userId) => {
        if (userData.lastUpdated > now - DATABASE_SYNC_INTERVAL) {
          updatePromises.push(
            prisma.user.update({
              where: { id: userId },
              data: {
                lastPlacedDate: new Date(userData.lastPlacedDate),
                lastBitCount: userData.lastBitCount,
                maxBits: userData.maxBits,
                extraTime: userData.extraTime,
                placeCount: userData.placeCount,
                replaced: userData.replaced,
                placedBreak: userData.placedBreak,
                bonus: userData.bonus,
              }
            }).catch(console.error)
          );
        }
      });
      
      await Promise.all(updatePromises);
      console.log('\x1b[32m', 'Saved user data to DB', '\x1b[0m')
    }, DATABASE_SYNC_INTERVAL);
}

async function updateUser(userId, newData) {
    const cachedUser = userDataCache.get(userId) || {};
    userDataCache.set(userId, { ...cachedUser, ...newData, lastUpdated: Date.now() });  
}

async function user(prisma, userId) {
  if (!userId || !prisma) return;
  const cachedUser = userDataCache.get(userId);
  if (!cachedUser) {
      return await cacheUserFromDB(prisma, userId);
  }
  return cachedUser;
}

async function cacheUserFromDB(prisma, userId) {
    if (userDataCache.has(userId)) return;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            username: true,
            lastPlacedDate: true,
            lastBitCount: true,
            maxBits: true,
            extraTime: true,
            idNumber: true,
            placeCount: true,
            replaced: true,
            placedBreak: true,
            bonus: true,
            lastUpdated: true,
        }
    })
    if (user) userDataCache.set(userId, { ...user, lastUpdated: 0 });
    return user;
}

module.exports = {
    startDBSyncing: startDBSyncing,
    updateUser: updateUser,
    user: user,
    cacheUserFromDB: cacheUserFromDB,
}