export const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import("../pages/Home.vue")
    },
    {
        path: '/local',
        name: 'Local',
        component: () => import("../pages/Local.vue")
    },
    {
        path: '/res',
        name: 'Resources',
        component: () => import("../pages/Resources.vue")
    },
    {
        path: '/online',
        name: 'Online',
        component: () => import("../pages/Online.vue")
    },
    {
        path: '/config',
        name: 'Config',
        component: () => import("../pages/Config.vue")
    },
    {
        path: '/trans',
        name: 'Transcribe',
        component: () => import("../pages/Transcribe.vue")
    },
    {
        path: '/review',
        name: 'Review',
        component: () => import("../pages/Review.vue")
    }
]