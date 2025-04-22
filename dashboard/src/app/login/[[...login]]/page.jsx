import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='flex items-center justify-center absolute translate-50'>
        <SignIn />
    </div>
  )
}