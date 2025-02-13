import Link from 'next/link'
import { Star } from 'lucide-react'

const recommendedGames = [
  { id: 1, title: 'The Witcher 3: Wild Hunt', genre: 'Action RPG', rating: 9.8, image: '/placeholder.svg?height=200&width=300' },
  { id: 2, title: 'Red Dead Redemption 2', genre: 'Action-Adventure', rating: 9.7, image: '/placeholder.svg?height=200&width=300' },
  { id: 3, title: 'Disco Elysium', genre: 'RPG', rating: 9.6, image: '/placeholder.svg?height=200&width=300' },
  { id: 4, title: 'Hollow Knight', genre: 'Metroidvania', rating: 9.4, image: '/placeholder.svg?height=200&width=300' },
  { id: 5, title: 'Hades', genre: 'Roguelike', rating: 9.3, image: '/placeholder.svg?height=200&width=300' },
  { id: 6, title: 'Stardew Valley', genre: 'Simulation', rating: 9.2, image: '/placeholder.svg?height=200&width=300' },
]

export default function Recommendations() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <Star className="mr-2 text-yellow-400" /> Recommended for You
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedGames.map((game) => (
          <Link href={` /
  game /
  $
{
  game.id
}
`} key={game.id} className="block">
            <div className="bg-gray-900 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img src={game.image || "/placeholder.svg"} alt={game.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
                <p className="text-gray-400 mb-2">{game.genre}</p>
                <p className="text-yellow-400 flex items-center">
                  <Star className="mr-1 h-4 w-4" /> {game.rating}/10
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

