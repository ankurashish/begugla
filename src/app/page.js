"use client";
import { useEffect, useState, useRef } from "react";

const quotes = [
  "main character energy",
  "chronically online",
  "sleep is optional",
  "internet never sleeps",
];

const thoughts = [
  "this feels like an anime intro",
  "2am hits different",
  "reality is buffering",
  "music fixes everything",
];

export default function Home() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const images = ["/gallery/1.png", "/gallery/2.png"];
  const [contactOpen, setContactOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [quote, setQuote] = useState("");
  const [thought, setThought] = useState("");

  const audioRef = useRef(null);
  const playerRef = useRef(null);

  // random text
  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setThought(thoughts[Math.floor(Math.random() * thoughts.length)]);
  }, []);

  // 🎵 AUTO MUSIC (no button)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.15;

    const unlockAudio = () => {
      audio.play().catch(() => {});

      // try again after tiny delay (important on Vercel)
      setTimeout(() => {
        audio.play().catch(() => {});
      }, 200);

      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("mousemove", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };

    // wait for ANY interaction
    window.addEventListener("click", unlockAudio, { once: true });
    window.addEventListener("mousemove", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });
  }, []);

  // cursor glow
  useEffect(() => {
    const glow = document.getElementById("glow");
    const move = (e) => {
      if (!glow) return;
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("particles");
    const ctx = canvas.getContext("2d");

    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", (e) => {
      for (let i = 0; i < 4; i++) {
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          life: 40,
        });
      }
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        ctx.fillStyle = "rgba(168,85,247,0.7)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0) particles.splice(i, 1);
      });

      requestAnimationFrame(draw);
    };

    draw();

    return () => window.removeEventListener("resize", resize);
  }, []);

  // WASD movement
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const size = 96;
    const speed = 30;

    let x = window.innerWidth / 2 - size / 2;
    let y = window.innerHeight - 140;

    const update = () => {
      player.style.transform = `translate(${x}px, ${y}px)`;
    };

    const move = (e) => {
      if (e.key === "w") y -= speed;
      if (e.key === "s") y += speed;
      if (e.key === "a") x -= speed;
      if (e.key === "d") x += speed;

      x = Math.max(0, Math.min(window.innerWidth - size, x));
      y = Math.max(0, Math.min(window.innerHeight - size, y));

      update();
    };

    update();
    window.addEventListener("keydown", move);
    return () => window.removeEventListener("keydown", move);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden text-white">
      <canvas
        id="particles"
        className="fixed inset-0 pointer-events-none z-10"
      />

      {/* 🎵 MUSIC */}
      <audio ref={audioRef} src="/music/bgm.mp3" loop preload="auto" />

      {/* BACKGROUND */}
      <video
        src="/background/background.mp4"
        className="absolute inset-0 w-full h-full object-cover scale-110"
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="absolute inset-0 bg-black/60" />

      {/* GLOW */}
      <div
        id="glow"
        className="pointer-events-none fixed w-[500px] h-[500px]
        -translate-x-1/2 -translate-y-1/2
        rounded-full bg-purple-500 blur-[120px] opacity-30"
      />

      {/* FLOAT */}
      <img
        src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjZvZXEzZzQxcno1ZmQ3NjVxOGwycXRmdXM1bWxhcms0cWRqc3VtcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3VLajsSQMEMxvQQv8N/giphy.gif"
        className="absolute top-10 left-10 w-28 float brightness-90 contrast-125 opacity-80"
      />
      <img
        src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExczRsMDdnZno0NmI0cjE0d2Z5NjdlZTZpMHEzazc3YWdvajA5Z3E1ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RGyUJwAFjP38P3uEiV/giphy.gif"
        className="absolute bottom-25 right-20 w-32 floatSlow brightness-90 contrast-125 opacity-80"
      />

      {/* PLAYER */}
      <img
        ref={playerRef}
        src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmJ3MTV4bXowcW1waGJoa2hnbjhiYTl2cXFrYnY3dGQ4bXgyYXR6eCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/mhfqfSii6aBk3AUWY3/giphy.gif"
        className="absolute w-24 left-0 top-0"
      />

      {/* UI */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6 text-center">
        <div className="relative">
          <img
            src="https://cdn.discordapp.com/avatars/914184818487595079/dbbb2b7f06fffdff3a049dafbad9998a.webp?size=256"
            className="w-40 h-40 rounded-full border-4 border-purple-500 shadow-[0_0_40px_#a855f7]"
          />
          <span className="absolute bottom-3 right-3 w-6 h-6 bg-green-500 rounded-full border-4 border-black" />
        </div>

        <h1 className="text-6xl font-bold text-purple-400">beguglaa</h1>
        <p className="text-xl opacity-80">chronically online</p>

        <div className="flex gap-4 mt-4">
          <a
            href="https://discord.com/users/914184818487595079"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full bg-[#5865F2]"
          >
            Discord
          </a>
          <a
            href="https://www.instagram.com/ankurduke/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full bg-pink-500"
          >
            Instagram
          </a>
          <a
            href="https://www.ankurashish.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full bg-yellow-500"
          >
            Portfolio
          </a>
        </div>

        <div className="italic text-purple-300">"{quote}"</div>
        <div className="opacity-70">🧠 {thought}</div>

        <p className="text-sm opacity-60 text-black font-bold bg-gray-50">
          WASD to move
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        .float { animation: float 6s infinite ease-in-out; }
        .floatSlow { animation: float 10s infinite ease-in-out; }
      `}</style>
      {/* RIGHT SIDE MUSIC PLAYER */}
      <div className="absolute right-6 bottom-6 z-20 flex items-center gap-3 px-4 py-3 rounded-xl bg-black/40 backdrop-blur-md border border-purple-500/20 shadow-xl">
        <img
          src="https://i.ytimg.com/vi/h4VJGNNSQnw/maxresdefault.jpg"
          className="w-12 h-12 rounded-md"
        />

        <div className="text-left">
          <p className="text-xs text-purple-300">Now Playing</p>
          <p className="text-sm font-semibold leading-tight">
            I Really Want to Stay at Your House
          </p>
          <p className="text-xs opacity-70">Rosa Walton</p>
        </div>

        <div className="ml-2 text-green-400 animate-pulse">●</div>
      </div>
      {/* LEFT IMAGE SLIDER */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-30 flex">
        {/* toggle */}
        <button
          onClick={() => setGalleryOpen(!galleryOpen)}
          className="w-16 h-16 bg-purple-600 rounded-r-xl shadow-lg flex items-center justify-center"
        >
          🖼 Gallery
        </button>

        {/* sliding panel */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out
    ${galleryOpen ? "w-64 opacity-100" : "w-0 opacity-0"}`}
        >
          <div className="ml-3 p-3 bg-black/50 backdrop-blur-md rounded-xl border border-purple-500/20">
            {/* image */}
            <img
              src={images[currentImg]}
              onClick={() => setCurrentImg((currentImg + 1) % images.length)}
              className="w-56 h-56 object-cover rounded-xl cursor-pointer hover:scale-105 transition"
            />

            <p className="text-xs mt-2 opacity-60 text-center">
              click to change
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
