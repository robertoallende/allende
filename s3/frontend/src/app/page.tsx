export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="mb-8 text-center text-4xl font-bold">Roberto Allende</h1>
        <p className="mb-8 text-center text-lg">
          Enthusiastic and tireless maker
        </p>
        <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold">About</h2>
            <p className="text-sm text-gray-600">Learn about me</p>
          </div>
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold">Blog</h2>
            <p className="text-sm text-gray-600">My thoughts</p>
          </div>
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold">Projects</h2>
            <p className="text-sm text-gray-600">What I&apos;ve built</p>
          </div>
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold">Poetry</h2>
            <p className="text-sm text-gray-600">Creative writing</p>
          </div>
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold">Contact</h2>
            <p className="text-sm text-gray-600">Get in touch</p>
          </div>
        </div>
      </div>
    </main>
  )
}
