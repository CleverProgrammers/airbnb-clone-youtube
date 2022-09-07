import { StarIcon } from '@heroicons/react/20/solid'
import { PencilIcon, TrashIcon, HeartIcon } from '@heroicons/react/24/outline'

function ListingItem({ id, connected, showReservedListing, location, country, distance, price, rating, imageURL, isReserved, reservation, removeListing, toggleEditListingModal, toggleReserveListingModal, unreserveListing }) {
    const formatNumber = (num=0) => {
        // console.log(num, "HERE")
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    const handleReserve = () => {
        if (isReserved) {
            unreserveListing()
            return
        }

        toggleReserveListingModal(true, id)
    }

    return (
        <div className="flex flex-col space-y-3 cursor-pointer">
            <div className="relative h-64 w-auto group">
                <img className="h-full w-full rounded-xl object-cover" src={imageURL} />

                {connected && (
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-150 absolute top-4 right-4 flex space-x-2">
                        <PencilIcon onClick={() => toggleEditListingModal(true,id)} className="w-6 h-6 text-white opacity-80" />
                        <TrashIcon onClick={() => removeListing(id)} className="w-6 h-6 text-white opacity-80" />
                        <HeartIcon onClick={handleReserve} className={`w-6 h-6 text-white  ${isReserved ? 'fill-red-500' : 'opacity-80'}`} />
                    </div>
                )}
            </div>
            <div>
                <div className="flex justify-between items-center">
                    <h3 className="font-medium">
                        {location}, {country}
                    </h3>
                    <div className="flex items-center space-x-1">
                        <StarIcon className="h-3 w-3" />
                        <p className="text-sm text-gray-800">{rating}</p>
                    </div>
                </div>
                <p className="text-sm font-light text-gray-600">{formatNumber(distance)} kilometers</p>
                {showReservedListing && <p className="text-sm font-light text-gray-600">{reservation}</p>}
                <p className="text-sm font-light text-gray-800 mt-2">
                    <span className="text-base font-medium">${formatNumber(price)}</span>
                    &nbsp;night
                </p>
            </div>
        </div>
    )
}
export default ListingItem