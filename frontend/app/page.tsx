import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";
import { Zap, TrendingUp, Shield, Wrench, Truck, Battery, Gauge, IndianRupee, ArrowRight, Star, CheckCircle2, Clock, MapPin, Navigation, Smartphone } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <MainLayout>

      {/* HERO SECTION - EXACT REFERENCE RECREATION */}
      <section className="relative bg-white overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20">
          {/* Hero Grid Layout */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            
            {/* LEFT COLUMN - Headline & CTA */}
            <div className="max-w-xl pt-4 lg:pt-8">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-space-cadet mb-6 leading-[1.05] tracking-tight">
                Electric<br />
                performance,<br />
                made simple.
              </h1>
              
              <p className="text-lg text-slate-gray mb-8 leading-relaxed max-w-md">
                The ABHA EV combines exhilarating performance with everyday ease.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex items-center gap-4 mb-3">
                <Button 
                  size="lg" 
                  variant="default" 
                  className="bg-space-cadet text-white hover:bg-space-cadet-700 rounded-full px-6 shadow-brand"
                  asChild
                >
                  <Link href="/test-drive">
                    Book a test drive
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <Link 
                href="/catalogue" 
                className="inline-flex items-center text-sm font-semibold text-slate-gray hover:text-space-cadet transition-colors"
              >
                Explore S9
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            {/* RIGHT COLUMN - Vehicle Image */}
            <div className="relative lg:-mr-24 xl:-mr-32">
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src="/images/heroev.jpg"
                  alt="ABHA Enterprise Electric Vehicle"
                  fill
                  className="object-contain object-center"
                  priority
                  quality={100}
                />
              </div>
            </div>
            
          </div>
          
          {/* VEHICLE STATISTICS - Bottom Row */}
          <div className="mt-12 lg:mt-16 pt-8 border-t border-slate-gray-100">
            <div className="grid grid-cols-3 gap-8 max-w-4xl">
              
              {/* Stat 1 */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-space-cadet" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-xs text-slate-gray uppercase tracking-wider mb-1">
                    0-100 km/h
                  </div>
                  <div className="text-3xl font-black text-space-cadet">
                    3.1s
                  </div>
                </div>
              </div>
              
              {/* Stat 2 */}
              <div className="flex items-center gap-4 border-l border-slate-gray-200 pl-8">
                <div className="flex-shrink-0">
                  <Battery className="h-8 w-8 text-space-cadet" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-xs text-slate-gray uppercase tracking-wider mb-1">
                    Estimated range
                  </div>
                  <div className="text-3xl font-black text-space-cadet">
                    600 km
                  </div>
                </div>
              </div>
              
              {/* Stat 3 */}
              <div className="flex items-center gap-4 border-l border-slate-gray-200 pl-8">
                <div className="flex-shrink-0">
                  <Zap className="h-8 w-8 text-space-cadet" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-xs text-slate-gray uppercase tracking-wider mb-1">
                    Max power
                  </div>
                  <div className="text-3xl font-black text-space-cadet">
                    520 kW
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - CHARGING & EVERYDAY LIFE */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* LEFT COLUMN - Content */}
            <div className="lg:col-span-4 space-y-6 lg:space-y-8">
              {/* Section Label */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-gray">02</span>
                <div className="h-px flex-1 bg-slate-gray/20"></div>
                <span className="text-xs font-semibold text-slate-gray uppercase tracking-wider">CHARGING & EVERYDAY LIFE</span>
              </div>
              
              {/* Headline */}
              <div>
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-space-cadet mb-4 lg:mb-6 leading-[1.1]">
                  Freedom<br />
                  goes further
                </h2>
                <p className="text-base lg:text-lg text-slate-gray leading-relaxed">
                  Effortless charging, intelligent planning and a network you can count on — wherever life takes you.
                </p>
              </div>
              
              {/* Features List */}
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-space-cadet flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-tan" />
                  </div>
                  <div>
                    <h3 className="text-base lg:text-lg font-bold text-space-cadet mb-1">Fast charging</h3>
                    <p className="text-sm text-slate-gray leading-relaxed">
                      10-80% charge in 18 minutes. Get back on the road, faster.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-space-cadet flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-tan" />
                  </div>
                  <div>
                    <h3 className="text-base lg:text-lg font-bold text-space-cadet mb-1">Expansive network</h3>
                    <p className="text-sm text-slate-gray leading-relaxed">
                      Access to 500,000+ charging points across India.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-space-cadet flex items-center justify-center flex-shrink-0">
                    <Smartphone className="h-5 w-5 text-tan" />
                  </div>
                  <div>
                    <h3 className="text-base lg:text-lg font-bold text-space-cadet mb-1">Smart planning</h3>
                    <p className="text-sm text-slate-gray leading-relaxed">
                      The route adjusts automatically based on your destination, traffic and battery level.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* CTA Button */}
              <div>
                <Button variant="default" size="lg" className="bg-space-cadet rounded-full shadow-brand" asChild>
                  <Link href="/charging">
                    Explore charging
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* CENTER COLUMN - Large Charging Image */}
            <div className="lg:col-span-5">
              <Card variant="elevated" className="overflow-hidden h-full border-0 shadow-brand-xl">
                <div className="relative aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-50">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div className="mb-8">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-space-cadet/10 mb-4">
                        <Battery className="h-10 w-10 text-space-cadet" />
                      </div>
                      <h3 className="text-2xl font-bold text-space-cadet mb-2">CLEAN ENERGY</h3>
                      <p className="text-base text-slate-gray">UNLIMITED TOMORROW</p>
                    </div>
                    
                    <div className="relative mt-auto">
                      <div className="w-32 h-48 bg-space-cadet rounded-t-full flex items-center justify-center">
                        <Zap className="h-16 w-16 text-tan" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-8 left-8 right-8 text-center">
                    <p className="text-xs text-slate-gray">[High-quality EV charging lifestyle photography]</p>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* RIGHT COLUMN - Info Cards */}
            <div className="lg:col-span-3 space-y-5 lg:space-y-6">
              <Card variant="elevated" className="p-5 border-slate-gray/10">
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-space-cadet mb-2">Find charging stations</h4>
                  <p className="text-xs text-slate-gray mb-4">Plan your journey</p>
                </div>
                
                <div className="relative h-28 bg-slate-50 rounded-lg flex items-center justify-center mb-4">
                  <div className="relative">
                    <MapPin className="h-7 w-7 text-caput-mortuum absolute -top-3 left-0" />
                    <div className="w-28 h-1 border-t-2 border-dashed border-space-cadet/30"></div>
                    <Navigation className="h-6 w-6 text-tan absolute -top-2.5 right-0" />
                  </div>
                </div>
                
                <Link href="/charging" className="text-xs font-semibold text-space-cadet hover:text-tan transition-colors inline-flex items-center">
                  View map
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Card>
              
              <Card variant="elevated" className="overflow-hidden border-0">
                <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="h-12 w-12 text-space-cadet/20" />
                  </div>
                </div>
              </Card>
              
              <div className="space-y-3.5">
                <div className="flex items-center justify-between py-2.5 border-b border-slate-gray/10">
                  <div className="flex items-center gap-3">
                    <Battery className="h-5 w-5 text-space-cadet" />
                    <div>
                      <div className="text-sm font-bold text-space-cadet">10-80%</div>
                      <div className="text-xs text-slate-gray">in ~18 min</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-gray" />
                </div>
                
                <div className="flex items-center justify-between py-2.5 border-b border-slate-gray/10">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-space-cadet" />
                    <div>
                      <div className="text-sm font-bold text-space-cadet">500,000+</div>
                      <div className="text-xs text-slate-gray">charging points</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-gray" />
                </div>
                
                <div className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <Navigation className="h-5 w-5 text-space-cadet" />
                    <div>
                      <div className="text-sm font-bold text-space-cadet">Real-time</div>
                      <div className="text-xs text-slate-gray">route planning</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-gray" />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-semibold border-2 border-tan text-space-cadet">
              EXPLORE CATEGORIES
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 text-space-cadet">
              Find Your Perfect <span className="text-tan">Electric Ride</span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-gray max-w-3xl mx-auto leading-relaxed">
              From urban commuters to commercial vehicles, we have the right EV for every need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "Electric Scooters",
                description: "Perfect for daily urban commuting with style and efficiency",
                icon: Battery,
                range: "60-100 km",
                price: "From ₹65,000",
                slug: "scooters",
                color: "tan",
                features: ["Lightweight", "Eco-Friendly", "Low Cost"]
              },
              {
                title: "Electric Motorcycles",
                description: "Power, performance, and premium features combined",
                icon: Zap,
                range: "80-150 km",
                price: "From ₹95,000",
                slug: "bikes",
                color: "caput-mortuum",
                features: ["High Performance", "Long Range", "Premium Build"]
              },
              {
                title: "Three-Wheelers",
                description: "Commercial and passenger EVs for business growth",
                icon: Truck,
                range: "100-120 km",
                price: "From ₹1,80,000",
                slug: "three-wheelers",
                color: "slate-gray",
                features: ["High Capacity", "Durable", "Profitable"]
              },
            ].map((category) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={category.title} 
                  variant="elevated"
                  className="group hover-lift cursor-pointer border-2 hover:border-tan transition-all duration-300"
                >
                  <CardHeader className="space-y-6 pb-8">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-${category.color} to-${category.color}-600 flex items-center justify-center shadow-brand-lg group-hover:shadow-brand-xl transition-all group-hover:scale-110`}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-3 text-space-cadet group-hover:text-tan transition-colors">
                        {category.title}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {category.description}
                      </CardDescription>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {category.features.map((feature) => (
                        <span key={feature} className="text-xs px-3 py-1 bg-slate-gray-50 text-slate-gray-700 rounded-full font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t-2 border-slate-gray-100">
                      <div>
                        <div className="text-xs text-slate-gray mb-1 font-medium">Range</div>
                        <div className="text-sm font-bold text-space-cadet">{category.range}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-gray mb-1 font-medium">Starting</div>
                        <div className="text-lg font-black text-tan">{category.price}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-tan group-hover:text-space-cadet group-hover:border-tan transition-all font-bold border-2" 
                      asChild
                    >
                      <Link href={`/catalogue/${category.slug}`}>
                        View Collection
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Finance CTA Section */}
      <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-br from-caput-mortuum via-caput-mortuum-700 to-space-cadet">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnpNMzQgMzZoMi0yem0wLTJoMnYyaC0ydi0yem0yIDB2Mmgtdi0yaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <IndianRupee className="h-16 lg:h-20 w-16 lg:w-20 mx-auto mb-6 lg:mb-8 text-tan opacity-90" />
            
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 lg:mb-8 leading-tight">
              Own Your Dream EV with<br />
              <span className="text-tan">Zero Down Payment</span>
            </h2>
            
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-10 lg:mb-12 max-w-3xl mx-auto leading-relaxed">
              Get instant finance approval with flexible EMI starting at just <span className="font-bold text-tan">₹2,999/month</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 lg:mb-16">
              <Button size="xl" variant="primary" className="shadow-tan-xl font-bold rounded-full" asChild>
                <Link href="/finance">
                  <IndianRupee className="h-6 w-6 mr-2" />
                  Calculate My EMI
                </Link>
              </Button>
              <Button size="xl" variant="outline" className="bg-white/10 border-2 border-white hover:bg-white hover:text-caput-mortuum backdrop-blur-sm font-bold rounded-full" asChild>
                <Link href="/finance/apply">
                  Apply for Finance
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 max-w-3xl mx-auto">
              {[
                { icon: CheckCircle2, text: "Zero Processing Fee" },
                { icon: CheckCircle2, text: "Flexible Tenure" },
                { icon: CheckCircle2, text: "Instant Approval" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center justify-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 lg:px-6 py-3 lg:py-4 shadow-brand border border-white/20 hover:bg-white/25 transition-all">
                    <Icon className="h-5 w-5 lg:h-6 lg:w-6 text-tan flex-shrink-0" />
                    <span className="text-sm lg:text-base font-semibold text-white">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-semibold border-2 border-tan text-space-cadet">
              CUSTOMER REVIEWS
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 text-space-cadet">
              Loved by <span className="text-tan">5,000+</span> Customers
            </h2>
            <p className="text-lg lg:text-xl text-slate-gray max-w-2xl mx-auto">
              Real experiences from happy EV owners across India
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                name: "Raj Sharma",
                location: "Mumbai, Maharashtra",
                avatar: "RS",
                rating: 5,
                comment: "Excellent service from start to finish! Got my scooter delivered within a week. The finance team made the EMI process incredibly smooth and transparent.",
                verified: true,
              },
              {
                name: "Priya Patel",
                location: "Bangalore, Karnataka",
                avatar: "PP",
                rating: 5,
                comment: "Best EV dealership experience I've had. The team helped me choose the perfect model for my daily commute and arranged easy financing.",
                verified: true,
              },
              {
                name: "Amit Kumar",
                location: "Delhi NCR",
                avatar: "AK",
                rating: 5,
                comment: "Very professional and knowledgeable staff. They explained all the features clearly and even helped with registration. The scooter is amazing!",
                verified: true,
              },
            ].map((testimonial) => (
              <Card 
                key={testimonial.name} 
                variant="elevated"
                className="hover-lift"
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-tan text-tan" />
                    ))}
                  </div>
                  
                  <CardDescription className="text-base text-space-cadet leading-relaxed">
                    "{testimonial.comment}"
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-tan to-coffee flex items-center justify-center font-bold text-white text-lg shadow-brand flex-shrink-0">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-space-cadet">{testimonial.name}</div>
                        {testimonial.verified && (
                          <CheckCircle2 className="h-4 w-4 text-tan" />
                        )}
                      </div>
                      <div className="text-sm text-slate-gray">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </MainLayout>
  );
}
