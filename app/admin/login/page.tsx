import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-paper">
      <div className="w-full max-w-sm">
        <div className="font-mono text-xs text-paper/60">Admin</div>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
          Sign in.
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
