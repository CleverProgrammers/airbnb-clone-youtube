import ListingItem from './ListingItem'

function Listings({ connected, showReservedListing, listings, toggleEditListingModal, toggleReserveListingModal, removeListing, unreserveListing }) {
    return (
        <div className="px-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {listings.map((listing) => (
                    // console.log(listing.account)
                    <ListingItem key={listing.account.idx} {...listing.account} publickey = {listing.publicKey} connected={connected} showReservedListing={showReservedListing} removeListing={removeListing} toggleEditListingModal={toggleEditListingModal} toggleReserveListingModal={toggleReserveListingModal} unreserveListing={unreserveListing} />
                ))}
            </div>
        </div>
    )
}

export default Listings
