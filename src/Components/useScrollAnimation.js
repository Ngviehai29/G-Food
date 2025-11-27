import { useState, useEffect, useRef } from "react";

export function useScrollAnimation(threshold = 0.2) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect(); // ✨ Tắt observer ngay sau khi thấy -> hết nhấp nháy
                }
            },
            { threshold }
        );

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, [threshold]);

    return { ref, visible };
}
