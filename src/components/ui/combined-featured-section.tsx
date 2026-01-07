'use client'

import * as React from "react"
import { Activity, ArrowRight, Home, MapPin, TrendingUp, Users, DollarSign, Building2, Calendar, Star } from 'lucide-react'
import DottedMap from 'dotted-map'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card } from '@/components/ui/card'
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"
import { motion } from 'framer-motion'

export default function CombinedFeaturedSection() {
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
          {/* 1. MAP - Top Left */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-3xl bg-card border border-border p-8 shadow-xl"
          >
            <div>
              <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-border bg-muted px-3 py-1">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Houston Coverage</span>
              </div>

              <p className="text-muted-foreground">
                Comprehensive coverage across Greater Houston.{" "}
                <span className="text-foreground font-medium">From The Woodlands to Sugar Land, we've got you covered.</span>
              </p>
            </div>

            <div className="flex flex-col gap-6 md:flex-row">
              <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-border bg-secondary/30 p-4">
                <span className="text-xs font-medium text-primary">
                  🏠 Active in 25+ neighborhoods
                </span>
              </div>
              <Map />
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

          {/* 4. FEATURE CARDS - Bottom Right */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <FeatureCard
              icon={<Home className="h-5 w-5 text-primary" />}
              image="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop"
              title="Luxury Listings"
              subtitle="Premium Properties"
              description="Exclusive access to Houston's finest luxury homes and estates."
            />
            <FeatureCard
              icon={<Users className="h-5 w-5 text-primary" />}
              image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"
              title="Personal Service"
              subtitle="White Glove"
              description="Dedicated support from search to closing and beyond."
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ----------------- Feature Card Component -------------------
function FeatureCard({ icon, image, title, subtitle, description }: { icon: React.ReactNode, image: string, title: string, subtitle: string, description: string }) {
  return (
    <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-primary/30">
      <div className="relative z-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              {icon}
            </div>
            <span className="font-semibold text-foreground">{title}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-medium">{subtitle}</span>{" "}
            {description}
          </p>
        </div>
      </div>

      {/* Card image */}
      <Card className="relative mt-4 h-32 overflow-hidden rounded-xl border-0">
        <img 
          src={image} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </Card>

      {/* Arrow icon */}
      <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="p-2 rounded-full bg-primary/10">
          <ArrowRight className="h-4 w-4 text-primary" />
        </div>
      </div>
    </div>
  )
}

// ----------------- Map -------------------
const map = new DottedMap({ height: 55, grid: 'diagonal' })
const points = map.getPoints()

const Map = () => (
  <svg viewBox="0 0 120 60" className="h-full w-full flex-1 text-primary/60">
    {points.map((point, i) => (
      <circle 
        key={i} 
        cx={point.x} 
        cy={point.y} 
        r={0.4} 
        fill="currentColor" 
        className="opacity-40"
      />
    ))}
    {/* Houston marker */}
    <circle cx={25} cy={35} r={2} fill="hsl(var(--primary))" className="animate-pulse" />
    <circle cx={25} cy={35} r={4} fill="hsl(var(--primary))" className="opacity-30 animate-ping" />
  </svg>
)

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
