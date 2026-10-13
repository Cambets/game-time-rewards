import React from 'react'
import {
  Bed,
  ShowerHead,
  Sparkles,
  Moon,
  Boxes,
  Utensils,
  Dog,
  Home,
  BookOpen,
  Backpack,
  Trophy,
  AlertTriangle,
  ClockAlert,
  Flame,
  Skull,
  Zap,
  Gamepad2,
  Check,
  Plus,
  Minus,
  Settings,
  User,
  History,
  Timer,
  Info,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Database,
  LucideProps
} from 'lucide-react'

interface DynamicIconProps extends LucideProps {
  name: string
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Bed': return <Bed {...props} />
    case 'ShowerHead': return <ShowerHead {...props} />
    case 'Sparkles': return <Sparkles {...props} />
    case 'Moon': return <Moon {...props} />
    case 'Boxes': return <Boxes {...props} />
    case 'Utensils': return <Utensils {...props} />
    case 'Dog': return <Dog {...props} />
    case 'Home': return <Home {...props} />
    case 'BookOpen': return <BookOpen {...props} />
    case 'Backpack': return <Backpack {...props} />
    case 'Trophy': return <Trophy {...props} />
    case 'AlertTriangle': return <AlertTriangle {...props} />
    case 'ClockAlert': return <ClockAlert {...props} />
    case 'Flame': return <Flame {...props} />
    case 'Skull': return <Skull {...props} />
    case 'Zap': return <Zap {...props} />
    case 'Gamepad2': return <Gamepad2 {...props} />
    case 'Check': return <Check {...props} />
    case 'Plus': return <Plus {...props} />
    case 'Minus': return <Minus {...props} />
    case 'Settings': return <Settings {...props} />
    case 'User': return <User {...props} />
    case 'History': return <History {...props} />
    case 'Timer': return <Timer {...props} />
    case 'Info': return <Info {...props} />
    case 'Play': return <Play {...props} />
    case 'Pause': return <Pause {...props} />
    case 'RotateCcw': return <RotateCcw {...props} />
    case 'Volume2': return <Volume2 {...props} />
    case 'VolumeX': return <VolumeX {...props} />
    case 'Database': return <Database {...props} />
    default: return <Gamepad2 {...props} />
  }
}
