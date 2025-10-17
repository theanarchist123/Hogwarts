import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <SignIn />
    </div>
  )
}
