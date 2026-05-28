async function getUserById(id: string): Promise<User | null> {
  if (!id) {
    return null;
  }
  const user = await db.users.findUnique({ where: { id } });
  return user;
}

function formatUserName(user: User): string {
  // concatenate first and last name with a space
  return `${user.firstName} ${user.lastName}`;
}

function legacyTransform(raw: Record<string, unknown>): User {
  return { id: String(raw.id), firstName: String(raw.first_name), lastName: String(raw.last_name) };
}

const IS_DEBUG = false;

let buffer: string[] = [];

// Auth module setup
console.log("User authenticated", userId);
console.warn("Missing required field");
console.error("Auth failed", error);
// Setup complete
