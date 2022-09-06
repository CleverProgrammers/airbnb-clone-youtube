import dynamic from 'next/dynamic'
import Head from 'next/head'
import '../styles/globals.css'


function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Airbnb Clone</title>
            </Head>
                <Component {...pageProps} />
        </>
    )
}

export default MyApp
