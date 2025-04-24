import React from "react";

function Landingpage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 text-gray-800 flex flex-col">
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">
          OPASCOR Ticketing System
        </h1>
        <span className="text-sm text-gray-600">
          by Joshua Gocotano | CTU Main - BSIT IV-1
        </span>
      </header>

      <main className="flex-grow flex items-center justify-center text-center px-6">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-extrabold mb-4">
            Simplifying Ticket Management
          </h2>
          <p className="text-lg mb-6">
            Seamlessly track, manage, and resolve tickets for OPASCOR
            operations. Designed with efficiency and simplicity in mind.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-lg transition">
              Get Started
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-blue-700 px-6 py-3 rounded-2xl border border-blue-300">
              Learn More
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-white py-4 text-center text-sm text-gray-500 border-t">
        © 2025 OPASCOR | Developed by Joshua Gocotano - BSIT IV-1, CTU Main
      </footer>
    </div>
  );
}

export default Landingpage;
