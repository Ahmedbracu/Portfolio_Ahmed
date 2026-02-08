import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
// animation.json is fetched from public 
// Actually, in Vite, public assets are served at root. Lottie-react can take a URL or object. 
// If I move it to src/assets I can import it. 
// If it is in public, I can fetch it or just use the path string if the lib supports it, but lottie-react 'animationData' expects the JSON object.
// Better to move it to src/assets to import it directly as a module, or use fetch. 
// Importing from public/ is not possible via 'import'. 
// I will fetch it.

export function Loader({ onComplete }: { onComplete: () => void }) {
    const [animationData, setAnimationData] = useState<any>(null);

    useEffect(() => {
        fetch('/animation.json')
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(err => console.error("Failed to load animation", err));

        const timer = setTimeout(() => {
            onComplete();
        }, 2500); // 2.5 seconds loading time

        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!animationData) return <div className="min-h-screen bg-dark flex items-center justify-center"></div>;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark">
            <div className="w-64 h-64">
                <Lottie animationData={animationData} loop={true} />
            </div>
        </div>
    );
}
