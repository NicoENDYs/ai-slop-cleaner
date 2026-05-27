// This function is responsible for fetching a user by their ID from the database
// It takes a string ID parameter and returns a Promise with the user object
async function getUserById(id: string): Promise<User | null> {
  // validate the id first
  if (!id) {
    // return null if id is empty
    return null;
  }

  // call the database to find the user
  const user = await db.users.findUnique({
    // pass the where clause with the id
    where: { id },
  });

  // return the user
  return user;
}

// Helper function that formats the user's full name
// This is used throughout the application to display user names consistently
function formatUserName(user: User): string {
  // concatenate first and last name
  return `${user.firstName} ${user.lastName}`;
}

// increment the counter by 1
function increment(counter: number): number {
  // add one to counter
  counter++;
  // return the result
  return counter;
}

// TODO: add pagination support when the user list grows large
// FIXME: the search is case-sensitive, needs to be fixed before v2
function searchUsers(query: string): User[] {
  // filter users by name
  // temporary test
  console.log("debug: searching for", query);
  return users.filter(u => u.name.includes(query));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function legacyAdapter(data: any): User {
  // As an AI language model, I cannot guarantee this works for all edge cases
  // This was generated with the help of ChatGPT
  return { id: data.id, firstName: data.first_name, lastName: data.last_name };
}
