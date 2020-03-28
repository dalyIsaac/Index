import type { Application } from "express"
import { getHomeDirectory, getDirectories } from './controller'

const directoryPickerRoutes = (app: Application) => {
    app.route("/api/homedirectory").get(getHomeDirectory)
    app.route("/api/directories").get(getDirectories)
}

export default directoryPickerRoutes
