import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <SignUp />
    </div>
  )
}
