import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import Dog from '../types/dog';

export function DogCard({ dog, likedDogHandler, active, hideHeart }: { dog: Dog, likedDogHandler?: (id: string) => void, active?: boolean, hideHeart?: boolean }) {
    return (
        <div className=" group relative flex flex-col items-center justify-center w-72 h-96 bg-white rounded-xl shadow-md p-4 cursor-pointer" onClick={() => {likedDogHandler?.(dog.id)}}>
            {!hideHeart && <div className={classNames('absolute top-4 right-4 text-gray-400 group-hover:text-gray-500', {'text-red-500 group-hover:text-red-600' : active})}><FontAwesomeIcon icon={faHeart} size="xl" /></div>}
            <Image src={dog.img} alt={dog.name} width={144} height={144} className="w-36 h-36 rounded-full object-cover" />
            <h2 className="text-xl font-bold my-4 text-black">{dog.name}</h2>
            <p className="text-sm text-gray-400">Age: {dog.age}</p>
            <p className="text-sm text-gray-400">Breed: {dog.breed}</p>
            <p className="text-xs text-gray-500 mt-2">Location: {dog.zip_code}</p>
        </div>
    );
}
