import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">Crypto Trader SaaS</h1>
        
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold mb-4">Geautomatiseerd handelen in cryptocurrencies</h2>
          <p className="mb-4">
            Welkom bij Crypto Trader SaaS, de cloud-gebaseerde oplossing voor het automatisch 
            handelen in cryptocurrencies op basis van marktanalyse, technische indicatoren, 
            en AI-gestuurde besluitvorming.
          </p>
          <div className="flex justify-center mt-6">
            <Link href="/login" className="btn-primary mr-4">
              Inloggen met Google
            </Link>
            <Link href="/about" className="btn-secondary">
              Meer informatie
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">AI-gestuurde analyse</h3>
            <p>Geavanceerde marktanalyse met behulp van Gemini Flash 2.0 AI voor optimale handelsbeslissingen.</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Transparante besluitvorming</h3>
            <p>Volledige inzicht in waarom bepaalde handelsbeslissingen worden genomen.</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Veilig en betrouwbaar</h3>
            <p>Versleutelde opslag van API-sleutels en veilige authenticatie via Google.</p>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Probeer het 7 dagen gratis</h2>
          <p className="mb-4">
            Meld u aan voor een gratis proefperiode van 7 dagen en ontdek de kracht van 
            geautomatiseerd handelen in cryptocurrencies.
          </p>
          <div className="flex justify-center mt-4">
            <Link href="/signup" className="btn-primary">
              Start uw gratis proefperiode
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
