import { Undo2Icon } from "lucide-react"
import { useNavigate } from "react-router-dom"

function PageBackButton() {
  const navigate = useNavigate()

  return (
    <div className="bg-sidebar-accent h-full w-full flex justify-center items-center rounded-lg flex-shrink-0 group hover:bg-primary/20 transition-colors cursor-pointer" onClick={() => navigate('/')}>
      <Undo2Icon className="group-hover:text-primary transition-colors" />
    </div>
  )
}

export default PageBackButton