import Container from "@/components/Container";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start py-14">
      <header>
        <h1 className="text-2xl text-center mb-4">Email Reminder App</h1>
      </header>
      <Container />
    </main>
  )
}
