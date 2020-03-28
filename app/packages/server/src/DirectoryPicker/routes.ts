import type { Application } from "express"
import { getHomeDirectory } from './controller'

const directoryPickerRoutes = (app: Application) => {
    app.route("/api/homedirectory").get(getHomeDirectory)
}

export default directoryPickerRoutes