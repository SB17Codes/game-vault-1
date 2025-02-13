import { Clock, Search } from "lucide-react"

const searchHistory = [
  { id: 1, query: "Best RPG games 2023", timestamp: "2023-07-15 14:30" },
  { id: 2, query: "Upcoming FPS releases", timestamp: "2023-07-14 10:15" },
  { id: 3, query: "Indie game recommendations", timestamp: "2023-07-13 18:45" },
  { id: 4, query: "Strategy games for beginners", timestamp: "2023-07-12 09:00" },
  { id: 5, query: "Top-rated PlayStation exclusives", timestamp: "2023-07-11 20:30" },
]

export default function SearchHistory() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <Clock className="mr-2" /> Search History
      </h1>
      <ul className="space-y-4">
        {searchHistory.map((item) => (
          <li key={item.id} className="bg-gray-900 rounded-lg p-4 flex items-center">
            <Search className="mr-4 text-gray-400" />
            <div>
              <p className="font-semibold">{item.query}</p>
              <p className="text-sm text-gray-400">{item.timestamp}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

