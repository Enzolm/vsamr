export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="mt-4 text-xl text-gray-700"></p>
      <a href="/" className="mt-6 text-blue-500 hover:underline">
        Go back to Home
      </a>

      <div className="flex flex-col md:flex-row justify-center items-center space-x-4 space-y-4 md:space-y-0">
        <div>
          <svg width="240" height="120" xmlns="http://www.w3.org/2000/svg">
            <rect width="240" height="120" fill="white" stroke="#000" stroke-width="3" />
            <rect x="10" y="10" width="220" height="100" fill="none" stroke="#DC143C" stroke-width="8" />

            <text x="120" y="50" text-anchor="middle" fill="#000" font-family="Rubik, sans-serif" font-size="36" font-weight="500">
              Villeneuve
            </text>
            <text x="55" y="85" text-anchor="middle" fill="#000" font-family="Rubik, sans-serif" font-size="30" font-weight="300">
              sur
            </text>
            <text x="145" y="85" text-anchor="middle" fill="#000" font-family="Rubik, sans-serif" font-size="36" font-weight="500">
              Auvers
            </text>
          </svg>
        </div>
        <div>
          <svg width="355" height="120" xmlns="http://www.w3.org/2000/svg">
            <rect width="355" height="120" fill="white" stroke="#000" stroke-width="3" />
            <rect x="10" y="10" width="335" height="100" fill="none" stroke="#DC143C" stroke-width="8" />

            <text x="180" y="50" text-anchor="middle" fill="#000" font-family="Rubik, sans-serif" font-size="36" font-weight="500">
              MESNIL - RACOIN
            </text>
            <text x="40" y="85" text-anchor="middle" fill="#000" font-family="Rubik, sans-serif" font-size="27" font-weight="400">
              C
            </text>
            <text x="60" y="78" text-anchor="middle" fill="#000" font-family="Rubik, sans-serif" font-size="18" font-weight="200">
              ne
            </text>
            <text x="165" y="85" text-anchor="middle" fill="#000" font-family="Rubik, sans-serif" font-size="27" font-weight="400">
              Villeneuve
            </text>
            <text x="252" y="78" text-anchor="middle" fill="#000" font-family="Rubik, sans-serif" font-size="27" font-weight="200">
              s
            </text>
            <text x="260" y="85" text-anchor="middle" fill="#000" font-family="Rubik, sans-serif" font-size="27" font-weight="200">
              /
            </text>
            <text x="290" y="85" text-anchor="middle" fill="#000" font-family="Rubik, sans-serif" font-size="27" font-weight="400">
              A.
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
