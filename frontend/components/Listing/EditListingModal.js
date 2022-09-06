import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

export default function EditListingModal({ editListing, currentEditListing, editListingModalOpen, setEditListingModalOpen }) {
    const [location, setLocation] = useState('')
    const [country, setCountry] = useState('')
    const [price, setPrice] = useState(0)
    const [imageURL, setImageURL] = useState('')

    const closeModal = () => {
        setEditListingModalOpen(false)
    }

    const onEdit = (e) => {
        e.preventDefault()

        editListing({
            id: currentEditListing?.id,
            location,
            country,
            price,
            imageURL,
        })

        closeModal()
    }

    return (
        <Transition appear show={editListingModalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                    Edit Listing
                                </Dialog.Title>

                                <div className="mt-2">
                                    <div className="grid grid-cols-1 gap-3">
                                        <label className="flex flex-col border rounded-lg px-3 py-2" htmlFor="location">
                                            <span className="text-xs font-light">Location</span>
                                            <input placeholder={currentEditListing?.location} onChange={(e) => setLocation(e.target.value)} className="outline-none bg-transparent text-sm pt-1" type="text" id="location" name="location" />
                                        </label>

                                        <label className="flex flex-col border rounded-lg px-3 py-2" htmlFor="country">
                                            <span className="text-xs font-light">Country</span>
                                            <input placeholder={currentEditListing?.country} onChange={(e) => setCountry(e.target.value)} className="outline-none bg-transparent text-sm pt-1" type="text" id="country" name="country" />
                                        </label>

                                        <label className="flex flex-col border rounded-lg px-3 py-2" htmlFor="price">
                                            <span className="text-xs font-light">Price</span>
                                            <input placeholder={currentEditListing?.price} onChange={(e) => setPrice(e.target.value)} className="outline-none bg-transparent text-sm pt-1" type="number" id="price" name="price" />
                                        </label>

                                        <label className="flex flex-col border rounded-lg px-3 py-2" htmlFor="imageURL">
                                            <span className="text-xs font-light">Image URL</span>
                                            <input placeholder={currentEditListing?.imageURL} onChange={(e) => setImageURL(e.target.value)} className="outline-none bg-transparent text-sm pt-1" type="text" id="imageURL" name="imageURL" />
                                        </label>
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <button onClick={onEdit} type="button" className="border rounded-lg px-4 py-2 text-sm font-medium">
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}