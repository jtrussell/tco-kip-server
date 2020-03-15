const menus = [
    { path: '/login', title: 'Login', showOnlyWhenLoggedOut: true, position: 'right' },
    { path: '/register', title: 'Register', showOnlyWhenLoggedOut: true, position: 'right' },
    { path: '/play', title: 'Play', position: 'left' },
    { path: '/decks', title: 'Decks', showOnlyWhenLoggedIn: true, position: 'left' },
    { path: '/leaderboard', title: 'Leaderboard', position: 'left' },
    {
        title: 'Placeholder',
        childItems: [
            { title: 'Profile', path: '/profile' },
            { title: 'Logout', path: '/logout' }
        ],
        showOnlyWhenLoggedIn: true,
        position: 'right',
        showProfilePicture: true
    },
    {
        title: 'Admin',
        showOnlyWhenLoggedIn: true,
        childItems: [
            { path: '/news', title: 'News', permission: 'canEditNews' },
            { path: '/users', title: 'Users', permission: 'canManageUsers' },
            { path: '/nodes', title: 'Nodes', permission: 'canManageNodes' },
            { path: '/banlist', title: 'Ban List', permission: 'canManageBanlist' },
            { path: '/admin/motd', title: 'Motd', permission: 'canManageMotd' }
        ], position: 'left'
    }
];

export default menus;
