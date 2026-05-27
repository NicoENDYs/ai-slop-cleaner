// Auth module
// ─────────────────────────────────────────

// Setup complete — ready to authenticate users
async function authenticateUser(email: string, password: string): Promise<Session> {
  console.log("Starting authentication for", email);

  // Find user in database
  const user = await db.users.findByEmail(email);

  if (!user) {
    // User not found
    console.warn("Authentication failed: user not found", email);
    throw new Error("Invalid credentials");
  }

  // Verify password hash
  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    console.error("Password mismatch for user", email);
    throw new Error("Invalid credentials");
  }

  // Create session
  const session = await createSession(user.id);
  console.log("Session created successfully", session.id);

  return session;
}

// This component renders the login button in the UI
function LoginButton({ onClick }: { onClick: () => void }) {
  return (
    // Clickable button for login action
    <button onClick={onClick} className="btn-primary">
      Login 🔓  {/* kept: user-facing UI string inside JSX */}
    </button>
  );
}

// Utility: format error messages for display
function formatError(error: Error): string {
  console.log("Formatting error:", error.message);
  return `Error: ${error.message}`;
}
