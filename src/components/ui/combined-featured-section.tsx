'use client'

import * as React from "react"
import { Activity, ArrowRight, Home, MapPin, TrendingUp, Users, Calculator, Video, Compass, Building2, Star } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card } from '@/components/ui/card'
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

// Houston neighborhoods with listing counts
const neighborhoods = [
  { id: 'sugar-land', name: 'Sugar Land', listings: 24, avgPrice: '$485K', coords: { x: 30, y: 55 }, color: 'from-emerald-500 to-teal-500' },
  { id: 'katy', name: 'Katy', listings: 31, avgPrice: '$425K', coords: { x: 15, y: 35 }, color: 'from-blue-500 to-indigo-500' },
  { id: 'cypress', name: 'Cypress', listings: 18, avgPrice: '$510K', coords: { x: 20, y: 20 }, color: 'from-violet-500 to-purple-500' },
  { id: 'richmond', name: 'Richmond', listings: 15, avgPrice: '$380K', coords: { x: 40, y: 60 }, color: 'from-amber-500 to-orange-500' },
  { id: 'missouri-city', name: 'Missouri City', listings: 22, avgPrice: '$395K', coords: { x: 45, y: 50 }, color: 'from-rose-500 to-pink-500' },
  { id: 'pearland', name: 'Pearland', listings: 19, avgPrice: '$365K', coords: { x: 55, y: 55 }, color: 'from-cyan-500 to-blue-500' },
  { id: 'memorial', name: 'Memorial', listings: 12, avgPrice: '$1.2M', coords: { x: 40, y: 30 }, color: 'from-primary to-accent' },
  { id: 'river-oaks', name: 'River Oaks', listings: 8, avgPrice: '$2.8M', coords: { x: 50, y: 35 }, color: 'from-amber-400 to-yellow-500' },
]

export default function CombinedFeaturedSection() {
  const [selectedNeighborhood, setSelectedNeighborhood] = React.useState<typeof neighborhoods[0] | null>(null)
  const [hoveredNeighborhood, setHoveredNeighborhood] = React.useState<string | null>(null)

  const featuredCasestudy = {
    company: 'M.O.R.E. Real Estate',
    tags: 'Success Story',
    title: 'Sold $2.5M luxury estate in Sugar Land',
    subtitle: 'in just 14 days with 3 competing offers, exceeding asking price by 8%',
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
              <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-border bg-muted px-3 py-1">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Interactive Coverage Map</span>
              </div>

              <p className="text-muted-foreground text-sm">
                Click on neighborhoods to explore listings.{" "}
                <span className="text-foreground font-medium">Real-time inventory across Greater Houston.</span>
              </p>
            </div>

            {/* Interactive Map */}
            <div className="relative h-[280px] bg-gradient-to-br from-secondary/50 to-muted/30 rounded-2xl overflow-hidden">
              {/* Grid background */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--primary)/0.3) 1px, transparent 0)',
                backgroundSize: '20px 20px'
              }} />
              
              {/* Neighborhood markers */}
              {neighborhoods.map((hood) => (
                <motion.button
                  key={hood.id}
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group",
                    selectedNeighborhood?.id === hood.id && "z-20"
                  )}
                  style={{ left: `${hood.coords.x}%`, top: `${hood.coords.y}%` }}
                  onClick={() => setSelectedNeighborhood(selectedNeighborhood?.id === hood.id ? null : hood)}
                  onMouseEnter={() => setHoveredNeighborhood(hood.id)}
                  onMouseLeave={() => setHoveredNeighborhood(null)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Pulse ring */}
                  <motion.div
                    className={cn(
                      "absolute inset-0 rounded-full bg-gradient-to-br opacity-30",
                      hood.color
                    )}
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                  
                  {/* Marker dot */}
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-gradient-to-br shadow-lg border-2 border-white transition-all duration-300",
                    hood.color,
                    (selectedNeighborhood?.id === hood.id || hoveredNeighborhood === hood.id) && "w-5 h-5"
                  )} />
                  
                  {/* Listing count badge */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[8px] font-bold rounded-full flex items-center justify-center">
                    {hood.listings}
                  </div>

                  {/* Hover tooltip */}
                  <AnimatePresence>
                    {(hoveredNeighborhood === hood.id && selectedNeighborhood?.id !== hood.id) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-card border border-border rounded-lg shadow-lg whitespace-nowrap z-30"
                      >
                        <p className="text-xs font-semibold text-foreground">{hood.name}</p>
                        <p className="text-[10px] text-muted-foreground">{hood.listings} listings • {hood.avgPrice}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}

              {/* Selected neighborhood panel */}
              <AnimatePresence>
                {selectedNeighborhood && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="absolute left-4 top-4 bottom-4 w-48 bg-card/95 backdrop-blur-xl border border-border rounded-xl p-4 shadow-xl"
                  >
                    <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3", selectedNeighborhood.color)}>
                      <Building2 className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{selectedNeighborhood.name}</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Active Listings</span>
                        <span className="font-semibold text-primary">{selectedNeighborhood.listings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg. Price</span>
                        <span className="font-semibold text-foreground">{selectedNeighborhood.avgPrice}</span>
                      </div>
                    </div>
                    <Link
                      to={`/neighborhoods/${selectedNeighborhood.id}`}
                      className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      View Listings
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-xl bg-secondary/50">
                <p className="text-2xl font-bold text-primary">149</p>
                <p className="text-xs text-muted-foreground">Active Listings</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-secondary/50">
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-xs text-muted-foreground">Neighborhoods</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-secondary/50">
                <p className="text-2xl font-bold text-foreground">$520K</p>
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
