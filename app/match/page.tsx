"use client";
export const dynamic = "force-dynamic";

import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import Dog from "../types/dog";
import { DogCard } from "../components/dog-card";
import Nav from "../components/nav";

export default function Match() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");
  const [dog, setDog] = useState<Dog>();

  const errorMessage = useMemo(() => (
    <div className="w-screen h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex justify-center items-center flex-col h-full w-full p-4 text-center"
      >
        <h1 className="text-4xl font-bold my-8">Something went wrong! Try again!</h1>
        <button
          className="bg-white text-black p-4 rounded-2xl hover:bg-gray-300"
          onClick={() => router.push("/")}
        >
          Go Home
        </button>
      </motion.div>
    </div>
  ), [router]);


  const fetchDog = useCallback(async () => {
    try {
      const response = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([id]),
        credentials: "include",
      });

      if (response.status === 401) {
        router.push("/login");
      }

      const data = await response.json();
      const dog = data[0];
      setDog(dog);
    } catch (error) {
      console.error("Error: ", error);
      return errorMessage;
    }
  }, [id, router, errorMessage]);

  useEffect(() => {
    if (!id) {
      return;
    }
    fetchDog();
  }, [fetchDog, id]);

  if (!id) {
    return errorMessage;
  }

  return (
    <div className="w-screen h-screen">
      <Nav api={"https://frontend-take-home-service.fetch.com"} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="flex flex-col justify-start items-center h-full w-full">
        <h1 className="text-4xl font-bold my-8">The results are in!</h1>
        {dog && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <DogCard dog={dog} hideHeart={true} />
          </motion.div>
        )}
        {dog && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <h2 className="text-4xl font-bold my-8">{"It's a match!"}</h2>
          </motion.div>
        )}
        {dog && (
          <button className="bg-white text-black p-4 rounded-2xl hover:bg-gray-300" onClick={() => router.push("/")}>
            Try Again
          </button>
        )}
      </motion.div>
    </div>
  );
}
