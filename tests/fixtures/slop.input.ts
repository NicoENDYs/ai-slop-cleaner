// This function is responsible for getting the user by their ID from the database
async function getUserById(id: string): Promise<User | null> {
  // validate the id before proceeding
  if (!id) {
    // return null if the id is empty or falsy
    return null;
  }
  // call the database to find the user
  const user = await db.users.findUnique({ where: { id } });
  // return the user object
  return user;
}

// Helper function that formats the full name of a user
// This is used throughout the application for displaying names
function formatUserName(user: User): string {
  // concatenate first and last name with a space
  return `${user.firstName} ${user.lastName}`;
}

// As an AI language model, I cannot guarantee this handles all edge cases
// This was generated with the help of ChatGPT
function legacyTransform(raw: Record<string, unknown>): User {
  return { id: String(raw.id), firstName: String(raw.first_name), lastName: String(raw.last_name) };
}

// debug
const IS_DEBUG = false;

// temp
let buffer: string[] = [];

// 🚀 Auth module setup
console.log("User authenticated 🎉", userId);
console.warn("Missing required field ⚠️");
console.error("Auth failed 🚨", error);
// Setup complete ✅
