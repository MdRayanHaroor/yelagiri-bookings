"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-[#003580] text-white py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Contact Us</h1>
            <p className="text-base sm:text-lg md:text-xl opacity-90">
              We're here to help you plan your perfect Yelagiri getaway
            </p>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
              {/* Contact Form */}
              <Card className="order-2 lg:order-1">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <Input placeholder="Your first name" className="text-sm sm:text-base" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <Input placeholder="Your last name" className="text-sm sm:text-base" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input type="email" placeholder="your.email@example.com" className="text-sm sm:text-base" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <Input type="tel" placeholder="+91 12345 67890" className="text-sm sm:text-base" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <Input placeholder="How can we help you?" className="text-sm sm:text-base" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <Textarea
                        placeholder="Tell us more about your inquiry..."
                        className="min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
                      />
                    </div>
                    <Button className="w-full bg-[#0071C2] hover:bg-[#005999] text-white text-sm sm:text-base py-2 sm:py-3">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Get in Touch</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-[#0071C2] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base">Address</h3>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                          Yelagiri Hills, Vellore District
                          <br />
                          Tamil Nadu 635853, India
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-[#0071C2] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base">Phone</h3>
                        <p className="text-sm sm:text-base text-gray-600">+91 98765 43210</p>
                        <p className="text-sm sm:text-base text-gray-600">+91 87654 32109</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-[#0071C2] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base">Email</h3>
                        <p className="text-sm sm:text-base text-gray-600 break-all">info@yelagiribookings.com</p>
                        <p className="text-sm sm:text-base text-gray-600 break-all">support@yelagiribookings.com</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-[#0071C2] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base">Business Hours</h3>
                        <p className="text-sm sm:text-base text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p className="text-sm sm:text-base text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
                        <p className="text-sm sm:text-base text-gray-600">Sunday: Closed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card className="bg-red-50 border-red-200">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl text-red-800">Emergency Contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm sm:text-base text-red-700 mb-2">24/7 Emergency Support</p>
                    <p className="text-base sm:text-lg text-red-800 font-semibold">+91 99999 88888</p>
                    <p className="text-xs sm:text-sm text-red-600 mt-2">
                      For urgent booking issues or travel emergencies
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-8 sm:py-12 md:py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8">Find Us</h2>
            <div className="max-w-5xl mx-auto">
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-lg">
                <div
                  className="w-full h-64 sm:h-80 md:h-96 bg-gray-300 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundImage: `url('/placeholder.svg?height=400&width=800')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-lg text-center">
                    <p className="text-sm sm:text-base text-gray-700 font-medium">Interactive Map</p>
                    <p className="text-xs sm:text-sm text-gray-600">Yelagiri Hills, Tamil Nadu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
              {[
                {
                  question: "What is the best time to visit Yelagiri?",
                  answer:
                    "The best time to visit Yelagiri is from October to June when the weather is pleasant and ideal for outdoor activities.",
                },
                {
                  question: "How far is Yelagiri from major cities?",
                  answer:
                    "Yelagiri is approximately 230 km from Chennai, 160 km from Bangalore, and 100 km from Vellore.",
                },
                {
                  question: "What activities are available in Yelagiri?",
                  answer:
                    "Popular activities include trekking, paragliding, boating, nature walks, and visiting the telescope observatory.",
                },
                {
                  question: "Are there good accommodation options?",
                  answer:
                    "Yes, Yelagiri offers a range of accommodations from budget hotels to luxury resorts, all bookable through our platform.",
                },
              ].map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="font-semibold text-base sm:text-lg mb-2">{faq.question}</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
