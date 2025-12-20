export function HeroSection() {
  return (
    <section className="bg-gray-50 py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
          Build Your{' '}
          <span className="text-blue-600">Pro</span>{' '}
          Web App
        </h1>
        <p className="mt-4 text-xl text-gray-600 md:text-2xl">
          Your journey to becoming a Full-stack Developer starts now.
        </p>
        <div className="mt-10 flex justify-center space-x-4">
          <button className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white shadow-lg transition duration-150 hover:bg-blue-700">
            Get Started
          </button>
          <button className="rounded-lg border border-gray-300 bg-white px-8 py-3 text-lg font-medium text-gray-700 shadow-md transition duration-150 hover:bg-gray-100">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}