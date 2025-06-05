export function requireRole(user: { role: string } | null, roles: string[]) {
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden");
  }
}
