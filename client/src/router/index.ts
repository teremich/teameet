import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: "/",
        children: [
            {
                path: "",
                component: () => import("../pages/Homepage.vue"),
            },
            {
                path: "login",
                component: () => import("../pages/auth/Login.vue"),
            },
            {
                path: "register",
                component: () => import("../pages/auth/Register.vue"),
            },
            {
                path: "profile",
                component: () => import("../pages/profile/Profile.vue"),
            },
            {
                path: "project",
                children: [
                    {
                        path: "",
                        component: () => import("../pages/project/Project.vue"),
                    },
                    {
                        path: "new",
                        component: () => import("../pages/project/New.vue"),
                    },
                ]
            },
        ],
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
