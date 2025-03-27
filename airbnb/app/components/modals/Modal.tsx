'use client';

import { useState, useEffect } from "react";

interface ModalProps {
    label: string;
    content: React.ReactElement;
    isOpen?: boolean;  // Optional, can be controlled from parent if needed
    close: ()=>void;
}

const Modal: React.FC<ModalProps> = ({
    label,
    content,
    isOpen = false,  // Default to false if not provided
    close,
}) => {
    const [showModal, setShowModal] = useState(isOpen);

    useEffect(() => {
        setShowModal(isOpen);  // Sync state with `isOpen` prop
    }, [isOpen]);

    // Close modal function
    const handleClose = () => {
        setShowModal(false);  // Close the modal
        close()
    };

    // If modal is not open, don't render anything
    if (!showModal) {
        return null;
    }

    return (
        <div className="flex items-center justify-center fixed inset-0 z-50 bg-black/60">
            <div className="relative w-[90%] md:w-[80%] lg:w-[700px] my-6 mx-auto h-auto">
                <div className={`translate duration-600 h-full ${showModal ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-10'}`}>
                    <div className="w-full h-auto rounded-xl relative flex flex-col bg-white">
                        <header className="h-[60px] flex items-center p-6 rounded-t justify-center relative border-b">
                            <div
                                onClick={handleClose}
                                className="p-3 absolute right-3 hover:bg-gray-300 rounded-full cursor-pointer"
                            >
                                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold">{label}</h2>
                        </header>

                        <section className="p-6">
                            {content}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
