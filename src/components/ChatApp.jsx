import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getMyContacts, addContact, getChatHistory, sendMessage } from '../api';
import { useNavigate } from 'react-router-dom';

const ChatApp = () => {
    const [contacts, setContacts] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    
    // ✅ States for New Contact
    const [newContactMobile, setNewContactMobile] = useState("");
    const [newContactName, setNewContactName] = useState(""); 
    
    const [showSidebar, setShowSidebar] = useState(true);
    const currentUser = useRef(localStorage.getItem('userMobile')).current;
    const navigate = useNavigate();
    const scrollRef = useRef();

    const loadContacts = useCallback(async () => {
        try {
            const res = await getMyContacts(currentUser);
            setContacts(res.data);
        } catch (err) { console.error(err); }
    }, [currentUser]);

    useEffect(() => { loadContacts(); }, [loadContacts]);

    const handleSelectUser = (contact) => {
        if (!contact.isRegistered) {
            alert(`Invite ${contact.displayName || contact.contactMobile} to ChatGenix!`);
            return;
        }
        setSelectedUser(contact.contactMobile);
        setShowSidebar(false);
    };

    const handleAddContact = async (e) => {
        e.preventDefault();
        if (newContactMobile.length !== 10) return alert("Enter 10 digits");
        try {
            await addContact({ 
                ownerMobile: currentUser, 
                contactMobile: newContactMobile,
                displayName: newContactName || newContactMobile // ✅ Send Name
            });
            setShowModal(false);
            setNewContactMobile("");
            setNewContactName("");
            loadContacts();
        } catch (err) { alert(err.response?.data || "Failed"); }
    };

    // ... fetchMessages and handleSend logic remains same as previous turn ...
    const fetchMessages = useCallback(async () => {
        if (!selectedUser) return;
        const res = await getChatHistory(currentUser, selectedUser);
        const res2 = await getChatHistory(selectedUser, currentUser);
        const combined = [...res.data, ...res2.data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setMessages(prev => JSON.stringify(prev) === JSON.stringify(combined) ? prev : combined);
    }, [selectedUser, currentUser]);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [selectedUser, fetchMessages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            const res = await sendMessage({ senderId: currentUser, receiverId: selectedUser, messageText: newMessage });
            setMessages(prev => [...prev, res.data]);
            setNewMessage("");
        } catch (err) { alert("Error"); }
    };

    return (
        <div className="container-fluid g-0 vh-100 overflow-hidden bg-light">
            <div className="row g-0 h-100 flex-nowrap">
                
                {/* --- SIDEBAR --- */}
                <div className={`col-12 col-md-4 col-lg-3 bg-white border-end d-flex flex-column h-100 ${!showSidebar && 'd-none d-md-flex'}`}>
                    <div className="p-3 bg-primary text-white d-flex justify-content-between align-items-center shadow-sm">
                        <h5 className="mb-0 fw-bold">Chats</h5>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light btn-sm rounded-circle" onClick={() => setShowModal(true)}>
                                <i className="bi bi-person-plus-fill text-primary"></i>
                            </button>
                            <button className="btn btn-link text-white p-0" onClick={() => {localStorage.clear(); navigate('/login')}}>
                                <i className="bi bi-power fs-5"></i>
                            </button>
                        </div>
                    </div>

                    <div className="overflow-auto flex-grow-1 custom-scrollbar">
                        {contacts.map(c => (
                            <div key={c.contactMobile} onClick={() => handleSelectUser(c)}
                                className={`p-2 border-bottom d-flex align-items-center ${selectedUser === c.contactMobile ? 'bg-light' : ''}`}
                                style={{ cursor: 'pointer', opacity: c.isRegistered ? 1 : 0.7 }}>
                                <div className={`rounded-circle text-white d-flex align-items-center justify-content-center me-3 fw-bold shadow-sm ${c.isRegistered ? 'bg-primary' : 'bg-secondary'}`} style={{ width: '48px', height: '48px' }}>
                                    {(c.displayName || c.contactMobile).substring(0, 1).toUpperCase()}
                                </div>
                                <div className="flex-grow-1 text-truncate">
                                    {/* ✅ Show Name Bold and Number Small */}
                                    <div className="fw-bold text-dark text-truncate">{c.displayName || c.contactMobile}</div>
                                    <span className="text-muted small">{c.contactMobile}</span>
                                    {!c.isRegistered && (
                                        <div className="mt-1 d-flex gap-2 align-items-center">
                                            <small className="text-danger fw-bold">Not Registered</small>
                                            <a href={`sms:${c.contactMobile}?body=Join ChatGenix!`} onClick={(e)=>e.stopPropagation()} className="btn btn-outline-primary btn-sm py-0 px-2 fw-bold" style={{fontSize:'9px'}}>INVITE</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- CHAT AREA --- */}
                <div className={`col-12 col-md-8 col-lg-9 d-flex flex-column h-100 ${showSidebar && 'd-none d-md-flex'}`} style={{ background: '#e5ddd5' }}>
                    {selectedUser ? (
                        <>
                            <div className="p-2 px-3 bg-white border-bottom shadow-sm d-flex align-items-center">
                                <button className="btn d-md-none me-2 p-0" onClick={() => setShowSidebar(true)}>
                                    <i className="bi bi-arrow-left fs-4 text-primary"></i>
                                </button>
                                <h6 className="mb-0 fw-bold">{contacts.find(c => c.contactMobile === selectedUser)?.displayName || selectedUser}</h6>
                            </div>

                            <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column custom-scrollbar">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`mb-2 d-flex ${msg.senderId === currentUser ? 'justify-content-end' : 'justify-content-start'}`}>
                                        <div className={`p-2 px-3 shadow-sm ${msg.senderId === currentUser ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                                            style={{ maxWidth: '75%', borderRadius: msg.senderId === currentUser ? '15px 15px 0 15px' : '15px 15px 15px 0' }}>
                                            <div>{msg.messageText}</div>
                                            <div className="text-end small opacity-75 mt-1" style={{ fontSize: '0.6rem' }}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={scrollRef} />
                            </div>

                            <div className="p-3 bg-light border-top flex-shrink-0">
                                <form onSubmit={handleSend} className="d-flex gap-2">
                                    <input type="text" className="form-control rounded-pill border-0 shadow-sm px-4" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                                    <button type="submit" className="btn btn-primary rounded-circle px-3"><i className="bi bi-send-fill text-white"></i></button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="m-auto text-center opacity-25"><i className="bi bi-whatsapp display-1 text-primary"></i><h4 className="mt-3">Start Chatting with Chatgenix</h4></div>
                    )}
                </div>
            </div>

            {/* --- ✅ ADD CONTACT MODAL WITH NAME --- */}
            {showModal && (
                <div 
    className="modal show d-block d-flex align-items-center justify-content-center" 
    style={{ 
        backgroundColor: 'rgba(0,0,0,0.6)', 
        backdropFilter: 'blur(4px)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1050
    }}
>
    <div 
        className="modal-dialog modal-dialog-centered border-0" 
        style={{ 
            maxWidth: '350px', 
            width: '95%', // Ensures it doesn't hit screen edges on small phones
            margin: 'auto' 
        }}
    >
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="modal-header bg-primary text-white border-0 py-3">
                <h6 className="modal-title fw-bold">New Contact</h6>
                <button 
                    type="button" 
                    className="btn-close btn-close-white shadow-none" 
                    onClick={() => setShowModal(false)}
                ></button>
            </div>
            
            <form onSubmit={handleAddContact}>
                <div className="modal-body p-4">
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-muted">Contact Name</label>
                        <input 
                            type="text" 
                            className="form-control bg-light border-0 shadow-none py-2" 
                            placeholder="Enter Name" 
                            value={newContactName} 
                            onChange={(e) => setNewContactName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="form-label small fw-bold text-muted">Mobile Number</label>
                        <input 
                            type="tel" // Changed to tel for mobile number pad
                            className="form-control bg-light border-0 shadow-none py-2" 
                            placeholder="9382***" 
                            value={newContactMobile} 
                            onChange={(e) => setNewContactMobile(e.target.value.replace(/\D/g, ''))} 
                            maxLength="10" 
                            required 
                        />
                    </div>
                </div>
                
                <div className="modal-footer border-0 p-4 pt-0">
                    <button 
                        type="submit" 
                        className="btn btn-primary rounded-pill w-100 fw-bold shadow-sm py-2"
                    >
                        Add Contact
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

            )}
        </div>
    );
};

export default ChatApp;
