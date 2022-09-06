import { GlobeAmericasIcon } from '@heroicons/react/24/solid'

function Footer() {
    return (
        <div className="flex justify-between items-center px-20 py-3 border border-t-[#DDDDDD] fixed bottom-0 left-0 right-0 bg-white">
            <div className="flex items-center space-x-6">
                <p className="text-sm font-light">© 2022 Airbnb, Inc.</p>
                <p className="text-sm font-light">Privacy</p>
                <p className="text-sm font-light">Terms</p>
                <p className="text-sm font-light">Sitemap</p>
                <p className="text-sm font-light">Destinations</p>
            </div>

            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                    <GlobeAmericasIcon className="h-5 w-5 transition-all duration-300 text-gray-800" />
                    <p className="text-sm font-light">English (US)</p>
                </div>
                <div className="flex space-x-2">
                    <p className="text-sm font-light">RM</p>
                    <p className="text-sm font-light">MYR</p>
                </div>
                <div>
                    <p className="text-sm font-light">Support & resources</p>
                </div>
            </div>
        </div>
    )
}

export default Footer
