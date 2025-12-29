/**
 * Middleware to ensure the user is an authenticated AdminJS administrator.
 * Checks the session for adminUser object established by AdminJS.
 */
export const requireAdmin = (req, res, next) => {
    if (req.session && req.session.adminUser) {
        return next();
    }

    console.warn(`🔐 Unauthorized access attempt to admin preview from IP: ${req.ip}`);
    return res.status(403).send(`
    <html>
      <head><title>Access Denied</title></head>
      <body style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
        <h1>403 Forbidden</h1>
        <p>You must be logged in as an administrator to view this page.</p>
        <a href="/admin/login" style="color: #F5C518; font-weight: bold;">Login to Admin Panel</a>
      </body>
    </html>
  `);
};
