import * as anchor from '@project-serum/anchor'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { AIRBNB_PROGRAM_PUBKEY } from '../constants'
import airbnbIDL from '../constants/airbnb.json'
import { SystemProgram } from '@solana/web3.js'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey'
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { authorFilter } from '../utils'
import { PublicKey } from '@solana/web3.js'
import { set } from 'date-fns'
import { tr } from 'date-fns/locale'


// Static data that reflects the todo struct of the solana program


export function useAirbnb() {
    const { connection } = useConnection()
    const { publicKey } = useWallet()
    const anchorWallet = useAnchorWallet()

    const [initialized, setInitialized] = useState(false)
    const [user,setUser] = useState({})
    const [airbnbs, setAirbnbs] = useState([])
    const [bookings, setBookings] = useState([])
    const [lastAirbnb, setLastAirbnb] = useState(0)
    const [lastBookId,setLastBookId] = useState(0)
    const [loading, setLoading] = useState(false)
    const [transactionPending, setTransactionPending] = useState(false)

    // const program = new PublicKey(
    //     "8ktkADKMec8BE1q47k6LnMWqYpNTjqtinZ6ng219wMwf"
    //   );
    
    const program = useMemo(() => {
        if (anchorWallet) {
            const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions())
            return new anchor.Program(airbnbIDL, AIRBNB_PROGRAM_PUBKEY, provider)
        }
    }, [connection, anchorWallet])


      useEffect(()=> {

        const start = async () => {
            if (program && publicKey && !transactionPending) {
                try {
                    const [profilePda, profileBump] = await findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
                    const profileAccount = await program.account.userProfile.fetch(profilePda)
                    console.log(profileAccount)
                    if (profileAccount) {
                        setLastAirbnb(profileAccount.lastAirbnb)
                        setInitialized(true)
                        setLoading(true)

   
                        const listings =  await program.account.airbnbAccount.all();
                        const allBookings =  await program.account.bookingAccount.all();
                        setUser(profileAccount.toString())
                        setAirbnbs(listings)

                        const myBookings = allBookings.filter(booking=> booking.account.authority.toString() == profileAccount.authority.toString())

                        setBookings(myBookings)
                    } else {
                        setInitialized(false)
                    }
                } catch (error) {
                    console.log(error)
                    setInitialized(false)
                } finally {
                    setLoading(false)
                }
            }
        
        }

        start()

    },[publicKey,program, transactionPending])

    const initializeUser = async () => {
        if (program && publicKey) {
            try {
                setTransactionPending(true)
                setLoading(true)
                const [profilePda] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)

                const tx = await program.methods
                    .initializeUser()
                    .accounts({
                        userProfile: profilePda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc()
                setInitialized(true)
                toast.success('Successfully initialized user.')
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
                setTransactionPending(false)
            }
        }
    }

    const addAirbnb = async ({location, country, price, imageURL}) => {
        console.log(location,country,imageURL,price, "YOOO" )
        if (program && publicKey) {
            setTransactionPending(true)
            setLoading(true)
            try {
                const [profilePda] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
                const [airbnbPda] = findProgramAddressSync([utf8.encode('AIRBNB_STATE'), publicKey.toBuffer(), Uint8Array.from([lastAirbnb])], program.programId)

                console.log(publicKey.toString(), program.programId, profilePda.toString(), airbnbPda.toString(), lastAirbnb)

                await program.methods
                    .addAirbnb(location, country, price, imageURL)
                    .accounts({
                        userProfile: profilePda,
                        airbnbAccount: airbnbPda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc()
                toast.success("SUCCESSFULLY ADDED A LISTING")
            } catch (error) {
                console.error(error)
            }  finally {
                setTransactionPending(false)
                setLoading(false)
            }
        }
    }

    const updateAirbnb = async ({airbnbPda, airbnbIdx,location, country, price, imageURL}) => {
        console.log(airbnbPda.toString())
        if (program && publicKey) {
            try {
                setLoading(true)
                setTransactionPending(true)
                const [profilePda] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)

                await program.methods
                    .updateAirbnb(airbnbIdx,location, country, price, imageURL)
                    .accounts({
                        userProfile: profilePda,
                        airbnbAccount: airbnbPda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc()
                    toast.success('Successfully EDIT AIRBNB.')
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
                setTransactionPending(false)
            }
        }
    }

    const editListing = ({ publicKey, idx, location, country, price, description, imageURL }) => {
        console.log(publicKey,idx, location, country, price, description, imageURL, "YAY" )
    }

    const removeAirbnb = async (airbnbPda, airbnbIdx) => {
        if (program && publicKey) {
            try {
                setTransactionPending(true)
                setLoading(true)
                const [profilePda, profileBump] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
                console.log(airbnbPda.toString(), airbnbIdx, publicKey.toString(), profilePda.toString())
                await program.methods
                    .removeAirbnb(airbnbIdx)
                    .accounts({
                        userProfile: profilePda,
                        airbnbAccount: airbnbPda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc()
                toast.success("Deleted listing")
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
                setTransactionPending(false)
            }
        }
    }

    const bookAirbnb = async ({location, country, price, image},date) => {
        console.log(location, country, price, image, "BETTT")

        const id = lastBookId + 1 
        if (program && publicKey) {
            try {
                setLoading(true)
                setTransactionPending(true)
                const [profilePda] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
                const [bookPda] = findProgramAddressSync([utf8.encode('BOOK_STATE'), publicKey.toBuffer()], program.programId)
                console.log(profilePda)
                await program.methods
                    .bookAirbnb(id,date,location, country, price, image)
                    .accounts({
                        userProfile: profilePda,
                        bookingAccount: bookPda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc()
                toast.success("SUCCESSFULLY BOOOOOKED")
                setLastBookId(id)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
                setTransactionPending(false)
            }
        }
    }

    const cancelBooking = async (bookingPda,idx) => {
        console.log("RUNNING")
        if (program && publicKey) {
            try {
                setLoading(true)
                setTransactionPending(true)
                const [profilePda] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
                await program.methods
                    .cancelBooking(idx)
                    .accounts({
                        userProfile: profilePda,
                        bookingAccount: bookingPda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc()
                toast.success("Canceled Booking")
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
                setTransactionPending(false)
            }
        }
    }

    // const removeListing = (listingID) => {
    //     setListings(listings.filter((listing) => listing.id !== listingID))
    // }

    // const addListing = ({ location, country, price, description, imageURL }) => {
    //     const id = listings.length + 1

    //     setListings([
    //         ...listings,
    //         {
    //             id,
    //             location: {
    //                 name: location,
    //                 country: country,
    //             },
    //             description,
    //             distance: {
    //                 km: 0,
    //             },
    //             price: {
    //                 perNight: price,
    //             },
    //             rating: 5,
    //             imageURL,
    //         },
    //     ])
    // }


    return { airbnbs, bookings, addAirbnb,updateAirbnb, removeAirbnb,bookAirbnb, cancelBooking, initializeUser , initialized , loading, transactionPending}
}
