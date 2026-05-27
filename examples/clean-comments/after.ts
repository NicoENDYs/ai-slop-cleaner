async function getUserById(id: string): Promise<User | null> {
  if (!id) {
    return null;
  }

  const user = await db.users.findUnique({
    where: { id },
  });

  return user;
}

function formatUserName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}

function increment(counter: number): number {
  counter++;
  return counter;
}

// TODO: add pagination support when the user list grows large
// FIXME: the search is case-sensitive, needs to be fixed before v2
function searchUsers(query: string): User[] {
  console.log("debug: searching for", query);
  return users.filter(u => u.name.includes(query));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function legacyAdapter(data: any): User {
  return { id: data.id, firstName: data.first_name, lastName: data.last_name };
}
