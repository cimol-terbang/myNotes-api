export function adminMiddleware(
  req,
  res,
  next
) {
  const session =
    req.cookies.admin_session

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