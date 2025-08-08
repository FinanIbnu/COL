"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Html, Environment } from "@react-three/drei"
import { TextureLoader } from "three"
import * as THREE from "three"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { historicalFiguresDB } from "../data/historical-figures"

interface CountryMarker {
  name: string
  position: [number, number, number]
  figures: any[]
}

const countryMarkers: CountryMarker[] = [
  {
    name: "France",
    position: [0.02, 0.46, 0.89],
    figures: historicalFiguresDB.filter(f => f.country === "France")
  },
  {
    name: "Egypt",
    position: [0.31, 0.30, 0.90],
    figures: historicalFiguresDB.filter(f => f.country === "Egypt")
  },
  {
    name: "India",
    position: [0.77, 0.20, 0.61],
    figures: historicalFiguresDB.filter(f => f.country === "India")
  },
  {
    name: "Germany",
    position: [0.10, 0.52, 0.85],
    figures: historicalFiguresDB.filter(f => f.country === "Germany")
  },
  {
    name: "United Kingdom",
    position: [-0.04, 0.53, 0.85],
    figures: historicalFiguresDB.filter(f => f.country === "United Kingdom")
  },
  {
    name: "United States",
    position: [-0.75, 0.40, 0.53],
    figures: historicalFiguresDB.filter(f => f.country === "United States")
  },
  {
    name: "Serbia",
    position: [0.20, 0.44, 0.87],
    figures: historicalFiguresDB.filter(f => f.country === "Serbia")
  },
  {
    name: "Italy",
    position: [0.12, 0.42, 0.90],
    figures: historicalFiguresDB.filter(f => f.country === "Italy")
  }
]

function Earth({ onMarkerClick }: { onMarkerClick: (marker: CountryMarker) => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const earthTexture = useLoader(TextureLoader, "/assets/3d/texture_earth.jpg")

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
    }
  })

  return (
    <group>
      {/* Earth Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial map={earthTexture} />
      </mesh>

      {/* Country Markers */}
      {countryMarkers.map((marker, index) => (
        <group key={marker.name}>
          <mesh
            position={[
              marker.position[0] * 2.1,
              marker.position[1] * 2.1,
              marker.position[2] * 2.1
            ]}
            onClick={() => onMarkerClick(marker)}
          >
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.3} />
          </mesh>
          
          <Html
            position={[
              marker.position[0] * 2.3,
              marker.position[1] * 2.3,
              marker.position[2] * 2.3
            ]}
            center
          >
            <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none">
              {marker.name} ({marker.figures.length})
            </div>
          </Html>
        </group>
      ))}
    </group>
  )
}

interface Globe3DProps {
  onCountrySelect: (country: string, figures: any[]) => void
  onFigureSelect: (figure: any) => void
}

export function Globe3D({ onCountrySelect, onFigureSelect }: Globe3DProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryMarker | null>(null)

  const handleMarkerClick = (marker: CountryMarker) => {
    setSelectedCountry(marker)
    onCountrySelect(marker.name, marker.figures)
  }

  return (
    <div className="space-y-6">
      {/* 3D Globe */}
      <div className="h-96 bg-slate-800/50 rounded-lg overflow-hidden">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Earth onMarkerClick={handleMarkerClick} />
          <OrbitControls enableZoom={true} enablePan={false} />
          <Environment preset="night" />
        </Canvas>
      </div>

      {/* Country Selection Panel */}
      {selectedCountry && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Historical Figures from {selectedCountry.name}
              <Badge variant="secondary">{selectedCountry.figures.length} figures</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedCountry.figures.map((figure) => (
                <Card key={figure.id} className="bg-slate-700/50 border-slate-600 hover:bg-slate-600/50 transition-colors cursor-pointer">
                  <CardContent className="p-4" onClick={() => onFigureSelect(figure)}>
                    <div className="text-center space-y-2">
                      <img
                        src={figure.avatar || "/placeholder.svg?height=80&width=80&text=" + figure.name.split(' ')[0]}
                        alt={figure.name}
                        className="w-16 h-16 rounded-full mx-auto border-2 border-blue-400"
                      />
                      <h3 className="font-semibold text-white text-sm">{figure.name}</h3>
                      <p className="text-xs text-gray-400">{figure.title}</p>
                      <Badge variant="outline" className="text-xs">
                        {figure.era}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => setSelectedCountry(null)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
