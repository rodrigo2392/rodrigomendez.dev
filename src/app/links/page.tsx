import SocialMediaLinks from "../../components/Social";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="w-full max-w-md">
        <SocialMediaLinks />
      </div>
    </main>
  );
}
