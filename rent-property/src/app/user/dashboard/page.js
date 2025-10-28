// 'use client';

// import ProtectedRoute from '../../components/ProtectedRoute';
// import { useAuth } from '../../../context/AuthContext';
// import { useRouter } from 'next/navigation'


// function Button({ children, className = '', size = 'md', variant = 'default', onClick, ...props }) {
//   const base =
//     'inline-flex items-center justify-center whitespace-nowrap rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'
//   const sizes = { sm: 'px-3 py-2 text-sm h-9', md: 'px-4 py-2 text-base h-10'}
//   const variants = {
//     outline: 'border border-[#01F5FF] text-[#01F5FF] bg-transparent hover:bg-[#01F5FF] hover:text-slate-900 focus:ring-[#01F5FF]',
//     ghost: 'bg-transparent text-slate-900 hover:bg-slate-100 focus:ring-slate-300',
//   }
//   return (
//     <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} onClick={onClick} {...props}>
//       {children}
//     </button>
//   )}

// export default function Dashboard() {
//   const { logout, user } = useAuth();
//   const router = useRouter()

//   const handleLogout = () => {
//     logout()
//     document.cookie = "token=; path=/; max-age=0;"
//     router.push('/user/login')
//   }

//   return (
//     <ProtectedRoute role="user">
//       <div style={{ padding: '2rem' }}>
//         <h1>Welcome, khansa</h1>
//         {/* <h1>Welcome, {user.username}</h1> */}
//         <p>This is your local user dashboard.</p>

//          <Button
//            size="md"
//            variant="outline"
//             onClick={handleLogout}
//             className=""
//           >logout 
//           </Button>

//       </div>
//     </ProtectedRoute>
//   );
// }





'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';


export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  function Button({ children, className = '', size = 'md', variant = 'default', onClick, ...props }) {
  const base = 'inline-flex items-center justify-center whitespace-nowrap rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'
  const sizes = {  lg: 'px-6 py-3 text-lg h-12', md: 'px-4 py-2 text-base h-10'}
  const variants = {
    outline: 'border border-[#01F5FF] text-[#01F5FF] bg-transparent hover:bg-[#01F5FF] hover:text-slate-900 focus:ring-[#01F5FF]',
    ghost: 'bg-transparent text-slate-900 hover:bg-slate-100 focus:ring-slate-300',
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  )}


  return (
    <ProtectedRoute role="user">
      <div className="">
        <h1 className="text-2xl font-semibold mb-2">
          Welcome, {user?.email || 'User'} 
        </h1>
        <p className="text-gray-400 mb-4">
          This is your local user dashboard.
        </p>
        <Button
        size="lg"
        variant="outline"
        onClick={() => router.push('/admin/add-property')}
        className=" text-xl"
      >
        +
      </Button>


      </div>
    </ProtectedRoute>
  );
}
