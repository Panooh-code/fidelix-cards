import React, { useState, useEffect, useRef } from 'react';

// --- URLs dos Ativos ---
const logoUrlLight = 'https://i.imgur.com/ieOEeBc.png';
const logoUrlDark = 'https://i.imgur.com/ZaW7mB9.png';
const heroImageUrl = 'https://i.imgur.com/04PS8vY.jpg';
const step1ImageUrl = 'https://i.imgur.com/MyXAUvz.png';
const step2ImageUrl = 'https://i.imgur.com/jlg2DHs.png';
const step3ImageUrl = 'https://i.imgur.com/8Txds6i.png';
const mascotImageUrl = 'https://i.imgur.com/EY1zGPQ.png';

// --- Ícones como Componentes ---

const SunIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>);
const MoonIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>);
const MenuIcon = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>);
const XIcon = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const ChevronDownIcon = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>);
const SmartphoneSimpleIcon = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><rect x="7" y="2" width="10" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12" y2="18" /></svg>);
const ClockIcon = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>);
const StoreIcon = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>);
const WhatsappIcon = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 12c0 1.74.524 3.363 1.435 4.744l-1.435 4.516 4.661-1.22A8.948 8.948 0 0012 20.25z" /></svg>);
const ReturnIcon = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15l-6-6m0 0l6-6m-6 6h12a6 6 0 010 12h-3" /></svg>);
const UserCircleIcon = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const PawIcon = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 11.5C6.32843 11.5 7 12.1716 7 13C7 13.8284 6.32843 14.5 5.5 14.5C4.67157 14.5 4 13.8284 4 13C4 12.1716 4.67157 11.5 5.5 11.5Z M10.5 10.5C11.3284 10.5 12 11.1716 12 12C12 12.8284 11.3284 13.5 10.5 13.5C9.67157 13.5 9 12.8284 9 12C9 11.1716 9.67157 10.5 10.5 10.5Z M14.5 10.5C15.3284 10.5 16 11.1716 16 12C16 12.8284 15.3284 13.5 14.5 13.5C13.6716 13.5 13 12.8284 13 12C13 11.1716 13.6716 10.5 14.5 10.5Z M19.5 11.5C20.3284 11.5 21 12.1716 21 13C21 13.8284 20.3284 14.5 19.5 14.5C18.6716 14.5 18 13.8284 18 13C18 12.1716 18.6716 11.5 19.5 11.5Z M12 15C14.4853 15 16.5 17.0147 16.5 19.5C16.5 20.8807 15.3807 22 14 22C12.6193 22 11.5 20.8807 11.5 19.5C11.5 18.1193 10.3807 17 9 17C7.61929 17 6.5 18.1193 6.5 19.5C6.5 20.8807 5.38071 22 4 22C2.61929 22 1.5 20.8807 1.5 19.5C1.5 17.0147 3.51472 15 6 15H12Z" /></svg>);

