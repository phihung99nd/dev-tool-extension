import { BinaryIcon, BookOpenTextIcon, Clock8Icon, FileJson2Icon, FingerprintIcon, FullscreenIcon, HashIcon, RegexIcon, TypeIcon } from "lucide-react"
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import Json from "./pages/json"
import TextCompare from "./pages/text-compare"
import { useEffect } from "react"
import LoremIpsum from "./pages/lorem-ipsum"
import NumberBase from "./pages/number-base"
import Hash from "./pages/hash"
import Timestamp from "./pages/timestamp"
import Jwt from "./pages/jwt"
import Regex from "./pages/regex"

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
      title: 'Lorem Ipsum Generator',
      desc: 'Generate placeholder text for your designs and layouts.',
      icon: <TypeIcon className="group-hover:text-primary transition-colors" />,
      route: '/lorem'
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
  const location = useLocation()

  useEffect(() => {
    // Save to storage whenever route changes
    chrome.storage.local.get("devtool", (res) => {
      const prev = res.devtool || {};
      chrome.storage.local.set({
        devtool: {
          ...prev,
          lastRoute: location.pathname + location.search + location.hash,
        },
      });
    });
  }, [location]);

  useEffect(() => {
    chrome.storage.local.get("devtool", (res) => {
      const lastRoute = res.devtool?.lastRoute;
      if (lastRoute) {
        navigate(lastRoute, { replace: true });
      }
    });
  }, []);

  const openOnNewTab = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL("index.html#/")
    });
  }

  return (
    <div className="min-w-[800px] min-h-[600px] w-full h-full bg-neutral-50 p-4 relative">
      {location.pathname == '/' && <>
        <div className="fixed bottom-[10px] right-[10px] z-1 bg-sidebar-accent h-10 w-10 flex justify-center items-center rounded-lg flex-shrink-0 group hover:bg-primary/20 transition-colors" onClick={openOnNewTab}>
          <FullscreenIcon className="group-hover:text-primary transition-colors" />
        </div>
      </>}
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
        <Route path="/text-compare" element={<TextCompare />} />
        <Route path="/lorem" element={<LoremIpsum />} />
        <Route path="/number-base" element={<NumberBase />} />
        <Route path="/hash" element={<Hash />} />
        <Route path="/timestamp" element={<Timestamp />} />
        <Route path="/jwt" element={<Jwt />} />
        <Route path="/regex" element={<Regex />} />
      </Routes>
    </div>
  )
}

export default App
