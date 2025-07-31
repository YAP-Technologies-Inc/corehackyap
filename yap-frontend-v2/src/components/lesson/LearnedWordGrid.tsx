'use client';

export default function LearnedWordGrid({ words }: { words: string[] }) {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          Congratulations! You learned {words.length} words
        </h2>
        <p className="text-gray-600">
          Continue learning more Spanish vocabulary
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {words.map((word, index) => (
          <div
            key={index}
            className="bg-green-50 border border-green-200 rounded-lg p-3 text-center"
          >
            <span className="text-green-700 font-semibold">{word}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
