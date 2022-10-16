import Link from 'next/link'

function Header() {
  return (
    <header className="flex justify-between p-5 sticky top-0 bg-yellow-500">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <img
            className="w-44 cursor-pointer object-contain"
            src="https://links.papareact.com/yvf"
            alt=""
          />
        </Link>
        <div className="hidden items-center space-x-5 md:inline-flex text-white font-semibold">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className="rounded-full bg-yellow-700 px-6 py-1">
            Follow
          </h3>
        </div>
      </div>

      <div className="flex items-center space-x-5 text-white font-semibold whitespace-nowrap">
        <h3>Sign In</h3>
        <h3 className="rounded-full bg-yellow-700 px-6 py-1">
          Get Started
        </h3>
      </div>
    </header>
  )
}

export default Header
