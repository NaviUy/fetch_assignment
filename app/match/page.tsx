'use client'

import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Dog from '../types/dog'
import { DogCard } from "../components/dog-card";
import Nav from "../components/nav";

export default function Match() {
    const params = useSearchParams();
    const router = useRouter();
    const id = params.get("id");
    const [dog, setDog] = useState<Dog>();

    const errorMessage = <div className="w-screen h-screen">
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex justify-center items-center flex-col h-full w-full p-4 text-center"
    >
        <h1 className="text-4xl font-bold my-8">Something went wrong! Try again!</h1>
        <button className='bg-white text-black p-4 rounded-2xl hover:bg-gray-300' onClick={() => router.push('/')}>Go Home</button>
    </motion.div>
</div>

    if(!id){
        return (
            errorMessage
        )
    }

    useEffect(() => {
        fetchDog();
    }, [])

    const fetchDog = async () => {
        try {
            let response = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify([id]),
                credentials: 'include'
            })

            if(response.status === 401){
                router.push('/login');
            }

            let data = await response.json();
            let dog = data[0]
            setDog(dog);
        } catch (error) {
            console.error("Error: ", error);
            return errorMessage
        }
    }

    return (
        <div className="w-screen h-screen">
            <Nav api={"https://frontend-take-home-service.fetch.com"} />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="flex flex-col justify-start items-center h-full w-full"
            >
                <h1 className="text-4xl font-bold my-8">The results are in!</h1>
                {dog && <motion.div initial={{ opacity: 0}} animate={{ opacity: 1}} transition={{ duration:1 }}>
                    <DogCard dog={dog} hideHeart={true} />
                </motion.div>}
                {dog && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}><h2 className='text-4xl font-bold my-8'>It's a match!</h2></motion.div>}
                {dog && <button className='bg-white text-black p-4 rounded-2xl hover:bg-gray-300' onClick={() => router.push('/')}>Try Again</button>}
            </motion.div>
        </div>
    )
}