let userDataSelfId = null;
const userDataCache = new Map();

export const userEventTarget = new EventTarget();

export async function setUserData(userId, userData) {
    if (userDataCache.has(userId)) {
        const cachedUserData = userDataCache.get(userId);
        userDataCache.set(userId, {...cachedUserData, ...userData})
        return;
    }
    userDataCache.set(userId, userData);
}

export async function getUserData(userId=null) {
    if (userId) {
        let userData = userDataCache.get(userId);
        if (userData) return userData;
        const response = await fetch(`json/user/${userId}`);
        userData = await response.json();
        if (userData.id) userDataCache.set(userData.id, userData);
        return userDataCache.get(userId);
    }
    if (userDataSelfId) return getUserData(userDataSelfId);
    const response = await fetch(`json/user`);
    const userDataRes = await response.json();
    if (userDataRes.error) return null;
    userDataSelfId = userDataRes.id;
    return getUserData(userDataSelfId);
}

export async function updateUserData(field, value, userId) {
    if (!userDataCache.has(userId)) return;
    const userData = userDataCache.get(userId);
    userData[field] = value;
    userDataCache.set(userId, {...userData});
    userEventTarget.dispatchEvent(new CustomEvent('userUpdated', {
        detail: { userId, field, value }
    }));
}