const setCrucibleTrackerEnabledForAccount = async (user, boolean) => {
    await fetch(`/api/users/${user}/track`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            enabled: boolean
        })
    });
};

const isCrucibleTrackerEnabledForAccount = async (user) => {
    const response = await fetch(`/api/users/${user}/track`);
    const json = await response.json();
    return json;
};

export default {
    isCrucibleTrackerEnabledForAccount,
    setCrucibleTrackerEnabledForAccount
};
