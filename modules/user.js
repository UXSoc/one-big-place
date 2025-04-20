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
                firstLogin: userData.firstLogin,
                lastUpdated: new Date(userData.lastUpdated),
              }
            }).catch(console.error)
          );
        }
      });
      
      await Promise.all(updatePromises);
      console.log('\x1b[32m', 'Saved user data to DB', '\x1b[0m')
    }, DATABASE_SYNC_INTERVAL);
}

async function updateUser(prisma, userId, newData) {
    const cachedUser = await user(prisma, userId);
    if (!cachedUser) throw new Error("Trying to update undefined User");
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
    if (!user) return;
    let higherCount;
    higherCount = await prisma.user.count({
      where: {
        placeCount: {
          gt: user.placeCount
        }
      }
    });
    userDataCache.set(userId, { ...user, lastUpdated: 0, place: higherCount + 1, bonusSet: new Set(user.bonus) })
    return userDataCache.get(userId);
}

async function getLeaderboard(prisma) {
  try {
    const top_users = await prisma.user.findMany({
      orderBy: {
        placeCount: 'desc',
      },
      select: {
        id: true,
      },
      take: 10,
    });
    const userObjects = await Promise.all(
      top_users.map(u => user(prisma, u.id))
    );
    return userObjects;
  } catch (error) {
    console.error('Error fetching top users:', error);
    return [];
  }
}


async function getUserPlaceCountByYear(prisma) {
  try {
    const users = await prisma.user.findMany({
      select: {
        idNumber: true,
        placeCount: true,
      },
    });

    const yearCount = users.reduce((acc, user) => {
      const year = user.idNumber.toString().slice(0, 2);
      const placed = user.placeCount || 0;
      acc[year] = (acc[year] || 0) + placed;
      return acc;
    }, {});

    return yearCount;
  } catch (error) {
    console.error('Error fetching placed count by year:', error);
    return {};
  }
}

module.exports = {
    startDBSyncing: startDBSyncing,
    updateUser: updateUser,
    user: user,
    cacheUserFromDB: cacheUserFromDB,
    getLeaderboard: getLeaderboard,
    getUserPlaceCountByYear: getUserPlaceCountByYear,
}