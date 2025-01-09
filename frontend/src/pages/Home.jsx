import AirdropsList from '../components/airdrops-list'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#17212b] p-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Available Tasks</h1>
          <p className="text-[#8e99a8]">Complete tasks to earn points</p>
        </header>
        <AirdropsList />
      </div>
    </main>
  )
}

