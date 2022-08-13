import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        children: [
            {
                path: "",
                component: () => import("@/pages/Homepage.vue"),
            },
            {
                path: "login",
                component: () => import("@/pages/auth/Login.vue"),
            },
            {
                path: "register",
                component: () => import("@/pages/auth/Register.vue"),
            },
            {
                path: "profile",
                children: [
                    {
                        path: "",
                        component: () => import("@/pages/profile/Profile.vue"),
                    }, {
                        path: "settings",
                        component: () => import("@/pages/profile/Settings.vue")
                    }
                ]
            },
            {
                path: "project",
                children: [
                    {
                        path: "",
                        component: () => import("@/pages/project/Project.vue"),
                    },
                    {
                        path: "new",
                        component: () => import("@/pages/project/New.vue"),
                    },
                    {
                        path: "join",
                        component: () => import("@/pages/project/Join.vue"),
                    },
                    {
                        path: "settings",
                        component: () => import("@/pages/project/Settings.vue"),
                    }
                ]
            },
            {
                path: "401",
                component: () => import("@/pages/error/401.vue")
            },
            {
                path: "403",
                component: () => import("@/pages/error/403.vue")
            },
        ],
    },
    {
        path: "/:pathMatch(.*)*",
        component: () => import("@/pages/error/404.vue")
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    sensitive: true
});

export default router;
