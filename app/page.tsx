"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import Loader from "./components/loader";
import { DogCard } from "./components/dog-card";
import { motion } from "framer-motion";
import Nav from "./components/nav";
import Paginate from "./components/paginate";
import Filter from "./components/filter";
import Dog from './types/dog'

import { ToastContainer, toast } from 'react-toastify';

export default function Home() {


  const [search, setSearch] = useState({ resultIds: [], total: 0, next: null, previous: null });
  const [dogs, setDogs] = useState<Dog[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page") || "1";
  const showNumberParam = searchParams.get("show") || "25";
  const sortParam = searchParams.get("sort") || "asc";
  const sortFieldParam = searchParams.get("sortField") || "name";
  const selectedBreeds = searchParams.getAll("breed") || [];
  const [loadState, setLoadState] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isFetching,  setIsFetching] = useState(false);
  const [likedDogsId, setLikedDogsId] = useState<string[]>([]);

  const api = "https://frontend-take-home-service.fetch.com";

  useEffect(() => {
    doSearch();
  }, []);

  useEffect(() => {
    setDogs([]);
    doSearch();
  }, [searchParams])

  async function fetchDogs(ids: Array<String>) {
    try {
      const response = await fetch(`${api}/dogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(ids),
      });

      const data: Dog[] = await response.json();
      setDogs(data);
      setIsFetching(false);
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  async function doSearch() {
    try {
      const showNumber = parseInt(showNumberParam);
      const from = (parseInt(pageParam) - 1) * showNumber;
      const selectedBreedsQuery = selectedBreeds.map(breed => `breeds=${breed}`).join('&');
      const url =`${api}/dogs/search?size=${showNumber}&from=${from}&sort=${sortFieldParam.toLowerCase()}:${sortParam.toLowerCase()}${selectedBreeds.length > 0 ? '&' + selectedBreedsQuery : ''}`;

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        router.push("/login");
      }

      const data = await response.json();
      setSearch(data);
      setIsFetching(true);
      await fetchDogs(data.resultIds);
      setLoadState(false);
      setIsFirstLoad(false);
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  const likedDogHandler = (id: string) => {
    if(likedDogsId.length >= 100) {
      toast.error("You can only like up to 100 dogs.");
      return;
    }

    if(likedDogsId.includes(id)) {
      setLikedDogsId(likedDogsId.filter(likedId => likedId !== id));
      return;
    }
    setLikedDogsId([...likedDogsId, id]);
  }

  const findMyMatch = async () => {
    try {
      const response = await fetch(`${api}/dogs/match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(likedDogsId),
      });

      const data = await response.json();
      router.push(`/match?id=${data.match}`);
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  return (
    <div className={`flex flex-col items-center ${loadState ? 'justify-center' : 'justify-start' } min-h-screen w-screen`}>
      {!isFirstLoad && <Nav api={api} />}
      <div className="pb-20">
        {!isFirstLoad ? (
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl text-white text-center">Meet the dogs!</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-auto flex-wrap py-8 md:max-w-[1280px]">
              {dogs.map((dog, index) => (
                <motion.div key={dog.id} initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{ duration: 0.5, delay: index > 5 ? 0.5 : index * 0.1 }}>
                  <DogCard dog={dog} likedDogHandler={likedDogHandler} active={likedDogsId.includes(dog.id)} />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          dogs.length === 0 && !isFetching && !isFirstLoad && <p className="text-2xl text-white">No dogs found.</p>
        )}
        {dogs.length > 0 && search.total > parseInt(showNumberParam) && <Paginate page={parseInt(pageParam)} total={search.total} />}
        {!isFirstLoad && likedDogsId.length > 0 && <div className="fixed h-[56] bottom-4 right-20 flex justify-center items-center text-white bg-purple-700 px-4 rounded-full font-medium cursor-pointer" onClick={() => {
          findMyMatch();
        }}>Find My Match</div>}
        {!isFirstLoad && <Filter />}
      </div>
      {loadState && <Loader />}
      <ToastContainer position={"bottom-center"} />
    </div>
  );
}
