import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FilterMenu from '../components/FilterMenu'
import Listings from '../components/Listing/Listings'
import { useMemo, useState,useEffect } from 'react'
import listingsData from '../data/Listings'
import AddListingModal from '../components/Listing/AddListingModal'
import EditListingModal from '../components/Listing/EditListingModal'
import ReserveListingModal from '../components/Listing/ReserveListingModal'
import { format } from 'date-fns'


export default function Home() {
    const connected = true
    const [showReservedListing, setShowReservedListing] = useState(false)
    const [listings, setListings] = useState(listingsData)
    const [addListingModalOpen, setAddListingModalOpen] = useState(false)
    const [editListingModalOpen, setEditListingModalOpen] = useState(false)
    const [reserveListingModalOpen, setReserveListingModalOpen] = useState(false)
    const [currentEditListingID, setCurrentEditListingID] = useState(null)
    const [currentReserveListingID, setCurrentReserveListingID] = useState(null)
    const currentEditListing = useMemo(() => listings.find((listing) => listing.id === currentEditListingID), [currentEditListingID])
    const displayListings = useMemo(() => (showReservedListing ? listings.filter((listing) => listing.isReserved) : listings), [showReservedListing, listings])
    
    const toggleShowReservedListing = () => {
        setShowReservedListing(!showReservedListing)
    }
    const addListing = ({ location, country, price, description, imageURL }) => {
        console.log({ location, country, price, description, imageURL })
        const id = listings.length + 1
        setListings([
            ...listings,
            {
                id,
                location:   location,
                country: country,
                description,
                distance:0,
                price: price,
                rating: 5,
                imageURL,
            },
        ])
    }

    const toggleEditListingModal = (value, listingID) => {
        setCurrentEditListingID(listingID)

        setEditListingModalOpen(value)
    }

    const editListing = ({ id, location, country, price, description, imageURL }) => {
        setListings(
            listings.map((listing) => {
                console.log(listing.location)
                if (listing.id === id) {
                    return {
                        ...listing,
                        location:  location || listing.location.name,
                        country: country || listing.location.country,
                        description: description || listing.description,
                        distance: listing.distance.km,
                        price:price || listing.price.perNight,
                        imageURL: imageURL || listing.imageURL,
                        distance: listing.distance,
                    }
                }
                return listing
            })
        )
    }
    const removeListing = (listingID) => {
        setListings(listings.filter((listing) => listing.id !== listingID))
    }

    const toggleReserveListingModal = (value, listingID) => {
        setCurrentReserveListingID(listingID)

        setReserveListingModalOpen(value)
    }

    const reserveListing = ({ startDate, endDate }) => {
        const formattedStartDate = format(new Date(startDate), 'MMM d')
        const formattedEndDate = format(new Date(endDate), 'MMM d')
        const range = `${formattedStartDate} - ${formattedEndDate}`
        setListings(
            listings.map((listing) => {
                if (listing.id === currentReserveListingID) return { ...listing, isReserved: true, reservation: range }
                return listing
            })
        )
    }

    const unreserveListing = () => {
        setListings(
            listings.map((listing) => {
                if (listing.id === currentReserveListingID) return { ...listing, isReserved: false, reservation: null }

                return listing
            })
        )
    }

    return (
        <div>
            <Head>
                <title>Airbnb Clone</title>
            </Head>
            <Header connected={connected}/>
            <main className="pt-10 pb-20">
                <FilterMenu />
                {connected && (
                    <div className="px-20 pb-10 flex justify-end space-x-4">
                        <button onClick={toggleShowReservedListing} className="border rounded-lg p-4 text-xs font-medium">
                            {showReservedListing ? 'Reserved' : 'All'}
                        </button>
                        <button onClick={() => setAddListingModalOpen(true)} className="border rounded-lg p-4 text-xs font-medium">
                            Add Listing
                        </button>
                    </div>
                )}

                <Listings connected={connected} showReservedListing={showReservedListing} listings={displayListings} toggleEditListingModal={toggleEditListingModal} toggleReserveListingModal={toggleReserveListingModal} removeListing={removeListing} unreserveListing={unreserveListing} />

                <AddListingModal addListing={addListing} addListingModalOpen={addListingModalOpen} setAddListingModalOpen={setAddListingModalOpen} />
                <EditListingModal editListing={editListing} currentEditListing={currentEditListing} editListingModalOpen={editListingModalOpen} setEditListingModalOpen={setEditListingModalOpen} />
                <ReserveListingModal reserveListing={reserveListing} reserveListingModalOpen={reserveListingModalOpen} setReserveListingModalOpen={setReserveListingModalOpen} />
            </main>
            <Footer />
        </div>
    )
}