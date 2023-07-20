import {createRouter, createWebHistory} from "vue-router";

import {routes} from "./routes.js";

const options = {
    history: createWebHistory(),
    routes
}

const MyRouter = createRouter(options)

export default MyRouter