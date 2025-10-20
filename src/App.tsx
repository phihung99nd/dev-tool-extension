import { BinaryIcon, BookOpenTextIcon, Clock8Icon, FileJson2Icon, FingerprintIcon, FullscreenIcon, HashIcon, RegexIcon, TypeIcon } from "lucide-react"
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import Json from "./pages/json"
import TextCompare from "./pages/text-compare"
import { useEffect, useState } from "react"
import LoremIpsum from "./pages/lorem-ipsum"
import NumberBase from "./pages/number-base"
import Hash from "./pages/hash"
import Timestamp from "./pages/timestamp"
import Jwt from "./pages/jwt"
import Regex from "./pages/regex"
import { CircularMenu } from "./components/circular-menu"

interface MenuItem {
  id: number
  title: string
  desc: string
  icon: React.ReactNode
  route: string
}

function App() {
  const featureNavigator: MenuItem[] = [
    {
      id: 1,
      title: 'JSON Formatter',
      desc: 'Easily view and format JSON data for better readability.',
      icon: <FileJson2Icon className="group-hover:text-primary transition-colors" />,
      route: '/json'
    },
    {
      id: 2,
      title: 'Text Compare',
      desc: 'Compare two text documents and highlight differences with line-by-line comparison.',
      icon: <BookOpenTextIcon className="group-hover:text-primary transition-colors" />,
      route: '/text-compare'
    },
    {
      id: 3,
      title: 'Lorem Ipsum Generator',
      desc: 'Generate placeholder text for your designs and layouts.',
      icon: <TypeIcon className="group-hover:text-primary transition-colors" />,
      route: '/lorem'
    },
    {
      id: 4,
      title: 'Number Base Converter',
      desc: 'Convert numbers between binary, octal, decimal, hexadecimal bases.',
      icon: <BinaryIcon className="group-hover:text-primary transition-colors" />,
      route: '/number-base'
    },
    {
      id: 5,
      title: 'Hash Generator',
      desc: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes.',
      icon: <HashIcon className="group-hover:text-primary transition-colors" />,
      route: '/hash'
    },
    {
      id: 6,
      title: 'Timestamp Converter',
      desc: 'Convert between Unix timestamps and human-readable dates with timezone support and current time display.',
      icon: <Clock8Icon className="group-hover:text-primary transition-colors" />,
      route: '/timestamp'
    },
    {
      id: 7,
      title: 'JWT Decoder',
      desc: 'Decode JSON Web Tokens to inspect header, payload, and signature without verification.',
      icon: <FingerprintIcon className="group-hover:text-primary transition-colors" />,
      route: '/jwt'
    },
    {
      id: 8,
      title: 'Regex Generator',
      desc: 'Create, test, and debug regular expressions.',
      icon: <RegexIcon className="group-hover:text-primary transition-colors" />,
      route: '/regex'
    },
  ]

  const [ip, setIP] = useState('')
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

  const getIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP:', error);
    }
  }

  useEffect(() => {
    const fetchIP = async () => {
      const ip = await getIP();
      if (ip) setIP(ip);
      else setIP('')
    }
    fetchIP()

    const interval = setInterval(() => {
      fetchIP();
    }, 60 * 1000) // 1 min

    return () => {
      clearInterval(interval);
    }
  }, [])

  const openOnNewTab = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL("index.html#/")
    });
  }

  return (
    <div className="min-w-[800px] min-h-[600px] w-full h-full bg-neutral-50 p-4 pt-8 relative">
      {location.pathname == '/' && <>
        <div className="fixed bottom-[10px] right-[10px] z-1 bg-sidebar-accent h-10 w-10 flex justify-center items-center rounded-lg flex-shrink-0 group hover:bg-primary/20 transition-colors" onClick={openOnNewTab}>
          <FullscreenIcon className="group-hover:text-primary transition-colors" />
        </div>
      </>}
      <span className="absolute top-0 left-1/2 translate-x-[-50%] text-sm text-slate-600">Hold Tab for quick navigation</span>
      <span className="absolute top-0 left-4 text-sm text-slate-600">IP: <span className={ip ? 'text-green-500' : 'text-red-500'}>{ip ? ip : 'Undetectable'}</span></span>
      <CircularMenu featureNavigator={featureNavigator} className="absolute z-100" />
      <Routes>
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/" element={
          <div className="grid grid-cols-2 gap-6 w-full mb-16">
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
