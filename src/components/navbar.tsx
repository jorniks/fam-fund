import Link from 'next/link'
import React from 'react'
import WalletButton from './WalletButtons'

const NavBar = () => {
  return (
    <div className="border-b">
      <div className="container py-4 flex items-center justify-between">
        <aside className="font-bold text-xl sm:text-2xl">
          <Link href="/">FamDao</Link>
        </aside>

        <aside className="">
          <WalletButton />
        </aside>
      </div>
    </div>
  )
}

export default NavBar