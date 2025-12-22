import React, { useState, useEffect } from "react";

export default function SimpleSlideAnimation() {
    const images = [
        "../G-Food-Images/treemvungcao-3.webp",
        "../G-Food-Images/treemvungcao-4.webp",
        "../G-Food-Images/treemvungcao.jpg",
        "../G-Food-Images/treemvungcao-3.webp",
        "../G-Food-Images/treemvungcao-4.webp",
        "../G-Food-Images/treemvungcao.jpg",
    ];

    const [index, setIndex] = useState(0);

    // Tự động chạy
    useEffect(() => {
        const timer = setInterval(() => {
            next();
        }, 7000);

        return () => clearInterval(timer);
    }, []);

    const next = () => {
        setIndex((prev) => (prev + 1) % images.length);
    };

    const prev = () => {
        setIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="relative w-full h-64 overflow-hidden">

            {/* Khung chứa tất cả slide */}
            <div
                className="flex h-full transition-transform duration-500 ease-in-out"
                style={{
                    width: `${images.length * 100}%`,
                    transform: `translateX(-${index * 100}%)`,
                }}
            >
                {images.map((src, i) => (
                    <img
                        key={i}
                        src={src}
                        className="w-full h-full object-cover flex-shrink-0"
                        alt=""
                    />
                ))}
            </div>

            {/* Nút trái */}
            <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded"
            >
                {"<"}
            </button>

            {/* Nút phải */}
            <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded"
            >
                {">"}
            </button>
        </div>
    );
}

