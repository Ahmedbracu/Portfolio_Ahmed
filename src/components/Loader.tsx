import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import animationData from '@/assets/animation.json';

export function Loader({ onComplete }: { onComplete: () => void }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 2500); // 2.5 seconds loading time

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark">
            <div className="w-64 h-64">
                <Lottie animationData={animationData} loop={true} />
            </div>
        </div>
    );
}