// Social Media Icons
const TwitterIcon = ({className}) => (<svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>);
const InstagramIcon = ({className}) => (<svg className={className} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 8.118a4.182 4.182 0 100 8.364 4.182 4.182 0 000-8.364zM12 14.85a2.85 2.85 0 110-5.7 2.85 2.85 0 010 5.7zM16.838 7.162a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" clipRule="evenodd" /></svg>);
const FacebookIcon = ({className}) => (<svg className={className} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>);


// --- Componentes ---

function Logo({ theme }) {
    const logoSrc = theme === 'dark' ? logoUrlDark : logoUrlLight;
    const altText = theme === 'dark' ? 'Logo do Fidelix em fundo escuro' : 'Logo do Fidelix em fundo branco';
    return (
        <img 
            className="h-9 w-auto" 
            src={logoSrc} 
            alt={altText}
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/150x40/FFFFFF/1E1B4B?text=Fidelix'; }}
        />
    );
}

function ThemeToggle({ theme, toggleTheme }) {
    return (
        <div className="flex items-center gap-2">
            <SunIcon className={`w-5 h-5 ${theme === 'light' ? 'text-fidelix-yellow-dark' : 'text-gray-500'}`} />
            <button
                type="button"
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-fidelix-purple focus:ring-offset-2 dark:focus:ring-offset-fidelix-purple-darkest ${theme === 'dark' ? 'bg-fidelix-purple' : 'bg-gray-200'}`}
                role="switch"
                aria-checked={theme === 'dark'}
            >
                <span className="sr-only">Use setting</span>
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}
                />
            </button>
            <MoonIcon className={`w-5 h-5 ${theme === 'dark' ? 'text-fidelix-purple-light' : 'text-gray-400'}`} />
        </div>
    );
}

function FaqItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 dark:border-gray-700 py-6">
            <dt>
                <button onClick={() => setIsOpen(!isOpen)} className="flex w-full items-start justify-between text-left text-gray-900 dark:text-white">
                    <span className="text-base font-semibold leading-7">{question}</span>
                    <span className="ml-6 flex h-7 items-center">
                        <ChevronDownIcon className={`h-6 w-6 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </span>
                </button>
            </dt>
            {isOpen && (
                <dd className="mt-2 pr-12">
                    <p className="text-base leading-7 text-gray-600 dark:text-gray-300">{answer}</p>
                </dd>
            )}
        </div>
    );
}

function InteractiveCard({ card, isIdle }) {
    const cardRef = useRef(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const wasDragged = useRef(false);

    useEffect(() => {
        let flipTimeout, resetTimeout;
        if (isIdle && cardRef.current) {
            const randomDelay = Math.random() * 1000;
            flipTimeout = setTimeout(() => {
                if (!cardRef.current) return;
                setIsFlipped(true);
                resetTimeout = setTimeout(() => setIsFlipped(false), 2000);
            }, randomDelay);
        }
         return () => {
            clearTimeout(flipTimeout);
            clearTimeout(resetTimeout);
        };
    }, [isIdle]);

    const handleInteractionMove = (clientX, clientY) => {
        if (!cardRef.current) return;
        wasDragged.current = true;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = (clientX - left - width / 2) / 8; 
        const y = (clientY - top - height / 2) / 8;
        const flipRotation = isFlipped ? 180 : 0;
        cardRef.current.style.transform = `rotateY(${x + flipRotation}deg) rotateX(${-y}deg)`;
    };

    const handleMouseMove = (e) => handleInteractionMove(e.clientX, e.clientY);
    const handleTouchMove = (e) => e.touches.length > 0 && handleInteractionMove(e.touches[0].clientX, e.touches[0].clientY);

    const handleInteractionEnd = () => {
        if (!cardRef.current) return;
        const flipRotation = isFlipped ? 180 : 0;
        cardRef.current.style.transform = `rotateY(${flipRotation}deg) rotateX(0deg)`;
        setTimeout(() => (wasDragged.current = false), 50);
    };
    
    const handleCardClick = (e) => {
        if (wasDragged.current) {
            e.preventDefault();
            return;
        }
        setIsFlipped(prev => !prev);
    };

    useEffect(() => {
        if (cardRef.current && !wasDragged.current) {
            const flipRotation = isFlipped ? 180 : 0;
            cardRef.current.style.transform = `rotateY(${flipRotation}deg) rotateX(0deg)`;
        }
    }, [isFlipped]);

    return (
        <li 
            className="card-container" 
            onMouseMove={handleMouseMove} 
            onMouseLeave={handleInteractionEnd}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleInteractionEnd}
            onClick={handleCardClick}
            onMouseDown={() => wasDragged.current = false}
        >
            <div className="card-inner" ref={cardRef}>
                <img src={card.front} alt={`Frente do cartão de fidelidade ${card.name}`} className="card-front" />
                <img src={card.back} alt={`Verso do cartão de fidelidade ${card.name}`} className="card-back" />
            </div>
        </li>
    );
}

function InteractiveCardGallery() {
    const cards = [
        { name: 'Pink Kat', front: 'https://i.imgur.com/rUEfVC6.png', back: 'https://i.imgur.com/WxtJWMd.png' },
        { name: 'Kappa Sushi', front: 'https://i.imgur.com/f9XSaMX.png', back: 'https://i.imgur.com/9iVsVuV.png' },
        { name: 'Barber Surf', front: 'https://i.imgur.com/d0p1J2a.png', back: 'https://i.imgur.com/rVtONjA.png' },
        { name: 'Café da Cida', front: 'https://i.imgur.com/nXqLLg2.png', back: 'https://i.imgur.com/5Sqza5E.png' },
        { name: 'Dr. Green', front: 'https://i.imgur.com/oTHMFJ6.png', back: 'https://i.imgur.com/DpbiXJH.png' },
        { name: 'Recicla Brasil', front: 'https://i.imgur.com/1edmvrH.png', back: 'https://i.imgur.com/WM9RRHV.png' },
        { name: 'Summer Peace', front: 'https://i.imgur.com/7ueUwNf.png', back: 'https://i.imgur.com/G7xnXhT.png' },
    ];
    const [isIdle, setIsIdle] = useState(false);
    const idleTimer = useRef(null);
    const scrollerRef = useRef(null);
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const resetIdleTimer = () => {
        setIsIdle(false);
        clearTimeout(idleTimer.current);
        idleTimer.current = setTimeout(() => setIsIdle(true), 3000); 
    };

    const handleMouseDown = (e) => {
        isDown.current = true;
        scrollerRef.current.dataset.dragging = 'true';
        startX.current = e.pageX - scrollerRef.current.offsetLeft;
        scrollLeft.current = scrollerRef.current.scrollLeft;
    };

    const handleMouseLeave = () => {
        isDown.current = false;
        scrollerRef.current.dataset.dragging = 'false';
    };

    const handleMouseUp = () => {
        isDown.current = false;
        scrollerRef.current.dataset.dragging = 'false';
    };

    const handleMouseMove = (e) => {
        if (!isDown.current) return;
        e.preventDefault();
        const x = e.pageX - scrollerRef.current.offsetLeft;
        const walk = (x - startX.current) * 2;
        scrollerRef.current.scrollLeft = scrollLeft.current - walk;
    };

    useEffect(() => {
        resetIdleTimer();
        const scroller = scrollerRef.current;
        if (scroller) {
            scroller.addEventListener('mousedown', handleMouseDown);
            scroller.addEventListener('mouseleave', handleMouseLeave);
            scroller.addEventListener('mouseup', handleMouseUp);
            scroller.addEventListener('mousemove', handleMouseMove);
        }
        return () => {
            clearTimeout(idleTimer.current);
            if (scroller) {
                scroller.removeEventListener('mousedown', handleMouseDown);
                scroller.removeEventListener('mouseleave', handleMouseLeave);
                scroller.removeEventListener('mouseup', handleMouseUp);
                scroller.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, []);
    
    return (
        <section className="py-16 sm:py-24 relative overflow-hidden bg-fidelix-gray-light dark:bg-fidelix-purple-darkest">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-white via-fidelix-purple/10 to-white dark:from-fidelix-purple-darkest dark:via-fidelix-purple/20 dark:to-fidelix-purple-darkest"></div>
                <div className="absolute inset-0 blur-3xl opacity-50 dark:opacity-70" style={{background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.6) 0%, rgba(124, 58, 237, 0) 60%)'}}></div>
            </div>
            <div className="relative z-10">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-poppins font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Cada card, uma história</h2>
                        <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">Construa comunidades de clientes fiéis!</p>
                    </div>
                </div>
                <div ref={scrollerRef} className="scroller mt-16 w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]" onMouseEnter={resetIdleTimer} onTouchStart={resetIdleTimer}>
                    <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-infinite-scroll">
                        {cards.map((card, index) => <InteractiveCard card={card} key={index} isIdle={isIdle && Math.random() > 0.5} />)}
                    </ul>
                    <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-infinite-scroll" aria-hidden="true">
                         {cards.map((card, index) => <InteractiveCard card={card} key={index + cards.length} isIdle={isIdle && Math.random() > 0.5} />)}
                    </ul>
                </div>
                <div className="mt-16 text-center">
                    <a href="#" className="rounded-xl px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-fidelix-purple to-fidelix-purple-light hover:scale-105 dark:text-fidelix-purple-darkest dark:bg-gradient-to-r dark:from-fidelix-yellow dark:to-yellow-400">Faça o seu card agora</a>
                    <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">Gratuito 💚 para sempre!</p>
                </div>
            </div>
        </section>
    );
}

function App() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemPrefersDark ? 'dark' : 'light';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]); 

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <div className="bg-fidelix-gray-light dark:bg-fidelix-purple-darkest text-gray-800 dark:text-gray-200 bg-transition overflow-x-hidden">
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <a href="#" className="-m-1.5 p-1.5">
                            <Logo theme={theme} />
                        </a>
                    </div>
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-400"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <span className="sr-only">Abrir menu principal</span>
                            <MenuIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        <a href="#how-it-works" className="text-sm font-semibold leading-6 text-gray-700 dark:text-gray-300">Como Funciona</a>
                        <a href="#benefits" className="text-sm font-semibold leading-6 text-gray-700 dark:text-gray-300">Benefícios</a>
                        <a href="#faq" className="text-sm font-semibold leading-6 text-gray-700 dark:text-gray-300">Dúvidas</a>
                        <a href="#" className="text-sm font-semibold leading-6 text-gray-700 dark:text-gray-300">Blog</a>
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-x-6">
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                        <a href="#" className="text-sm font-semibold leading-6 text-gray-700 dark:text-gray-300 pl-4">Entrar</a>
                    </div>
                </nav>
                {mobileMenuOpen && (
                    <div className="lg:hidden" role="dialog" aria-modal="true">
                        <div className="fixed inset-0 z-50" />
                        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-fidelix-gray-light dark:bg-fidelix-purple-darkest px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:sm:ring-gray-100/10">
                            <div className="flex items-center justify-between">
                                <a href="#" className="-m-1.5 p-1.5">
                                    <Logo theme={theme} />
                                </a>
                                <button
                                    type="button"
                                    className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="sr-only">Fechar menu</span>
                                    <XIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="mt-6 flow-root">
                                <div className="-my-6 divide-y divide-gray-500/10 dark:divide-gray-200/10">
                                    <div className="py-6">
                                        <a href="#" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-fidelix-gray-dark">Entrar/Sair</a>
                                        <a href="#" className="mt-2 -mx-3 block rounded-lg px-3 py-2.5 text-center text-base font-semibold leading-7 text-white bg-fidelix-purple hover:bg-fidelix-purple-dark dark:bg-fidelix-purple-light dark:text-fidelix-purple-darkest dark:hover:bg-fidelix-purple">Começar Grátis Agora</a>
                                    </div>
                                    <div className="space-y-2 py-6">
                                        <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-fidelix-gray-dark">Como Funciona</a>
                                        <a href="#benefits" onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-fidelix-gray-dark">Benefícios</a>
                                        <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-fidelix-gray-dark">FAQs</a>
                                        <a href="#" onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-fidelix-gray-dark">Blog</a>
                                    </div>
                                    <div className="py-6 flex justify-center">
                                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            <main>
                <section className="relative isolate pt-32 pb-12 sm:pt-40 sm:pb-16">
                   <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-fidelix-purple-light to-fidelix-purple-dark opacity-20 dark:opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
                    </div>
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <div className="flex justify-center">
                                <img loading="lazy" src={heroImageUrl} alt="Cartão de fidelidade digital Fidelix sendo usado no celular" className="w-[24rem] max-w-full drop-shadow-2xl" />
                            </div>
                            <h1 className="mt-10 text-4xl font-poppins font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">O <span className="bg-gradient-to-r from-fidelix-purple to-fidelix-purple-light text-transparent bg-clip-text">pulo do gato</span> para fidelizar seus clientes</h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">Crie seu cartão de fidelidade digital em menos de 1 minuto e aumente suas vendas com facilidade.</p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <a href="#" className="rounded-xl px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-fidelix-purple to-fidelix-purple-light hover:scale-105 dark:text-fidelix-purple-darkest dark:bg-gradient-to-r dark:from-fidelix-yellow dark:to-yellow-400">🐾 Começar Grátis Agora</a>
                            </div>
                        </div>
                    </div>
                </section>
                
                <InteractiveCardGallery />

                <section id="how-it-works" className="py-16 sm:py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-poppins font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Seu programa de fidelidade digital em 3 pulos 🐾</h2>
                        </div>
                        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-12 text-center lg:max-w-none md:grid-cols-3">
                            <div className="flex flex-col items-center">
                                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-fidelix-gray-light dark:bg-fidelix-gray-dark ring-8 ring-white dark:ring-fidelix-purple-darkest shadow-lg">
                                    <img loading="lazy" src={step1ImageUrl} alt="Interface do app Fidelix personalizando um cartão digital" className="h-24 w-24 object-contain"/>
                                </div>
                                <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">Crie</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Personalize seu cartão digital com sua logo, cores e recompensas.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-fidelix-gray-light dark:bg-fidelix-gray-dark ring-8 ring-white dark:ring-fidelix-purple-darkest shadow-lg">
                                    <img loading="lazy" src={step2ImageUrl} alt="Celular exibindo botão de compartilhamento do cartão Fidelix" className="h-24 w-24 object-contain"/>
                                </div>
                                <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">Compartilhe</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Envie para seus clientes via WhatsApp, QR Code ou redes sociais.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-fidelix-gray-light dark:bg-fidelix-gray-dark ring-8 ring-white dark:ring-fidelix-purple-darkest shadow-lg">
                                    <img loading="lazy" src={step3ImageUrl} alt="Cliente recebendo recompensa no cartão fidelidade Fidelix" className="h-24 w-24 object-contain"/>
                                </div>
                                <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">Fidelize</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Cada compra vira um selo. Juntou? Ganhou! Cliente feliz, negócio crescendo.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="benefits" className="py-16 sm:py-24 bg-fidelix-gray-light dark:bg-fidelix-gray-dark">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:text-center">
                            <h2 className="text-3xl font-poppins font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Por que usar o Fidelix?</h2>
                            <p className="sr-only">Fidelix é uma solução simples e digital para empreendedores fidelizarem clientes com cartões digitais, sem precisar de aplicativos ou carimbos físicos.</p>
                        </div>
                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                            <dl className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="flex flex-col items-center text-center lg:items-start lg:text-left"><SmartphoneSimpleIcon className="h-8 w-8 text-fidelix-purple dark:text-fidelix-purple-light" /><p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">100% digital, sem papel ou carimbos perdidos</p></div>
                                <div className="flex flex-col items-center text-center lg:items-start lg:text-left"><ClockIcon className="h-8 w-8 text-fidelix-purple dark:text-fidelix-purple-light" /><p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Criação em menos de 1 minuto</p></div>
                                <div className="flex flex-col items-center text-center lg:items-start lg:text-left"><StoreIcon className="h-8 w-8 text-fidelix-purple dark:text-fidelix-purple-light" /><p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Ideal para lanchonetes, salões, lojas e autônomos</p></div>
                                <div className="flex flex-col items-center text-center lg:items-start lg:text-left"><WhatsappIcon className="h-8 w-8 text-fidelix-purple dark:text-fidelix-purple-light" /><p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Compartilhável no WhatsApp</p></div>
                                <div className="flex flex-col items-center text-center lg:items-start lg:text-left"><ReturnIcon className="h-8 w-8 text-fidelix-purple dark:text-fidelix-purple-light" /><p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Seus clientes voltam mais vezes</p></div>
                                <div className="flex flex-col items-center text-center lg:items-start lg:text-left"><UserCircleIcon className="h-8 w-8 text-fidelix-purple dark:text-fidelix-purple-light" /><p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Seu cartão de fidelidade funciona como cartão de visitas</p></div>
                            </dl>
                        </div>
                    </div>
                </section>

                <section className="py-16 sm:py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <img loading="lazy" src={mascotImageUrl} alt="Mascote Gato Roxo Fidelix com expressão travessa e charmosa" className="mx-auto w-64 lg:w-80" />
                            <h2 className="mt-8 text-3xl font-poppins font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Conheça o Fidelix</h2>
                            <div className="mt-6 bg-white dark:bg-fidelix-gray-dark p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <p className="text-lg leading-8 text-gray-600 dark:text-gray-400">O Fidelix é livre e travesso como seu cliente, sempre dando voltas! Mas também um amigo fiel. Adora um petisco e outras recompensas!</p>
                                <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">Ele sabe tudo sobre fidelização e vai te guiar pelo app com dicas espertas pra bombar suas vendas.</p>
                            </div>
                            <h3 className="sr-only">Mascote Fidelix - especialista em fidelização digital para pequenos negócios</h3>
                        </div>
                    </div>
                </section>

                <section className="py-16 sm:py-24 bg-fidelix-gray-light dark:bg-fidelix-gray-dark">
                    <div className="mx-auto max-w-7xl px-6 text-center">
                        <h2 className="text-3xl font-poppins font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Crie seu card de fidelidade agora mesmo</h2>
                        <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">Sem complicação, sem papelada. Cartão de fidelidade + cartão de visitas do seu negócio, sempre à mão do seu cliente!</p>
                        <div className="mt-10">
                            <a href="#" className="inline-flex items-center gap-x-3 rounded-xl px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-fidelix-purple to-fidelix-purple-light hover:scale-105 dark:text-fidelix-purple-darkest dark:bg-gradient-to-r dark:from-fidelix-yellow dark:to-yellow-400">
                                Começar agora grátis
                            </a>
                        </div>
                    </div>
                </section>

                <section id="faq" className="py-16 sm:py-24">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <h2 className="text-center text-3xl font-poppins font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Perguntas Frequentes sobre o Fidelix</h2>
                        <dl className="mt-16 space-y-6">
                            <FaqItem 
                                question="É grátis usar o Fidelix?"
                                answer="Sim! Você pode começar gratuitamente e criar seu primeiro cartão sem pagar nada."
                            />
                            <FaqItem 
                                question="Preciso baixar algum aplicativo?"
                                answer="Não! O Fidelix funciona direto no navegador, tanto no celular quanto no computador."
                            />
                            <FaqItem 
                                question="Funciona para qualquer tipo de negócio?"
                                answer="Sim! Se você atende clientes com recorrência — como salão, loja, padaria, marmitex, pet shop ou qualquer outro — o Fidelix é pra você."
                            />
                        </dl>
                    </div>
                </section>
            </main>

            <footer className="bg-fidelix-gray-light dark:bg-fidelix-purple-darkest border-t border-gray-200 dark:border-gray-800">
                <div className="mx-auto max-w-7xl overflow-hidden px-6 py-10 sm:py-12 lg:px-8">
                    <div className="md:flex md:justify-between">
                        <div className="mb-6 md:mb-0">
                            <a href="#" className="flex items-center">
                                <img src={theme === 'dark' ? logoUrlDark : logoUrlLight} className="h-10 mr-3" alt="Fidelix Logo" />
                            </a>
                            <p className="mt-4 max-w-xs text-sm text-gray-500 dark:text-gray-400">O pulo do gato para fidelizar seus clientes.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Produto</h2>
                                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                    <li className="mb-4"><a href="#how-it-works" className="hover:underline">Como Funciona</a></li>
                                    <li><a href="#benefits" className="hover:underline">Benefícios</a></li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                    <li className="mb-4"><a href="#" className="hover:underline">Política de Privacidade</a></li>
                                    <li><a href="#" className="hover:underline">Termos &amp; Condições</a></li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Recursos</h2>
                                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                    <li className="mb-4"><a href="#faq" className="hover:underline">FAQ</a></li>
                                    <li><a href="#" className="hover:underline">Contato</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">&copy; 2024 <a href="#" className="hover:underline">Fidelix™</a>. Todos os direitos reservados.</span>
                        <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
                            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white"><FacebookIcon className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white"><InstagramIcon className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white"><TwitterIcon className="w-5 h-5" /></a>
                        </div>
                    </div>
                     <p className="sr-only">Fidelix é um app brasileiro criado para pequenos negócios que querem vender mais através de programas de fidelidade. Com ele, qualquer microempreendedor pode criar seu cartão de fidelidade digital e manter seus clientes voltando com recompensas simples.</p>
                </div>
            </footer>
        </div>
    );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
</script>
</body>
</html>

