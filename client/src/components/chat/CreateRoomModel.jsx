import { useState } from 'react';
import { useChat } from '../../context/ChatContext';
const CreateRoomModel = ({ setCreateRoom, groupStep, setGroupStep, handleJoinViaCode }) => {
    const { createGroup } = useChat();
    const [joinRoom, setJoinRoom] = useState('');
    const [groupName, setGroupName] = useState('');
    const [joiningViaCode, setJoiningViaCode] = useState(false);
    const handleCreateGroup = async () => {
        try {
            const room = await createGroup(groupName);
            setGroupName('');
            setCreateRoom(false);
            setGroupStep(1);
        } catch (err) {
            console.log(err);
        }
        };

    return (
        <div className="fixed inset-0 bg-[#0B1426]/80 backdrop-blur-md flex items-center justify-center z-50">
                <div className="bg-[#0F172A] w-[440px] p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                    <button
                    className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
                    onClick={() => { setCreateRoom(false); setGroupStep(1); }}
                    >✕</button>

                    {/* STEP 1 */}
                    {groupStep === 1 && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold text-center text-white mb-2">Create or Join</h2>
                        <p className="text-gray-400 text-sm text-center mb-8 px-4">
                        Your server is where you and your friends hang out. Make yours or join one.
                        </p>

                        <div className="space-y-6">
                        <div className="bg-[#1E293B]/50 p-5 rounded-2xl border border-white/5">
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Have an invite code?</label>
                            <div className='flex gap-2'>
                            <input
                                type='text'
                                placeholder='Enter invite code'
                                value={joinRoom}
                                onChange={(e) => setJoinRoom(e.target.value)}
                                className='bg-[#060913] px-4 py-3 rounded-xl flex-1 outline-none text-white focus:ring-2 focus:ring-[#6C63FF]/50 border border-white/5 transition-all'
                            />
                            <button
                                className='px-6 py-3 bg-[#6C63FF] text-white font-semibold rounded-xl hover:bg-[#5A52D9] active:scale-95 transition-all disabled:opacity-50 shadow-md'
                                onClick={handleJoinViaCode}
                                disabled={joiningViaCode || !joinRoom.trim()}
                            >
                                {joiningViaCode ? "Joining..." : "Join"}
                            </button>
                            </div>
                        </div>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-white/5"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-bold uppercase tracking-widest">OR</span>
                            <div className="flex-grow border-t border-white/5"></div>
                        </div>

                        <button
                            className="w-full bg-[#1E293B] hover:bg-white/10 border border-white/5 text-white font-semibold py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 group"
                            onClick={() => setGroupStep(2)}
                        >
                            <span>Create My Own Server</span>
                            <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                        </div>
                    </div>
                    )}

                    {/* STEP 2 */}
                    {groupStep === 2 && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold text-center text-white mb-2">Customize your server</h2>
                        <p className="text-gray-400 text-sm text-center mb-8">Give your new server a personality with a name.</p>
                        
                        <div className="mb-8">
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Server Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Gamer's Paradise"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full bg-[#060913] border border-white/5 px-4 py-3.5 rounded-xl text-white outline-none focus:border-[#6C63FF]/50 focus:ring-2 focus:ring-[#6C63FF]/20 transition-all text-sm font-medium"
                        />
                        </div>

                        <div className="flex gap-3">
                        <button 
                            onClick={() => setGroupStep(1)} 
                            className="flex-1 py-3.5 bg-transparent hover:bg-white/5 rounded-xl text-gray-300 hover:text-white font-semibold transition-all"
                        >
                            Back
                        </button>
                        <button 
                            onClick={handleCreateGroup} 
                            disabled={!groupName.trim()}
                            className="flex-[2] py-3.5 bg-[#6C63FF] text-white font-semibold rounded-xl hover:bg-[#5A52D9] active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-[#6C63FF]/20"
                        >
                            Create Server
                        </button>
                        </div>
                    </div>
                    )}
                </div>
                </div>

    )
}

export default CreateRoomModel;


