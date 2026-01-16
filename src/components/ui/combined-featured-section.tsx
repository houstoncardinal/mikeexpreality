'use client'

import * as React from "react"
import { Activity, ArrowRight, Home, MapPin, TrendingUp, Users, Calculator, Video, Compass, Building2, Star, Search, Filter, Zap } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card } from '@/components/ui/card'
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Database } from '@/integrations/supabase/types'
import { CoverageMap } from '@/components/map/CoverageMap'

type PropertyType = Database['public']['Enums']['property_type']

// Property type labels
const propertyTypeLabels: Record<PropertyType | 'all', string> = {
  'all': 'All Types',
  'single_family': 'Single Family',
  'condo': 'Condo',
  'townhouse': 'Townhouse',
  'multi_family': 'Multi-Family',
  'land': 'Land',
  'commercial': 'Commercial',
}

// Neighborhood coordinate mapping for the map visualization
const neighborhoodCoords: Record<string, { x: number; y: number; color: string }> = {
  'Sugar Land': { x: 30, y: 55, color: 'from-emerald-500 to-teal-500' },
  'Katy': { x: 15, y: 35, color: 'from-blue-500 to-indigo-500' },
  'Cypress': { x: 20, y: 20, color: 'from-violet-500 to-purple-500' },
  'Richmond': { x: 40, y: 60, color: 'from-amber-500 to-orange-500' },
  'Missouri City': { x: 45, y: 50, color: 'from-rose-500 to-pink-500' },
  'Pearland': { x: 55, y: 55, color: 'from-cyan-500 to-blue-500' },
  'Houston': { x: 50, y: 35, color: 'from-primary to-accent' },
  'Fulshear': { x: 10, y: 45, color: 'from-amber-400 to-yellow-500' },
  'Rosenberg': { x: 25, y: 65, color: 'from-teal-500 to-cyan-500' },
  'Stafford': { x: 40, y: 45, color: 'from-indigo-500 to-violet-500' },
}

interface NeighborhoodData {
  id: string
  name: string
  listings: number
  avgPrice: string
  avgPriceNum: number
  coords: { x: number; y: number }
  color: string
}

interface PropertyData {
  city: string
  price: number
  property_type: PropertyType
}

