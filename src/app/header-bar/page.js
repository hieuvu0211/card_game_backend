'use client'
import { useCookies } from 'react-cookie'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
export default function HeaderBar() {

  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(['login'])

  const handleLogin = () => {
    removeCookie('login', { path: '/'})
  }
    return (
      <>
        <div className=" bg-black text-white flex flex-row w-full fixed top-0">
        <div className="flex flex-row bg-slate-800 basis-1/2">
          <Link className="flex flex-row rounded-3xl m-2 text-center w-40" href='/'><img src="/img/icon.ico" className='w-6 h-6 mr-2'/> Coup(2012)</Link>
        </div>
          <div className="flex flex-row bg-slate-800 basis-1/2  justify-end">
            <div className="  m-2 w-16 text-center hover:bg-gray-600 rounded-3xl"><Link href="/shop">Shop</Link></div>
            <div className="  m-2 w-20 text-center hover:bg-gray-600 rounded-3xl">
              {/* <Link href="/login">{cookies['login']?
              
                'Sign out' : 'Sign in'
              }</Link> */}
              {cookies['login']? <button onClick={handleLogin}>Sign out</button>: <Link href='/login'>Sign in</Link>}
              </div>
            <div className="  m-2 w-20 text-center hover:bg-gray-600 rounded-3xl"><Link href="/register">Register</Link></div>
          </div>
      </div>
    </>
    )
}