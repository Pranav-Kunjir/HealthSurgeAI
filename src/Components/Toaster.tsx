import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000); // Auto dismiss after 5s
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`pointer-events-auto min-w-[300px] p-4 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 animate-in slide-in-from-right duration-300 ${t.type === 'success' ? 'bg-white text-black' :
                                t.type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-black shrink-0 ${t.type === 'success' ? 'bg-lime-400 text-black' : 'bg-white text-black'
                            }`}>
                            <i className={`ph-bold ${t.type === 'success' ? 'ph-check' :
                                    t.type === 'error' ? 'ph-warning' : 'ph-info'
                                }`}></i>
                        </div>
                        <div className="font-bold text-sm">{t.message}</div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