// Helper function to format price in short form (e.g., $485K, $1.2M)
function formatPriceShort(price: number): string {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`
  } else if (price >= 1000) {
    return `$${Math.round(price / 1000)}K`
  }
  return `$${price}`
}

export default function CombinedFeaturedSection() {
  const navigate = useNavigate()
  const [selectedNeighborhood, setSelectedNeighborhood] = React.useState<NeighborhoodData | null>(null)
  const [hoveredNeighborhood, setHoveredNeighborhood] = React.useState<string | null>(null)
  const [neighborhoods, setNeighborhoods] = React.useState<NeighborhoodData[]>([])
  const [filteredNeighborhoods, setFilteredNeighborhoods] = React.useState<NeighborhoodData[]>([])
  const [totalListings, setTotalListings] = React.useState(0)
  const [medianPrice, setMedianPrice] = React.useState('$0')
  const [isLoading, setIsLoading] = React.useState(true)
  const [isLive, setIsLive] = React.useState(false)
  
  // Filter states
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 5000000])
  const [propertyType, setPropertyType] = React.useState<PropertyType | 'all'>('all')
  const [allProperties, setAllProperties] = React.useState<PropertyData[]>([])

  // Process properties into neighborhoods
  const processProperties = React.useCallback((properties: PropertyData[]) => {
    // Apply filters
    let filtered = properties
    
    if (propertyType !== 'all') {
      filtered = filtered.filter(p => p.property_type === propertyType)
    }
    
    filtered = filtered.filter(p => {
      const price = Number(p.price) || 0
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Aggregate by city
    const cityAggregation: Record<string, { count: number; prices: number[] }> = {}
    
    filtered.forEach(prop => {
      const city = prop.city || 'Houston'
      if (!cityAggregation[city]) {
        cityAggregation[city] = { count: 0, prices: [] }
      }
      cityAggregation[city].count++
      if (prop.price) {
        cityAggregation[city].prices.push(Number(prop.price))
      }
    })

    // Create neighborhood data with real stats
    const neighborhoodData: NeighborhoodData[] = Object.entries(cityAggregation)
      .filter(([city]) => neighborhoodCoords[city])
      .map(([city, data]) => {
        const avgPrice = data.prices.length > 0 
          ? data.prices.reduce((a, b) => a + b, 0) / data.prices.length 
          : 0
        
        return {
          id: city.toLowerCase().replace(/\s+/g, '-'),
          name: city,
          listings: data.count,
          avgPrice: formatPriceShort(avgPrice),
          avgPriceNum: avgPrice,
          coords: neighborhoodCoords[city] || { x: 50, y: 50 },
          color: neighborhoodCoords[city]?.color || 'from-primary to-accent',
        }
      })
      .sort((a, b) => b.listings - a.listings)

    // Calculate totals
    const allPrices = filtered.map(p => Number(p.price)).filter(p => p > 0)
    const median = allPrices.length > 0 
      ? allPrices.sort((a, b) => a - b)[Math.floor(allPrices.length / 2)]
      : 0

    setFilteredNeighborhoods(neighborhoodData)
    setTotalListings(filtered.length)
    setMedianPrice(formatPriceShort(median))
  }, [propertyType, priceRange])

  // Fallback data for when Supabase is empty
  const fallbackProperties: PropertyData[] = [
    { city: 'Houston', price: 449990, property_type: 'single_family' },
    { city: 'Houston', price: 175000, property_type: 'single_family' },
    { city: 'Houston', price: 75000, property_type: 'land' },
    { city: 'Katy', price: 299990, property_type: 'single_family' },
    { city: 'Katy', price: 5000, property_type: 'single_family' },
    { city: 'Sugar Land', price: 525000, property_type: 'single_family' },
    { city: 'Cypress', price: 290000, property_type: 'single_family' },
    { city: 'Richmond', price: 434990, property_type: 'single_family' },
    { city: 'Richmond', price: 5000, property_type: 'single_family' },
    { city: 'Missouri City', price: 345000, property_type: 'townhouse' },
    { city: 'Pearland', price: 650000, property_type: 'single_family' },
    { city: 'Stafford', price: 485000, property_type: 'single_family' },
  ]

  // Fetch real listings data from Supabase
  React.useEffect(() => {
    async function fetchListingsData() {
      setIsLoading(true)
      try {
        const { data: properties, error } = await supabase
          .from('properties')
          .select('city, price, property_type')
          .eq('status', 'active')

        if (error) {
          console.error('Error fetching properties:', error)
          // Use fallback on error
          setAllProperties(fallbackProperties)
          setNeighborhoods(processPropertiesToNeighborhoods(fallbackProperties))
          processProperties(fallbackProperties)
          return
        }

        if (!properties || properties.length === 0) {
          // Use fallback when no data
          setAllProperties(fallbackProperties)
          setNeighborhoods(processPropertiesToNeighborhoods(fallbackProperties))
          processProperties(fallbackProperties)
          setIsLoading(false)
          return
        }

        const typedProperties = properties as PropertyData[]
        setAllProperties(typedProperties)
        setNeighborhoods(processPropertiesToNeighborhoods(typedProperties))
        processProperties(typedProperties)
      } catch (err) {
        console.error('Error:', err)
        // Use fallback on catch
        setAllProperties(fallbackProperties)
        processProperties(fallbackProperties)
      } finally {
        setIsLoading(false)
      }
    }

    fetchListingsData()
  }, [])

  // Re-process when filters change
  React.useEffect(() => {
    if (allProperties.length > 0) {
      processProperties(allProperties)
    }
  }, [propertyType, priceRange, allProperties, processProperties])

  // Real-time subscription
  React.useEffect(() => {
    const channel = supabase
      .channel('properties-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties'
        },
        (payload) => {
          console.log('Real-time update:', payload)
          setIsLive(true)
          
          // Refetch data on changes
          supabase
            .from('properties')
            .select('city, price, property_type')
            .eq('status', 'active')
            .then(({ data }) => {
              if (data) {
                const typedProperties = data as PropertyData[]
                setAllProperties(typedProperties)
                processProperties(typedProperties)
              }
            })

          // Flash indicator briefly
          setTimeout(() => setIsLive(false), 2000)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [processProperties])

  // Helper to process properties to neighborhoods (without filters)
  function processPropertiesToNeighborhoods(properties: PropertyData[]): NeighborhoodData[] {
    const cityAggregation: Record<string, { count: number; prices: number[] }> = {}
    
    properties.forEach(prop => {
      const city = prop.city || 'Houston'
      if (!cityAggregation[city]) {
        cityAggregation[city] = { count: 0, prices: [] }
      }
      cityAggregation[city].count++
      if (prop.price) {
        cityAggregation[city].prices.push(Number(prop.price))
      }
    })

    return Object.entries(cityAggregation)
      .filter(([city]) => neighborhoodCoords[city])
      .map(([city, data]) => {
        const avgPrice = data.prices.length > 0 
          ? data.prices.reduce((a, b) => a + b, 0) / data.prices.length 
          : 0
        
        return {
          id: city.toLowerCase().replace(/\s+/g, '-'),
          name: city,
          listings: data.count,
          avgPrice: formatPriceShort(avgPrice),
          avgPriceNum: avgPrice,
          coords: neighborhoodCoords[city] || { x: 50, y: 50 },
          color: neighborhoodCoords[city]?.color || 'from-primary to-accent',
        }
      })
      .sort((a, b) => b.listings - a.listings)
  }

  const featuredCasestudy = {
    company: 'M.O.R.E. Real Estate',
    tags: 'Success Story',
    title: 'Sold $2.5M luxury estate in Sugar Land',
    subtitle: 'in just 14 days with 3 competing offers, exceeding asking price by 8%',
  }

  const handleNeighborhoodClick = (city: string) => {
    navigate(`/listings?city=${encodeURIComponent(city)}`)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Activity className="h-4 w-4" />
            Market Intelligence
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Real-Time Market Insights
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay ahead with live data on Houston's real estate market, property trends, and our proven track record.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. INTERACTIVE MAP - Top Left */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative flex flex-col justify-between gap-4 overflow-hidden rounded-3xl bg-card border border-border p-6 shadow-xl"
          >
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex w-fit items-center gap-2 rounded-full border border-border bg-muted px-3 py-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Interactive Coverage Map</span>
                </div>
                
                {/* Live indicator */}
                <AnimatePresence>
                  {isLive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20"
                    >
                      <Zap className="h-3 w-3 text-emerald-500 animate-pulse" />
                      <span className="text-xs font-medium text-emerald-500">Live Update</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <p className="text-muted-foreground text-sm mb-4">
                Search properties or click on neighborhoods to explore listings.{" "}
                <span className="text-foreground font-medium">Real-time inventory across Greater Houston.</span>
              </p>

              {/* Search Bar */}
              <SearchAutocomplete 
                variant="compact" 
                placeholder="Search properties, neighborhoods..."
                className="mb-4"
              />

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                {/* Property Type Filter */}
                <Select value={propertyType} onValueChange={(val) => setPropertyType(val as PropertyType | 'all')}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-secondary/50 border-border">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(propertyTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Price Range Slider */}
                <div className="flex-1 px-3 py-2 bg-secondary/50 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Price Range</span>
                    <span className="text-xs font-medium text-foreground">
                      {formatPriceShort(priceRange[0])} - {formatPriceShort(priceRange[1])}
                    </span>
                  </div>
                  <Slider
                    value={priceRange}
                    onValueChange={(val) => setPriceRange(val as [number, number])}
                    min={0}
                    max={5000000}
                    step={50000}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Interactive Mapbox Map */}
            <div className="relative">
              <CoverageMap 
                neighborhoods={filteredNeighborhoods.map(hood => ({
                  id: hood.id,
                  name: hood.name,
                  listings: hood.listings,
                  avgPrice: hood.avgPrice,
                  coords: [0, 0] as [number, number], // Will use internal coords lookup
                  color: hood.color,
                }))}
                onNeighborhoodSelect={(hood) => {
                  const found = filteredNeighborhoods.find(n => n.id === hood.id);
                  setSelectedNeighborhood(found || null);
                }}
                selectedNeighborhood={selectedNeighborhood ? {
                  id: selectedNeighborhood.id,
                  name: selectedNeighborhood.name,
                  listings: selectedNeighborhood.listings,
                  avgPrice: selectedNeighborhood.avgPrice,
                  coords: [0, 0] as [number, number],
                  color: selectedNeighborhood.color,
                } : null}
                isLoading={isLoading}
                className="h-[200px]"
              />

              {/* Selected neighborhood panel overlay */}
              <AnimatePresence>
                {selectedNeighborhood && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="absolute left-2 top-2 bottom-2 w-44 bg-card/95 backdrop-blur-xl border border-border rounded-xl p-3 shadow-xl z-20"
                  >
                    <button 
                      onClick={() => setSelectedNeighborhood(null)}
                      className="absolute top-2 right-2 w-5 h-5 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center text-muted-foreground text-xs"
                    >
                      ×
                    </button>
                    <div className={cn("w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center mb-2", selectedNeighborhood.color)}>
                      <Building2 className="h-3.5 w-3.5 text-white" />
                    </div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">{selectedNeighborhood.name}</h4>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Listings</span>
                        <span className="font-semibold text-primary">{selectedNeighborhood.listings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg. Price</span>
                        <span className="font-semibold text-foreground">{selectedNeighborhood.avgPrice}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNeighborhoodClick(selectedNeighborhood.name)}
                      className="mt-3 flex items-center justify-center gap-1.5 w-full py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      View Listings
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-xl bg-secondary/50">
                <p className="text-2xl font-bold text-primary">{isLoading ? '...' : totalListings}</p>
                <p className="text-xs text-muted-foreground">Active Listings</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-secondary/50">
                <p className="text-2xl font-bold text-foreground">{isLoading ? '...' : filteredNeighborhoods.length}</p>
                <p className="text-xs text-muted-foreground">Neighborhoods</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-secondary/50">
                <p className="text-2xl font-bold text-foreground">{isLoading ? '...' : medianPrice}</p>
                <p className="text-xs text-muted-foreground">Median Price</p>
              </div>
            </div>
          </motion.div>

          {/* 2. FEATURED CASE STUDY BLOCK - Top Right */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-card to-accent/5 p-8 shadow-xl"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                  {featuredCasestudy.tags}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                  ))}
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
                {featuredCasestudy.title}{" "}
                <span className="text-muted-foreground font-normal text-lg">
                  {featuredCasestudy.subtitle}
                </span>
              </h3>
            </div>

            <div className="relative z-10 mt-6">
              <RealEstateMessageCard />
            </div>
          </motion.div>

          {/* 3. CHART - Bottom Left */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative flex flex-col gap-6 overflow-hidden rounded-3xl bg-card border border-border p-8 shadow-xl"
          >
            <div>
              <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-border bg-muted px-3 py-1">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Market Analytics</span>
              </div>

              <p className="text-muted-foreground">
                Real-time market performance tracking.{" "}
                <span className="text-foreground font-medium">Monitor trends and make informed decisions.</span>
              </p>
            </div>
            <MonitoringChart />
          </motion.div>

          {/* 4. FEATURE CARDS - Bottom Right (Now with 4 cards) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            <FeatureCard
              icon={<Home className="h-5 w-5 text-primary" />}
              image="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop"
              title="Luxury Listings"
              subtitle="Premium"
              description="Houston's finest homes"
              href="/listings"
            />
            <FeatureCard
              icon={<Calculator className="h-5 w-5 text-primary" />}
              image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop"
              title="Mortgage Calc"
              subtitle="Plan"
              description="Calculate payments"
              href="/mortgage-calculator"
            />
            <FeatureCard
              icon={<Video className="h-5 w-5 text-primary" />}
              image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
              title="Virtual Tours"
              subtitle="360° View"
              description="Explore from home"
              href="/listings"
            />
            <FeatureCard
              icon={<Compass className="h-5 w-5 text-primary" />}
              image="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop"
              title="Area Guides"
              subtitle="Discover"
              description="Neighborhood insights"
              href="/neighborhoods"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ----------------- Feature Card Component -------------------
function FeatureCard({ icon, image, title, subtitle, description, href }: { 
  icon: React.ReactNode
  image: string
  title: string
  subtitle: string
  description: string
  href: string
}) {
  return (
    <Link to={href} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            {icon}
          </div>
          <span className="font-semibold text-sm text-foreground">{title}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="text-primary font-medium">{subtitle}</span> — {description}
        </p>
      </div>

      {/* Card image */}
      <Card className="relative mt-3 h-24 overflow-hidden rounded-xl border-0">
        <img 
          src={image} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="h-3 w-3 text-white" />
        </div>
      </Card>
    </Link>
  )
}

// ----------------- Chart -------------------
const chartData = [
  { month: 'Jul', sales: 2.1, listings: 4.2 },
  { month: 'Aug', sales: 2.8, listings: 5.1 },
  { month: 'Sep', sales: 3.2, listings: 4.8 },
  { month: 'Oct', sales: 4.1, listings: 6.2 },
  { month: 'Nov', sales: 3.8, listings: 5.5 },
  { month: 'Dec', sales: 5.2, listings: 7.8 },
]

const chartConfig = {
  sales: {
    label: 'Sales Volume ($M)',
    color: 'hsl(var(--primary))',
  },
  listings: {
    label: 'Active Listings ($M)',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig

function MonitoringChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="fillListings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
        <XAxis 
          dataKey="month" 
          tickLine={false} 
          axisLine={false} 
          tickMargin={8}
          className="text-xs fill-muted-foreground"
        />
        <YAxis 
          tickLine={false} 
          axisLine={false} 
          tickMargin={8}
          tickFormatter={(value) => `$${value}M`}
          className="text-xs fill-muted-foreground"
        />
        <RechartsPrimitive.Tooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="listings"
          type="monotone"
          fill="url(#fillListings)"
          stroke="hsl(var(--accent))"
          strokeWidth={2}
        />
        <Area
          dataKey="sales"
          type="monotone"
          fill="url(#fillSales)"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}

interface Message {
  title: string;
  time: string;
  content: string;
  color: string;
}

const messages: Message[] = [
  {
    title: "New Listing Alert",
    time: "2m ago",
    content: "5BR estate in River Oaks just hit the market at $4.2M",
    color: "from-primary to-accent",
  },
  {
    title: "Offer Accepted",
    time: "15m ago",
    content: "Your clients' offer on Memorial property was accepted!",
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Showing Scheduled",
    time: "1h ago",
    content: "Tomorrow 2PM - 1847 Westheimer luxury condo tour",
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "Market Update",
    time: "3h ago",
    content: "Sugar Land prices up 12% YoY - great time for sellers",
    color: "from-violet-500 to-purple-500",
  },
  {
    title: "Client Review",
    time: "5h ago",
    content: "⭐⭐⭐⭐⭐ 'Mike made our dream home a reality!'",
    color: "from-rose-500 to-pink-500",
  },
]

const RealEstateMessageCard = () => {
  return (
    <div className="relative h-[180px] overflow-hidden rounded-xl">
      {/* Fade shadow overlay */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-card to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-card to-transparent pointer-events-none" />

      <div className="animate-scroll-up space-y-3 py-2">
        {[...messages, ...messages].map((msg, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-border bg-secondary/50 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-secondary/80"
          >
            <div className={`h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br ${msg.color} flex items-center justify-center`}>
              <Activity className="h-5 w-5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-foreground text-sm truncate">{msg.title}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {msg.time}
                </span>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------- Chart Components -------------------
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a ChartContainer")
  }
  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn("flex aspect-video justify-center text-xs", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color,
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof THEMES] || itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .filter(Boolean)
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: any[]
  label?: string
  hideLabel?: boolean
  hideIndicator?: boolean
  nameKey?: string
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  ({ active, payload, label, hideLabel = false, hideIndicator = false, nameKey }, ref) => {
    const { config } = useChart()

    if (!active || !payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs shadow-xl"
      >
        {!hideLabel && label && (
          <div className="font-medium text-foreground">{label}</div>
        )}
        <div className="grid gap-1.5">
          {payload.map((item: any, index: number) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = config[key] || config[item.dataKey]
            const indicatorColor = item.payload?.fill || item.color || item.stroke

            return (
              <div
                key={item.dataKey || index}
                className="flex w-full items-center gap-2"
              >
                {!hideIndicator && (
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: indicatorColor }}
                  />
                )}
                <div className="flex flex-1 justify-between items-center gap-2">
                  <span className="text-muted-foreground">
                    {itemConfig?.label || item.name}
                  </span>
                  <span className="font-mono font-medium text-foreground">
                    ${item.value}M
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartTooltipContent, type ChartConfig as ChartConfigType }
