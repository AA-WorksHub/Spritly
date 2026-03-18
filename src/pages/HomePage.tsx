import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Palette } from 'lucide-react'

const SPRITE_EXAMPLES =[
  {
    id: 1,
    name: "Pikachu",
    src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif", 
    color: "from-yellow-400 to-orange-500"
  },
  {
    id: 2,
    name: "Megamorph",
    src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/94.gif",
    color: "from-purple-400 to-pink-500"
  },
  {
    id: 3,
    name: "Slime",
    src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/132.gif",
    color: "from-green-400 to-emerald-500"
  }
]

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20 bg-blue-600 blur-[120px] rounded-full pointer-events-none"></div>
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 max-w-5xl mx-auto w-full py-20">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium mb-4">
            <Sparkles size={16} />
            <span>Le nouvel outil de Pixel Art</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Bienvenue sur <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Spritly</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Créez, animez et exportez vos propres spritesheets 2D directement depuis votre navigateur. Conçu pour les développeurs de jeux et les artistes.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              to="/editor"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-bold transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              <Palette size={20} />
              Ouvrir l'Éditeur
            </Link>
            <a
              href="#examples"
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-8 py-3 rounded-lg font-bold transition-all border border-slate-700"
            >
              Voir des exemples
            </a>
          </div>
        </div>
        <div id="examples" className="w-full mt-12">
          <h2 className="text-2xl font-bold text-center mb-10 text-slate-300 flex items-center justify-center gap-2">
            Créé avec Spritly <ArrowRight className="text-slate-500" size={20} />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SPRITE_EXAMPLES.map((sprite) => (
              <div
                key={sprite.id}
                className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-slate-500 transition-colors"
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-b ${sprite.color} rounded-2xl transition-opacity duration-500`}></div>
                <div className="w-32 h-32 bg-slate-900 rounded-xl border border-slate-700 mb-6 flex items-center justify-center shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%,transparent_75%,#1e293b_75%,#1e293b),linear-gradient(45deg,#1e293b_25%,transparent_25%,transparent_75%,#1e293b_75%,#1e293b)] bg-[length:10px_10px] bg-[position:0_0,5px_5px] opacity-50"></div>
                  <img
                    src={sprite.src}
                    alt={sprite.name}
                    className="w-20 h-20 object-contain relative z-10 transition-transform group-hover:scale-110 duration-300"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                <h3 className="font-bold text-slate-200">{sprite.name}</h3>
                <p className="text-sm text-slate-500 mt-1">Animé en 12 FPS</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}

export default HomePage