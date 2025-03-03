import Image from "next/image";
import LoginForm from '../components/login-form';

export default function Login() {
  return (
    <div className="grid items-center justify-items-center min-h-screen md:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="h-full w-full flex flex-col md:flex-row gap-8 md:gap-0 items-center sm:items-start">
        <div className="hidden md:block md:w-[50%] lg:w-[60%] md:h-full md:relative md:rounded-l-3xl overflow-hidden">
          <Image src='/login-photo-large.png' className="object-cover" fill alt="dog-logo" />
        </div>
        <div className="w-full h-full md:w-[50%] lg:w-[40%] bg-white flex flex-col items-center p-4 md:rounded-r-3xl">
          <Image src='/fetch-dog-logo-dark.svg'  width={500} height={500} alt="dog-logo" />
          <h1 className="text-black text-3xl font-sans my-4 flex-grow">Pet Matcher</h1>
          <div id='login-container' className="text-black mb-20 flex flex-col gap-8 w-full">
            <div className="flex flex-col gap-2 justify-center items-center">
              <h2 className='text-2xl'>Welcome back!</h2>
              <p className="text-xs text-gray-400">Please enter your details</p>
            </div>
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}
