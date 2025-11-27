import GovernanceFlow from "./components/GovernanceFlow";

export default function Home() {
  return (
    <div className="w-full h-screen p-4 flex flex-col gap-4 bg-white">
      <header className="flex-none pb-4 border-b">
        <h1 className="text-2xl font-bold text-slate-900">Jasper IQ Verification Flow</h1>
      </header>
      <main className="flex-1 min-h-0 w-full border rounded-lg overflow-hidden">
        <GovernanceFlow />
      </main>
    </div>
  );
}
