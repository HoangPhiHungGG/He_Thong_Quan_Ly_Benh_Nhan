// import React from 'react'
// import { Button } from './ui/button'
// import Image from 'next/image'


// interface ButtonProps  {
//   isLoading?: boolean
//   className?: string
//   children: React.ReactNode
// }

// const SubmitButton = ({isLoading,className, children}:ButtonProps) => {
//   return (
//     <Button type="submit" disabled={isLoading} className={className ??
//         'shad-primary-btn w-full'}>
//         {isLoading ? (
//             <div className="flex items-center gap-4">
//                 <Image 
//                     src="/assets/icons/loader.svg"
//                     alt='loader'
//                     width={24}
//                     height={24}
//                     className='animate-spin'
//                 />
//                 Loading ... 
//             </div>
//         ): children}
//     </Button>
//   )
// }

// export default SubmitButton


// components/SubmitButton.tsx

import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

interface ButtonProps {
  isLoading?: boolean
  className?: string
  children: React.ReactNode
}

const SubmitButton = ({ isLoading, className, children }: ButtonProps) => {
  return (
    <Button type="submit" disabled={isLoading} className={className ?? 'shad-primary-btn w-full'}>
      {isLoading ? (
        <div className="flex items-center gap-2">
          {/* Một spinner đơn giản */}
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang xử lý...
        </div>
      ) : children}
    </Button>
  )
}

export default SubmitButton