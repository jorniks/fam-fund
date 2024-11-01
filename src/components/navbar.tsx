import Link from 'next/link'
import React from 'react'
import WalletButton from './WalletButtons'

const NavBar = () => {
  return (
    <div className="bg-white py-3">
      <div className="container flex items-center justify-between">
        <aside className="font-bold text-xl sm:text-2xl">
          <Link href="/">FamDao</Link>
        </aside>

        <aside>
        </aside>

        <aside className="">
          <WalletButton />
        </aside>
      </div>
    </div>
  )
}

export default NavBar