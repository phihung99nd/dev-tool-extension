import { BinaryIcon, BookOpenTextIcon, Clock8Icon, FileDigitIcon, FileJson2Icon, FingerprintIcon, HashIcon, RegexIcon } from "lucide-react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import Json from "./pages/json"

function App() {
  const featureNavigator = [
    {
      title: 'JSON Formatter',
      desc: 'Easily view and format JSON data for better readability.',
      icon: <FileJson2Icon className="group-hover:text-primary transition-colors" />,
      route: '/json'
    },
    {
      title: 'Text Compare',
      desc: 'Compare two text documents and highlight differences with line-by-line comparison.',
      icon: <BookOpenTextIcon className="group-hover:text-primary transition-colors" />,
      route: '/text-compare'
    },
    {
      title: 'Base64 Converter',
      desc: 'Safely encode and decode text, files, and images to/from Base64 format with automatic format detection.',
      icon: <FileDigitIcon className="group-hover:text-primary transition-colors" />,
      route: '/base64'
    },
    {
      title: 'Number Base Converter',
      desc: 'Convert numbers between binary, octal, decimal, hexadecimal bases.',
      icon: <BinaryIcon className="group-hover:text-primary transition-colors" />,
      route: '/number-base'
    },
    {
      title: 'Hash Generator',
      desc: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes.',
      icon: <HashIcon className="group-hover:text-primary transition-colors" />,
      route: '/hash'
    },
    {
      title: 'Timestamp Converter',
      desc: 'Convert between Unix timestamps and human-readable dates with timezone support and current time display.',
      icon: <Clock8Icon className="group-hover:text-primary transition-colors" />,
      route: '/timestamp'
    },
    {
      title: 'JWT Decoder',
      desc: 'Decode JSON Web Tokens to inspect header, payload, and signature without verification.',
      icon: <FingerprintIcon className="group-hover:text-primary transition-colors" />,
      route: '/jwt'
    },
    {
      title: 'Regex Generator',
      desc: 'Create, test, and debug regular expressions.',
      icon: <RegexIcon className="group-hover:text-primary transition-colors" />,
      route: '/regex'
    },
  ]

  const navigate = useNavigate()

  return (
    <div className="w-[800px] h-[600px] bg-neutral-50 p-4">
      <Routes>
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/" element={
          <div className="grid grid-cols-2 gap-6 w-full px-4 mb-16">
            {featureNavigator.map(feature => {
              return (
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex items-center p-3 h-24 w-full cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/30 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 group" onClick={() => navigate(feature.route)}>
                  <div className="bg-sidebar-accent h-10 w-10 flex justify-center items-center rounded-lg flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    {feature.icon}
                  </div>
                  <div className="flex flex-col space-y-1.5 p-6 pl-3 py-0 flex-1 min-w-0">
                    <div className="tracking-tight text-sm font-semibold flex gap-1 items-center group-hover:text-primary transition-colors truncate">{feature.title}</div>
                    <div className="text-xs leading-tight line-clamp-2 text-muted-foreground">{feature.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        } />
        <Route path="/json" element={<Json />} />
        <Route path="/text-compare" element={<div>text-compare</div>} />
        <Route path="/base64" element={<div>base64</div>} />
        <Route path="/number-base" element={<div>number-base</div>} />
        <Route path="/hash" element={<div>hash</div>} />
        <Route path="/timestamp" element={<div>timestamp</div>} />
        <Route path="/jwt" element={<div>jwt</div>} />
        <Route path="/regex" element={<div>regex</div>} />
      </Routes>
    </div>
  )
}

export default App
