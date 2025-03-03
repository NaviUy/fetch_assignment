"use client"

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from "next/navigation";

interface LoginFormInputs {
    name: string,
    email: string
}

interface FocusState {
    name: boolean,
    email: boolean
}

export default function LoginForm(){
    const router = useRouter();
    const [serverError, setServerError] = useState("");

    const {
        handleSubmit,
        register,
        formState: {errors, isSubmitting}
    } = useForm<LoginFormInputs>();

    const [focusState, setFocusState] = useState<FocusState>({
        name: false,
        email: false
    });

    const onSubmit = async (data: LoginFormInputs) => {
        try{
            const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
            })

            if (!response.ok) {
                const errorData = await response.json();
                setServerError(errorData.message || "Login failed");
                return;
            }

            router.back();
        } catch (error){
            console.error(error);
            setServerError("An error occurred during login.");
        }
    };

    return (
        <form className='flex flex-col gap-10 p-8' onSubmit={handleSubmit(onSubmit)}>
            <div className='relative'>
                {focusState.name && <label  className='mb-1 block text-sm font-medium text-black absolute -top-4' htmlFor='name'>Name</label>}
                <input id='name' type='text' placeholder='Name' className='w-full border-b-2 border-black p-2 text-sm text-black placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-0'
                autoComplete='off'
                onFocus={() => setFocusState((prev) => ({ ...prev, name: true }))}
                {...register("name", { required: "Name is required" })}
                onBlur={() => setFocusState((prev) => ({ ...prev, name: false }))}
                />
                {errors.name && (<p className="mt-1 text-xs text-red-600 absolute">{errors.name.message}</p>)}
            </div>
            <div className='relative mb-10'>
                {focusState.email && <label  className='mb-1 block text-sm font-medium text-black absolute -top-4' htmlFor='email'>Email</label>}
                <input id='email' type='email' placeholder='Email' className='w-full border-b-2 border-black p-2 text-sm text-black placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-0'
                onFocus={() => setFocusState((prev) => ({ ...prev, email: true }))}
                {...register("email", { required: "Email is required" })}
                onBlur={() => setFocusState((prev) => ({ ...prev, email: false }))}
                />
                {errors.email && (<p className="mt-1 text-xs text-red-600 absolute">{errors.email.message}</p>)}
            </div>
            {serverError && (<p className="text-red-600 text-sm text-center">{serverError}</p>)}
            <button type='submit' disabled={isSubmitting} className='bg-orange-500 text-white p-3 rounded-full text-sm hover:bg-black'>{isSubmitting ? "Logging in..." : "Login"}</button>
        </form>
    )
}