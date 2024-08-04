export default function Sidebar(
    {showLearn,setShowLearn, showPlan, setShowPlan}:
        {
            showLearn:boolean|null,
            setShowLearn: (showLearn: boolean) => void,
            showPlan: boolean|null,
            setShowPlan: (showPlan: boolean) => void }
) {
    const buttonCss = (selected:boolean|null) => `inline-flex items-center px-4 py-3 rounded-lg w-full active:forest-green ` +  (selected ? `bg-forest-green text-white` : `bg-gray-50`)
    const iconCss = (selected:boolean|null) => `w-4 h-4 me-2 text-gray-500 ` + (selected ? `text-white` : ``)
    return (
        <ul className="flex-column space-y space-y-4 text-sm font-medium text-gray-500 md:me-4 mb-4 md:mb-0">
            <li>
                <a href="#"
                   className={buttonCss(showLearn)}
                   aria-current="page"
                   onClick={() => {
                       setShowLearn(true)
                       setShowPlan(false)
                   }}
                >
                    <svg className={iconCss(showLearn)} aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg"
                         fill="currentColor" viewBox="0 0 20 20">
                        <path
                            d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                    </svg>
                    Learn
                </a>
            </li>
            <li>
                <a href="#"
                   className={buttonCss(showPlan)}
                   onClick={() => {
                       setShowLearn(false)
                       setShowPlan(true)
                   }}>
                    <svg className={iconCss(showPlan)} aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                        <path
                            d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                    </svg>
                    Plan
                </a>
            </li>
        </ul>)
}