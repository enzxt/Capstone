interface SettingsOverlayProps {
    close: (val: boolean) => void
}

const SettingsOverlay = ({ close }: SettingsOverlayProps) => {

    const closeSettings = () => {
        //close settings
        close(false)
    }

    const toggleBg = () => {
        
    }

    return (
        <div className="z-10 w-screen h-screen fixed flex justify-center items-center text-white">
            <div className="w-5/6 bg-slate-500/30 h-5/6">
            <button onClick={closeSettings} className="absolute bottom-1 w-5/6 flex justify-center py-4 bg-slate-700">
                <div>
                    Close
                </div>
            </button>
            <div className="text-white text-3xl flex justify-center p-3">
                Preferences
            </div>
            <div>
                Cat Settings
            </div>
            <button onClick={toggleBg}>
                Rainbow Background
            </button>
            </div>
        </div>
    )
}

export default SettingsOverlay