export function adminMiddleware(
  req,
  res,
  next
) {
  // Support both cookie-based session and header-based auth
  // Header auth is used for cross-origin requests where cookies can't be set
  const session =
    req.cookies.admin_session ||
    req.headers["x-admin-password"]

  if (
    session !==
    process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      error: "unauthorized",
    })
  }

  next()
}