import { Card } from 'antd'
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosInstance from '../lib/axiosInstance'

const PaypalPaymentReturn = () => {

    const location = useLocation()
    const params = new URLSearchParams(location.search)

    const paymentId = params.get("paymentId")
    const payerId = params.get("PayerID")

    useEffect(()=>{
            if(paymentId && payerId){
        
                async function capturePayment() {
                    try{
                        const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"))

                        const response = await axiosInstance.post("/order/capture" , {paymentId , payerId , orderId})
                            if(response?.data?.success){
                                sessionStorage.removeItem("currentOrderId")
                                window.location.href = "/my-courses-Page"
                            }
                    }catch(err){
                        console.log(err)
                    }
                }
                capturePayment()
            
            }
    },[paymentId , payerId])


  return (
    <div className='flex min-h-screen items-center justify-center'>
        <Card className='flex items-center justify-center shadow-2xl'>
            <h1 className='font-semibold text-2xl '> 
                Payment Processing ... Please Wait
            </h1>
        </Card>
    </div>
  )
}

export default PaypalPaymentReturn