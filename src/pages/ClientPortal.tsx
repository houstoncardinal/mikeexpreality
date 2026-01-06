import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import {
  User,
  Home,
  Heart,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Eye,
  MapPin,
  DollarSign,
  Clock,
  Phone,
  Mail,
  Star,
  TrendingUp,
  Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { siteConfig } from "@/lib/siteConfig";
import { toast } from "sonner";

// Mock client data - in real app, this would come from authentication
const mockClientData = {
  id: "client-123",
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  phone: "(555) 123-4567",
  joinDate: "2024-01-15",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  preferences: {
    propertyTypes: ["Single Family", "Condo"],
    priceRange: [300000, 600000],
    areas: ["River Oaks", "West University", "The Heights"],
    bedrooms: 3,
    bathrooms: 2,
  },
  savedProperties: [
    {
      id: "prop-1",
      address: "123 Oak Street, River Oaks",
      price: 485000,
      beds: 3,
      baths: 2,
      sqft: 2100,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      status: "Active",
      savedDate: "2024-01-20",
    },
    {
      id: "prop-2",
      address: "456 Pine Avenue, West University",
      price: 525000,
      beds: 4,
      baths: 3,
      sqft: 2400,
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
      status: "Active",
      savedDate: "2024-01-18",
    },
  ],
  appointments: [
    {
      id: "appt-1",
      property: "123 Oak Street, River Oaks",
      date: "2024-01-25",
      time: "2:00 PM",
      type: "Private Showing",
      status: "Confirmed",
    },
    {
      id: "appt-2",
      property: "456 Pine Avenue, West University",
      date: "2024-01-28",
      time: "10:00 AM",
      type: "Open House",
      status: "Confirmed",
    },
  ],
  messages: [
    {
      id: "msg-1",
      from: siteConfig.agent.name,
      subject: "Update on 123 Oak Street showing",
      preview: "Great news! The property is still available and the seller is motivated...",
      date: "2024-01-22",
      unread: true,
    },
    {
      id: "msg-2",
      from: siteConfig.agent.name,
      subject: "Market analysis for River Oaks",
      preview: "I've prepared a detailed market analysis for the River Oaks area...",
      date: "2024-01-20",
      unread: false,
    },
  ],
  activity: [
    { date: "2024-01-22", action: "Saved property: 123 Oak Street", type: "save" },
    { date: "2024-01-20", action: "Scheduled showing: 456 Pine Avenue", type: "appointment" },
    { date: "2024-01-18", action: "Updated search preferences", type: "update" },
    { date: "2024-01-15", action: "Account created", type: "account" },
  ],
};

export function ClientPortal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [clientData, setClientData] = useState(mockClientData);

  const stats = [
    {
      title: "Saved Properties",
      value: clientData.savedProperties.length.toString(),
      icon: Heart,
      color: "text-red-500",
    },
    {
      title: "Upcoming Appointments",
      value: clientData.appointments.length.toString(),
      icon: Calendar,
      color: "text-blue-500",
    },
    {
      title: "Unread Messages",
      value: clientData.messages.filter(m => m.unread).length.toString(),
      icon: MessageSquare,
      color: "text-green-500",
    },
    {
      title: "Account Age",
      value: `${Math.floor((new Date().getTime() - new Date(clientData.joinDate).getTime()) / (1000 * 60 * 60 * 24))} days`,
      icon: Clock,
      color: "text-purple-500",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Client Portal | {siteConfig.name}</title>
      </Helmet>

      <Layout>
        <div className="min-h-screen bg-secondary/20">
          {/* Header */}
          <div className="bg-card border-b border-border">
            <div className="container-custom py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={clientData.avatar} alt={clientData.name} />
                    <AvatarFallback>
                      {clientData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-serif font-bold text-foreground">
                      Welcome back, {clientData.name.split(' ')[0]}
                    </h1>
                    <p className="text-muted-foreground">
                      Member since {new Date(clientData.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button variant="outline" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container-custom py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              {/* Tab Navigation */}
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="properties">Saved Properties</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recent Activity & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {clientData.activity.slice(0, 5).map((activity, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                              {activity.type === 'save' && <Heart className="h-4 w-4 text-red-500" />}
                              {activity.type === 'appointment' && <Calendar className="h-4 w-4 text-blue-500" />}
                              {activity.type === 'update' && <Settings className="h-4 w-4 text-purple-500" />}
                              {activity.type === 'account' && <User className="h-4 w-4 text-green-500" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.action}</p>
                              <p className="text-xs text-muted-foreground">{activity.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start" variant="outline">
                        <Home className="h-4 w-4 mr-2" />
                        Browse New Properties
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Showing
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Agent
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Update Preferences
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Agent Contact Card */}
                <Card className="bg-gradient-to-r from-accent/5 to-accent/10 border-accent/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85,fit=scale-down,width=400/https://media-production.lp-cdn.com/media/3e061cc4-19fe-4964-9802-0ef4ec5783d2" />
                        <AvatarFallback>MK</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-serif text-lg font-bold text-foreground">
                          {siteConfig.agent.name}
                        </h3>
                        <p className="text-muted-foreground mb-2">
                          Your dedicated real estate professional
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{siteConfig.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{siteConfig.email}</span>
                          </div>
                        </div>
                      </div>
                      <Button>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Saved Properties Tab */}
              <TabsContent value="properties" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-serif font-bold">Saved Properties</h2>
                  <Badge variant="secondary">
                    {clientData.savedProperties.length} properties
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {clientData.savedProperties.map((property) => (
                    <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video relative">
                        <img
                          src={property.image}
                          alt={property.address}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                            <Heart className="h-4 w-4 text-red-500 fill-current" />
                          </Button>
                        </div>
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-green-100 text-green-800">
                            {property.status}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">
                            ${property.price.toLocaleString()}
                          </h3>
                          <span className="text-sm text-muted-foreground">
                            Saved {new Date(property.savedDate).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-3 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {property.address}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{property.beds} beds</span>
                          <span>{property.baths} baths</span>
                          <span>{property.sqft.toLocaleString()} sqft</span>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="h-4 w-4 mr-1" />
                            Schedule
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Appointments Tab */}
              <TabsContent value="appointments" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-serif font-bold">My Appointments</h2>
                  <Button>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule New
                  </Button>
                </div>

                <div className="space-y-4">
                  {clientData.appointments.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">
                              {appointment.property}
                            </h3>
                            <p className="text-muted-foreground mb-3">
                              {appointment.type}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(appointment.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{appointment.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="mb-3 bg-green-100 text-green-800">
                              {appointment.status}
                            </Badge>
                            <div className="space-y-2">
                              <Button size="sm" variant="outline">
                                Reschedule
                              </Button>
                              <Button size="sm" variant="outline">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Messages Tab */}
              <TabsContent value="messages" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-serif font-bold">Messages</h2>
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    New Message
                  </Button>
                </div>

                <div className="space-y-4">
                  {clientData.messages.map((message) => (
                    <Card key={message.id} className={`cursor-pointer hover:shadow-md transition-shadow ${message.unread ? 'border-accent' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85,fit=scale-down,width=400/https://media-production.lp-cdn.com/media/3e061cc4-19fe-4964-9802-0ef4ec5783d2" />
                              <AvatarFallback>MK</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{message.from}</h3>
                              <p className="text-sm font-medium text-foreground">
                                {message.subject}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {message.preview}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground mb-2">
                              {new Date(message.date).toLocaleDateString()}
                            </p>
                            {message.unread && (
                              <Badge className="bg-accent text-accent-foreground">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <h2 className="text-2xl font-serif font-bold">Account Activity</h2>

                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {clientData.activity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                            {activity.type === 'save' && <Heart className="h-5 w-5 text-red-500" />}
                            {activity.type === 'appointment' && <Calendar className="h-5 w-5 text-blue-500" />}
                            {activity.type === 'update' && <Settings className="h-5 w-5 text-purple-500" />}
                            {activity.type === 'account' && <User className="h-5 w-5 text-green-500" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">
                              {activity.action}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(activity.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Layout>
    </>
  );
}
