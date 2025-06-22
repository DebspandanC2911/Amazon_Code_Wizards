"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Header from "@/components/Header"

export default function CheckoutPage() {
  const [showOpenBoxModal, setShowOpenBoxModal] = useState(false)
  const [openBoxSelected, setOpenBoxSelected] = useState(false)
  const [orderTotal, setOrderTotal] = useState(2999)

  const handleProceedToPayment = () => {
    setShowOpenBoxModal(true)
  }

  const handleOpenBoxChoice = (choice: boolean) => {
    setOpenBoxSelected(choice)
    if (choice) {
      setOrderTotal((prev) => prev + 50)
    }
    setShowOpenBoxModal(false)
    // Proceed to payment
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Wireless Bluetooth Headphones</span>
                    <span>₹2,999</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  {openBoxSelected && (
                    <div className="flex justify-between items-center">
                      <span>Open Box Delivery</span>
                      <span>₹50</span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total</span>
                    <span>₹{orderTotal.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleProceedToPayment}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
                >
                  Proceed to Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Open Box Delivery Modal */}
      <Dialog open={showOpenBoxModal} onOpenChange={setShowOpenBoxModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Open Box Delivery Option</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="mb-4 text-gray-700">
              Would you like Open Box Delivery for an additional ₹50? This allows you to inspect the product before
              accepting delivery.
            </p>

            <div className="space-y-3">
              <Button onClick={() => handleOpenBoxChoice(true)} className="w-full bg-blue-600 hover:bg-blue-700">
                Yes, Add Open Box Delivery (+₹50)
              </Button>

              <Button onClick={() => handleOpenBoxChoice(false)} variant="outline" className="w-full">
                No, Continue with Regular Delivery
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
