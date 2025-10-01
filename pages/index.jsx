import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Idea Board - Share Your Ideas</title>
        <meta name="description" content="A collaborative platform to share and vote on ideas" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">💡 Idea Board</h1>
              </div>
              <Link
                href="/app"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Share Your
              <span className="text-indigo-600 block">Brilliant Ideas</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A collaborative platform where creativity meets community. Share your ideas, 
              discover inspiration, and vote on the concepts that matter most.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/app"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
              >
                Start Sharing Ideas
              </Link>
              
              <div className="text-sm text-gray-500">
                No registration required • Anonymous & secure
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick & Easy</h3>
              <p className="text-gray-600">
                Share your ideas in seconds. No lengthy forms or complex processes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl mb-4">🔥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Voting</h3>
              <p className="text-gray-600">
                See ideas and votes update instantly as the community engages.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Anonymous & Safe</h3>
              <p className="text-gray-600">
                Share freely without revealing your identity. Focus on the ideas.
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500">
              <p>&copy; 2024 Idea Board. Built with Next.js & Firebase by Aqeed</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
