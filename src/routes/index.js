import postRoutes from "./postRoutes.js"

import commentRoutes
from "./commentRoutes.js"

import adminRoutes
from "./adminRoutes.js"

export function setupRoutes(app) {
  app.use("/posts", postRoutes)

  app.use("/comments", commentRoutes)

  app.use("/admin", adminRoutes)
}