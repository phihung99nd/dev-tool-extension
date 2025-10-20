import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useLocation, useNavigate } from "react-router-dom"

interface MenuItem {
  id: number
  title: string
  desc: string
  icon: React.ReactNode
  route: string
}

const renderIconWithColor = (icon: React.ReactNode, isHovered: boolean, isSelected: boolean) => {
  if (isHovered) {
    return <div className="text-slate-200">{icon}</div>
  }
  if (isSelected) {
    return <div className="text-slate-50">{icon}</div>
  }
  return <div className="text-foreground">{icon}</div>
}

export function CircularMenu({ className, featureNavigator }: React.ComponentProps<"div"> & { featureNavigator: MenuItem[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const tabPressedRef = useRef(false)
  const svgRef = useRef<SVGSVGElement>(null)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    chrome.storage.local.get("devtool", (res) => {
      const lastRoute = res.devtool?.lastRoute;
      if (lastRoute) {
        const foundRoute = featureNavigator.find((m) => m.route == lastRoute)
        if (foundRoute) setSelectedId(foundRoute.id)
      }
    });
  }, []);

  useEffect(() => {
    const lastRoute = location.pathname;
    console.log('lastRoute', lastRoute)
    if (lastRoute) {
      const foundRoute = featureNavigator.find((m) => m.route == lastRoute)
      if (!foundRoute) setSelectedId(null)
    }
  }, [location]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault()
        tabPressedRef.current = true
        setIsOpen(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      console.log(e)
      e.preventDefault()
      if (e.key === "Tab") {
        tabPressedRef.current = false
        setIsOpen(false)
        setHoveredId(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  if (!featureNavigator) return <></>

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleItemClick = (id: number | null) => {
    setSelectedId(id)
    setIsOpen(false)
    const item = featureNavigator.find((m) => m.id === id)
    if (item) {
      navigate(item.route)
    } else {
      navigate("/")
    }
  }

  const innerRadius = 40
  const outerRadius = 180
  const angleSlice = (Math.PI * 2) / featureNavigator.length

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bg-[#ffffffaa] inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.svg
              ref={svgRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              width="400"
              height="400"
              viewBox="-200 -200 400 400"
              style={{ cursor: "pointer" }}
              onMouseMove={handleMouseMove}
            >
              {/* Render all pizza slices in one SVG */}
              {featureNavigator.map((item, index) => {
                const angle = angleSlice * index - Math.PI / 2
                const startAngle = angle - angleSlice / 2
                const endAngle = angle + angleSlice / 2

                const x1 = Math.cos(startAngle) * innerRadius
                const y1 = Math.sin(startAngle) * innerRadius
                const x2 = Math.cos(endAngle) * innerRadius
                const y2 = Math.sin(endAngle) * innerRadius
                const x3 = Math.cos(endAngle) * outerRadius
                const y3 = Math.sin(endAngle) * outerRadius
                const x4 = Math.cos(startAngle) * outerRadius
                const y4 = Math.sin(startAngle) * outerRadius

                const largeArc = angleSlice > Math.PI ? 1 : 0
                const slicePath = `M ${x1} ${y1} L ${x4} ${y4} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3} L ${x2} ${y2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}`

                const iconAngle = angle
                const iconRadius = (innerRadius + outerRadius) / 2
                const iconX = Math.cos(iconAngle) * iconRadius
                const iconY = Math.sin(iconAngle) * iconRadius

                const isHovered = hoveredId === item.id
                const isSelected = selectedId === item.id

                return (
                  <motion.g
                    key={item.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                  >
                    {/* Pizza slice path */}
                    <path
                      d={slicePath}
                      fill={isHovered ? "#0f172b" : isSelected ? "#51a2ff" : "#f1f5f9"}
                      stroke="#e2e8f0"
                      strokeWidth="2"
                      onMouseEnter={() => setHoveredId(item.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => handleItemClick(item.id)}
                    />

                    <foreignObject x={iconX - 12} y={iconY - 12} width="24" height="24" className="pointer-events-none">
                      {renderIconWithColor(item.icon, isHovered, isSelected)}
                    </foreignObject>
                  </motion.g>
                )
              })}

              {/* Center circle */}
              <circle
                cx="0"
                cy="0"
                r="32"
                fill="#f1f5f9"
                stroke="#e2e8f0"
                strokeWidth="1"
                onClick={() => handleItemClick(null)}
              />
            </motion.svg>

            {hoveredId && (
              <motion.div
                className="fixed bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-semibold pointer-events-none whitespace-nowrap"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{
                  left: `${mousePos.x + window.innerWidth / 2 - 200 + 20}px`,
                  top: `${mousePos.y + window.innerHeight / 2 - 200 + 20}px`,
                }}
              >
                {featureNavigator.find((m) => m.id === hoveredId)?.title}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}