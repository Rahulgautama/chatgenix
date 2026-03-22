import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getChatHistory, sendMessage, getAllUsers } from '../api';
import { useNavigate } from 'react-router-dom'; 

const ChatApp = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [showSidebar, setShowSidebar] = useState(true); // For Mobile Toggle

    const currentUser = useRef(localStorage.getItem('userMobile')).current;
    const scrollRef = useRef();
const navigate = useNavigate();
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await getAllUsers();
                setUsers(res.data.filter(u => u !== currentUser));
            } catch (err) { console.error(err); }
        };
        loadUsers();
    }, [currentUser]);

    const fetchMessages = useCallback(async () => {
        if (!selectedUser) return;
        try {
            const res = await getChatHistory(currentUser, selectedUser);
            const res2 = await getChatHistory(selectedUser, currentUser);
            const combined = [...res.data, ...res2.data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setMessages(prev => JSON.stringify(prev) === JSON.stringify(combined) ? prev : combined);
        } catch (err) { console.error(err); }
    }, [selectedUser, currentUser]);

    useEffect(() => {
        if (!selectedUser) return;
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [selectedUser, fetchMessages]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setMessages([]);
        setShowSidebar(false); // Hide sidebar on Mobile after selection
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            const res = await sendMessage({ senderId: currentUser, receiverId: selectedUser, messageText: newMessage });
            setMessages(prev => [...prev, res.data]);
            setNewMessage("");
        } catch (err) { alert("Error sending message"); }
    };

    return (
        <div className="container-fluid g-0 vh-100 overflow-hidden bg-light">
            <div className="row g-0 h-100 flex-nowrap">
                
                <div className={`col-12 col-md-4 col-lg-3 bg-white border-end d-flex flex-column h-100 ${!showSidebar && 'd-none d-md-flex'}`}>
    <div className="p-3 bg-primary text-white flex-shrink-0 d-flex justify-content-between align-items-center shadow-sm">
        <div className="d-flex align-items-center">
            <div 
                className="me-3" 
                style={{ cursor: 'pointer' }} 
                onClick={(e) => { e.preventDefault(); navigate('/'); }}
            >
                <i className="bi bi-house-door-fill fs-5"></i>
            </div>
            <div>
                <h6 className="mb-0 fw-bold">Chats</h6>
                <small className="opacity-75">{currentUser}</small>
            </div>
        </div>

        <button
            type="button"
            className="btn btn-link text-white p-0 shadow-none border-0"
            onClick={(e) => {
                e.preventDefault();
                localStorage.clear();
                navigate('/login'); // '/' के बजाय सीधा '/login' पर भेजें
            }}
            title="Logout"
        >
            <i className="bi bi-power fs-4"></i>
        </button>
    </div>

    {/* User List Area */}
    <div className="overflow-auto flex-grow-1 custom-scrollbar">
        {users.length > 0 ? (
            users.map(user => (
                <div key={user} onClick={() => handleUserSelect(user)}
                    className={`p-3 border-bottom d-flex align-items-center ${selectedUser === user ? 'bg-light' : ''}`}
                    style={{ cursor: 'pointer' }}>
                    <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3 fw-bold" style={{ width: '45px', height: '45px' }}>
                        {user.substring(0, 2)}
                    </div>
                    <div className="fw-bold text-dark">{user}</div>
                </div>
            ))
        ) : (
            <div className="text-center p-4 text-muted small">No contacts found</div>
        )}
    </div>
</div>


                {/* --- CHAT WINDOW --- */}
                <div className={`col-12 col-md-8 col-lg-9 d-flex flex-column h-100 ${showSidebar && 'd-none d-md-flex'}`} style={{ background: '#e5ddd5' }}>
                    {selectedUser ? (
                        <>
                            {/* Header with Back Button for Mobile */}
                            <div className="p-2 px-3 bg-white border-bottom shadow-sm flex-shrink-0 d-flex align-items-center">
                                <button className="btn d-md-none me-2 p-0" onClick={() => setShowSidebar(true)}>
                                    <i className="bi bi-arrow-left fs-4 text-success"></i>
                                </button>
                                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2 fw-bold" style={{ width: '35px', height: '35px' }}>{selectedUser.substring(0,2)}</div>
                                <h6 className="mb-0 fw-bold">{selectedUser}</h6>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-grow-1 overflow-auto p-3 p-md-4 d-flex flex-column custom-scrollbar">
                                {messages.map((msg, index) => {
                                    const isMe = msg.senderId === currentUser;
                                    return (
                                        <div key={index} className={`mb-2 d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                                            <div className={`p-2 px-3 shadow-sm ${isMe ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                                                style={{ maxWidth: '85%', borderRadius: isMe ? '15px 15px 0 15px' : '15px 15px 15px 0', fontSize: '0.9rem' }}>
                                                <div style={{ wordBreak: 'break-word' }}>{msg.messageText}</div>
                                                <div className="text-end small opacity-75 mt-1" style={{ fontSize: '0.65rem' }}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={scrollRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-2 p-md-3 bg-light border-top">
                                <form onSubmit={handleSend} className="d-flex gap-2">
                                    <input type="text" className="form-control rounded-pill border-0 shadow-sm px-3 px-md-4" 
                                        placeholder="Message..." value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)} />
                                    <button type="submit" className="btn btn-primary rounded-circle px-3"><i className="bi bi-send-fill"></i></button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="m-auto text-center p-3">
                            <i className="bi bi-chat-dots text-success display-1 opacity-25"></i>
                            <h4 className="text-muted mt-3">Select chat</h4>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatApp;
