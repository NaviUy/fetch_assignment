import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Dropdown from "./dropdown";

export default function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [breeds, setBreeds] = useState<string[]>([]);
  const sort = searchParams.get("sort") || "asc";
  const sortBy = searchParams.get("sortField") || "name";
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>(searchParams.getAll("breed") || []);

  useEffect(() => {
    fetchBreeds();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.delete("breed");

    selectedBreeds.forEach(breed => {
        params.append("breed", breed);
    })

    router.push(`?${params.toString()}`);
  }, [selectedBreeds])

  const fetchBreeds = async () => {
    try{
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        const data = await response.json();
        setBreeds(data);
    } catch(error) {
      console.error(error);
    }
  }

  const orderByClickHandler = (sortValue: string) => {
    setOpenModal(false);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.set("sort", sortValue);
    router.push(`?${params.toString()}`);
  };

  const sortByClickHandler = (sortValue: string) => {
    setOpenModal(false);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.set("sortField", sortValue);
    router.push(`?${params.toString()}`);
  }

  const selectedBreedHandler = (breed: string) => {
    if(selectedBreeds.includes(breed)) {
        const filteredBreeds = selectedBreeds.filter(selectedBreed => selectedBreed !== breed);
        setSelectedBreeds(filteredBreeds);
    } else {
        setSelectedBreeds([...selectedBreeds, breed]);
    }
  };

  return (
    <div>
      <motion.div
        animate={openModal ? "open" : "closed"}
        variants={{
          open: {
            opacity: 1,
            y: "var(--translate-to)",
            pointerEvents: "auto",
          },
          closed: {
            opacity: 0,
            y: "var(--translate-from)",
            pointerEvents: "none",
          },
        }}
        transition={{ duration: 0.125, bounce: "var(--bounce)" }}
        className="fixed z-40 bg-white h-[50%] md:h-72 md:w-96
            rounded-t-2xl md:rounded-2xl bottom-0 right-0 md:bottom-20
            md:right-20 w-full shadow-2xl [--translate-from:100%] [--translate-to:0%] [--bounce:0]
            md:[--translate-from:0%] md:[--translate-to:0%] md:[--bounce:1]"
      >
        <div className="p-8 h-full">
          <div className="grid grid-cols-2 grid-rows-5 md:grid-rows-3 gap-2 h-full">
            <Dropdown label={'Sort By'} selectedValue={sortBy} handler={sortByClickHandler} options={['name', 'breed', 'age']} closeDropdownOnClick={true}  />
            <Dropdown label={'Order By'} selectedValue={sort} handler={orderByClickHandler} options={['asc', 'desc']} closeDropdownOnClick={true} />
            <Dropdown label={'Select Breed'} selectedValue={selectedBreeds} handler={selectedBreedHandler} options={breeds} closeDropdownOnClick={false} containerStyles={'col-span-2 row-start-2 row-span-2 h-full'} />
          </div>
        </div>
      </motion.div>
      {openModal && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setOpenModal(false)}></div>}
      <div className="fixed bottom-4 right-4 w-14 h-14">
        <button
          onClick={() => {
            setOpenModal(!openModal);
          }}
          className="h-full w-full bg-purple-700 hover:bg-purple-800 rounded-full shadow-2xl shadow-slate-500 cursor-pointer"
        >
          <Image src="/filter.svg" fill alt="filters" className="p-4 invert" />
        </button>
      </div>
    </div>
  );
}
