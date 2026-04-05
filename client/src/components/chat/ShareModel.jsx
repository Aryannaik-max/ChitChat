import { useChat } from '../../context/ChatContext';

const ShareModel = ({ setShare }) => {
    const { activeRoom } = useChat();
    const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
    });
};

    return (
            <div className="fixed inset-0 bg-[#0B1426]/80 backdrop-blur-md flex items-center justify-center z-50 transition-all">
              <div className="bg-[#0F172A] w-[440px] p-8 rounded-3xl border border-white/10 shadow-2xl relative">
                <button className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition" onClick={() => setShare(false)}>✕</button>
                <h2 className="text-2xl font-bold text-white mb-2">Invite Friends</h2>
                <p className="text-sm text-gray-400 mb-6">Share this exclusive link to let others join your server.</p>
                <div className="flex gap-2">
                  <input
                    value={activeRoom ? `${window.location.origin}/invite/${activeRoom.invite_link}` : ""}
                    readOnly
                    className="flex-1 bg-[#060913] border border-white/10 px-4 py-3.5 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-white/20 transition-colors"
                  />
                  <button 
                    onClick={() =>
                      copyToClipboard(`${window.location.origin}/invite/${activeRoom.invite_link}`)
                    }
                    className="bg-[#6C63FF] hidden sm:block hover:bg-[#5A52D9] active:scale-95 transition-all text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-[#6C63FF]/20"
                  >
                    Copy
                  </button>
                </div>  
                <div className="flex gap-2 mt-2">
                  <input
                    value={activeRoom ? `${activeRoom.invite_link}` : ""}
                    readOnly
                    className="flex-1 bg-[#060913] border border-white/10 px-4 py-3.5 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-white/20 transition-colors"
                  />
                  <button 
                    onClick={() =>
                      copyToClipboard(activeRoom.invite_link)
                    }
                    className="bg-[#6C63FF] hidden sm:block hover:bg-[#5A52D9] active:scale-95 transition-all text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-[#6C63FF]/20"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )
}


export default ShareModel;


