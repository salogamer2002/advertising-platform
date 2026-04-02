export default function AssessmentIndex() {
  const sections = [
    {
      title: "Section 1 - Frontend Development",
      tasks: [
        {
          id: "1.1",
          name: "Campaign Dashboard UI",
          description: "React + Tailwind dashboard with KPI cards, charts, and data tables",
          folder: "task-1.1-2.1-2.3/frontend/",
          tech: ["React 18+", "Tailwind CSS", "Recharts", "Hooks Only"],
          points: 15,
        },
        {
          id: "1.2",
          name: "AI Creative Brief Builder",
          description: "Multi-step form with AI integration for generating creative briefs",
          folder: "task-1.2/frontend/",
          tech: ["React", "OpenAI/Anthropic API", "jsPDF", "Multi-step Form"],
          points: 10,
        },
      ],
    },
    {
      title: "Section 2 - Backend Development",
      tasks: [
        {
          id: "2.1",
          name: "Campaign Management REST API",
          description: "Full CRUD API with JWT auth, validation, and rate limiting",
          folder: "task-1.1-2.1-2.3/backend/",
          tech: ["Node.js/Express", "PostgreSQL", "JWT", "OpenAPI"],
          points: 16,
          connected: "Powers Task 1.1",
        },
        {
          id: "2.2",
          name: "AI Content Generation Microservice",
          description: "Standalone microservice for generating ad copy with SSE streaming",
          folder: "task-2.2/backend/",
          tech: ["Node.js", "OpenAI", "Docker", "SSE Streaming"],
          points: 10,
        },
        {
          id: "2.3",
          name: "Real-Time Notification System",
          description: "WebSocket-based alerts when campaign metrics cross thresholds",
          folder: "task-1.1-2.1-2.3/backend/",
          tech: ["WebSocket", "PostgreSQL", "Alert Rules Engine"],
          points: 10,
          connected: "Integrates with Task 2.1",
        },
      ],
    },
    {
      title: "Section 3 - Speed & Practical Tasks",
      tasks: [
        {
          id: "Q1",
          name: "Debug Express API",
          description: "Find and fix 4 bugs: SQL injection, validation, error leaks, rate limiting",
          folder: "task-section3/q1-debug-express/",
          tech: ["Node.js", "Express", "SQL"],
          points: 10,
          time: "20 min",
        },
        {
          id: "Q2",
          name: "useDebounce Custom Hook",
          description: "React hook that delays API calls in search input by 300ms",
          folder: "task-section3/q2-use-debounce/",
          tech: ["React Hooks"],
          points: 10,
          time: "10 min",
        },
        {
          id: "Q3",
          name: "SQL Query - Top ROAS",
          description: "Find top 5 campaigns by ROAS for each client in last 30 days",
          folder: "task-section3/q3-sql-query/",
          tech: ["PostgreSQL", "Window Functions"],
          points: 10,
          time: "15 min",
        },
        {
          id: "Q4",
          name: "React Performance Optimization",
          description: "Identify and fix unnecessary re-renders using React DevTools",
          folder: "task-section3/q4-react-optimize/",
          tech: ["React", "useMemo", "useCallback", "React.memo"],
          points: 10,
          time: "15 min",
        },
        {
          id: "Q5",
          name: "AI-Assisted CRUD Scaffold",
          description: "Use GitHub Copilot/Cursor to scaffold Express route with full CRUD",
          folder: "task-section3/q5-ai-crud/",
          tech: ["AI Coding Tools", "Express"],
          points: 10,
          time: "10 min",
        },
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-teal-400 text-sm font-medium tracking-wider uppercase mb-2">
            Advertising Agency
          </p>
          <h1 className="text-3xl font-bold text-white">
            Full Stack Developer Assessment
          </h1>
          <div className="flex gap-6 mt-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Duration: 4 Hours
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              Total Score: 100 pts
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Pass Mark: 70 pts
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold text-teal-400 mb-6 pb-2 border-b border-slate-800">
              {section.title}
            </h2>
            <div className="grid gap-4">
              {section.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono bg-teal-500/10 text-teal-400 px-2 py-1 rounded">
                          Task {task.id}
                        </span>
                        <h3 className="font-semibold text-white">{task.name}</h3>
                        {task.connected && (
                          <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-1 rounded">
                            {task.connected}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm mb-3">{task.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {task.tech.map((t) => (
                          <span
                            key={t}
                            className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-bold text-white">{task.points}</div>
                      <div className="text-xs text-slate-500">points</div>
                      {task.time && (
                        <div className="text-xs text-orange-400 mt-1">{task.time}</div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <code className="text-xs text-slate-500 font-mono">{task.folder}</code>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Folder Structure Summary</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="text-teal-400 font-medium mb-2">Connected Tasks</h3>
              <p className="text-slate-400 mb-2">
                Tasks 1.1 + 2.1 + 2.3 share a folder because the Campaign API powers the Dashboard
                and Notifications integrate with the API.
              </p>
              <code className="text-xs text-slate-500 font-mono block">
                task-1.1-2.1-2.3/
              </code>
            </div>
            <div>
              <h3 className="text-orange-400 font-medium mb-2">Standalone Tasks</h3>
              <p className="text-slate-400 mb-2">
                Tasks 1.2 and 2.2 are independent and have their own isolated folders.
              </p>
              <code className="text-xs text-slate-500 font-mono block">
                task-1.2/ and task-2.2/
              </code>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
