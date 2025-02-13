import React, { Suspense } from 'react'
import { SignUp } from '@clerk/nextjs'
import Image from 'next/image'

const page = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#56CA00] to-[#37B7C0]">
      <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
        <Image
          src="/logo.svg"
          alt="logo"
          width={200}
          height={200}
          className="rounded-full self-center mb-8"
        />
        <div className="text-white space-y-6 lg:space-y-8">
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-center lg:text-left">
            Commencez votre voyage
          </h1>
          <p className="text-lg lg:text-xl leading-relaxed text-gray-100 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
            Rejoignez des milliers de clients satisfaits qui font confiance à nos services de nettoyage. Vivez l'excellence dès aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Service professionnel</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Satisfaction 100%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 bg-white/10 backdrop-blur-lg p-8 lg:p-12 flex items-center justify-center lg:rounded-l-3xl shadow-2xl">
        <div className="w-full max-w-md">
            <SignUp forceRedirectUrl={"/onboarding"} />
        </div>
      </div>
    </div>
  )
}

export default page


// I want to design a database for my service so i'll explain the workflow the user signs up using clerk his data is synced to our db using webhooks and the the users is taken through an onboarding step where he fills up aditional information like his properties and phone number and name and the he's taken to the dashboard where he could book a cleaning and manage his properties 