export default function Header() {
  return (
    <header className="bg-white rounded-2xl p-8 mb-8 shadow-2xl text-center bg-gradient-to-br from-white to-gray-50">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-2">
        🇺🇸 Know Your Leader
      </h1>
      <p className="text-2xl md:text-3xl text-blue-900 font-semibold mb-1">
        Presidential Campaign Finance Tracker
      </p>
      <p className="text-lg md:text-xl text-gray-600 italic">
        Follow the money. Know your candidates.
      </p>
    </header>
  );
}