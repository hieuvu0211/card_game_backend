import { useCookies } from 'react-cookie'
import Link from 'next/link';
export default function HeaderBar() {
  const [cookies, removeCookie] = useCookies(['login'])
  const sign_out = () => {
    removeCookie('login')
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
              {cookies['login']?
                <button onClick={sign_out}>Sign out</button> : <Link href="/login">Sign in</Link>
              }
              </div>
            <div className="  m-2 w-20 text-center hover:bg-gray-600 rounded-3xl"><Link href="/register">Register</Link></div>
          </div>
      </div>
    </>
    )
}