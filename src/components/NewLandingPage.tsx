import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Smartphone, Clock, Store, MessageCircle, RotateCcw, UserCircle, Facebook, Instagram, Twitter } from 'lucide-react';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import InteractiveCardGallery from '@/components/InteractiveCardGallery';
import FaqSection from '@/components/FaqSection';
import MascotSection from '@/components/MascotSection';

const NewLandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-fidelix-gray-light dark:bg-fidelix-purple-darkest text-gray-800 dark:text-gray-200 transition-colors duration-300 overflow-x-hidden">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <Logo />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-400"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Abrir menu principal</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="#how-it-works" className="text-sm font-semibold leading-6 text-gray-700 dark:text-gray-300">
              Como Funciona
            </a>
            <a href="#benefits" className="text-sm font-semibold leading-6 text-gray-700 dark:text-gray-300">
              Benefícios
            </a>
            <a href="#faq" className="text-sm font-semibold leading-6 text-gray-700 dark:text-gray-300">
              Dúvidas
            </a>
            <a href="#" className="text-sm font-semibold leading-6 text-gray-700 dark:text-gray-300">
              Blog
            </a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-x-6">
            <ThemeToggle />
            <a href="#" className="text-sm font-semibold leading-6 text-gray-700 dark:text-gray-300 pl-4">
              Entrar
            </a>
          </div>
        </nav>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden" role="dialog" aria-modal="true">
            <div className="fixed inset-0 z-50" />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-fidelix-gray-light dark:bg-fidelix-purple-darkest px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:sm:ring-gray-100/10">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <Logo />
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Fechar menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10 dark:divide-gray-200/10">
                  <div className="py-6">
                    <a
                      href="#"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-fidelix-gray-dark"
                    >
                      Entrar/Sair
                    </a>
                    <a
                      href="#"
                      onClick={() => navigate('/wizard')}
                      className="mt-2 -mx-3 block rounded-lg px-3 py-2.5 text-center text-base font-semibold leading-7 text-white bg-fidelix-purple hover:bg-fidelix-purple-dark dark:bg-fidelix-purple-light dark:text-fidelix-purple-darkest dark:hover:bg-fidelix-purple"
                    >
                      Começar Grátis Agora
                    </a>
                  </div>
                  <div className="space-y-2 py-6">
                    <a
                      href="#how-it-works"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-fidelix-gray-dark"
                    >
                      Como Funciona
                    </a>
                    <a
                      href="#benefits"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-fidelix-gray-dark"
                    >
                      Benefícios
                    </a>
                    <a
                      href="#faq"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-fidelix-gray-dark"
                    >
                      FAQs
                    </a>
                    <a
                      href="#"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-fidelix-gray-dark"
                    >
                      Blog
                    </a>
                  </div>
                  <div className="py-6 flex justify-center">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative isolate pt-32 pb-12 sm:pt-40 sm:pb-16">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div 
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-fidelix-purple-light to-fidelix-purple-dark opacity-20 dark:opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" 
              style={{
                clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
              }}
            />
          </div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex justify-center">
                <img 
                  src="https://i.imgur.com/04PS8vY.jpg" 
                  alt="Cartão de fidelidade digital Fidelix sendo usado no celular" 
                  className="w-[24rem] max-w-full drop-shadow-2xl" 
                />
              </div>
              <h1 className="mt-10 text-4xl font-poppins font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                O <span className="bg-gradient-to-r from-fidelix-purple to-fidelix-purple-light text-transparent bg-clip-text">pulo do gato</span> para fidelizar seus clientes
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                Crie seu cartão de fidelidade digital em menos de 1 minuto e aumente suas vendas com facilidade.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <button
                  onClick={() => navigate('/wizard')}
                  className="rounded-xl px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-fidelix-purple to-fidelix-purple-light hover:scale-105 dark:text-fidelix-purple-darkest dark:bg-gradient-to-r dark:from-fidelix-yellow dark:to-accent-yellow-dark"
                >
                  🐾 Começar Grátis Agora
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Card Gallery */}
        <InteractiveCardGallery />

        {/* How it Works Section */}
        <section id="how-it-works" className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-poppins font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Seu programa de fidelidade digital em 3 pulos 🐾
              </h2>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-12 text-center lg:max-w-none md:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-fidelix-gray-light dark:bg-fidelix-gray-dark ring-8 ring-white dark:ring-fidelix-purple-darkest shadow-lg">
                  <img 
                    loading="lazy" 
                    src="https://i.imgur.com/MyXAUvz.png" 
                    alt="Interface do app Fidelix personalizando um cartão digital" 
                    className="h-24 w-24 object-contain"
                  />
                </div>
                <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">Crie</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Personalize seu cartão digital com sua logo, cores e recompensas.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-fidelix-gray-light dark:bg-fidelix-gray-dark ring-8 ring-white dark:ring-fidelix-purple-darkest shadow-lg">
                  <img 
                    loading="lazy" 
                    src="https://i.imgur.com/jlg2DHs.png" 
                    alt="Celular exibindo botão de compartilhamento do cartão Fidelix" 
                    className="h-24 w-24 object-contain"
                  />
                </div>
                <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">Compartilhe</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Envie para seus clientes via WhatsApp, QR Code ou redes sociais.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-fidelix-gray-light dark:bg-fidelix-gray-dark ring-8 ring-white dark:ring-fidelix-purple-darkest shadow-lg">
                  <img 
                    loading="lazy" 
                    src="https://i.imgur.com/8Txds6i.png" 
                    alt="Cliente recebendo recompensa no cartão fidelidade Fidelix" 
                    className="h-24 w-24 object-contain"
                  />
                </div>
                <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">Fidelize</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Cada compra vira um selo. Juntou? Ganhou! Cliente feliz, negócio crescendo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-16 sm:py-24 bg-fidelix-gray-light dark:bg-fidelix-gray-dark">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-3xl font-poppins font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Por que usar o Fidelix?
              </h2>
              <p className="sr-only">
                Fidelix é uma solução simples e digital para empreendedores fidelizarem clientes com cartões digitais.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                  <Smartphone className="h-8 w-8 text-fidelix-purple dark:text-fidelix-purple-light" />
                  <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                    100% digital, sem papel ou carimbos perdidos
                  </p>
                </div>
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                  <Clock className="h-8 w-8 text-fidelix-purple dark:text-fidelix-purple-light" />
                  <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Criação em menos de 1 minuto
                  </p>
                </div>
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                  <Store className="h-8 w-8 text-fidelix-purple dark:text-fidelix-purple-light" />
                  <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Ideal para lanchonetes, salões, lojas e autônomos
                  </p>
                </div>
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                  <MessageCircle className="h-8 w-8 text-fidelix-purple dark:text-fidelix-purple-light" />
                  <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Compartilhável no WhatsApp
                  </p>
                </div>
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                  <RotateCcw className="h-8 w-8 text-fidelix-purple dark:text-fidelix-purple-light" />
                  <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Seus clientes voltam mais vezes
                  </p>
                </div>
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                  <UserCircle className="h-8 w-8 text-fidelix-purple dark:text-fidelix-purple-light" />
                  <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Seu cartão de fidelidade funciona como cartão de visitas
                  </p>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Mascot Section */}
        <MascotSection />

        {/* CTA Section */}
        <section className="py-16 sm:py-24 bg-fidelix-gray-light dark:bg-fidelix-gray-dark">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2 className="text-3xl font-poppins font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Crie seu card de fidelidade agora mesmo
            </h2>
            <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
              Sem complicação, sem papelada. Cartão de fidelidade + cartão de visitas do seu negócio, sempre à mão do seu cliente!
            </p>
            <div className="mt-10">
              <button
                onClick={() => navigate('/wizard')}
                className="inline-flex items-center gap-x-3 rounded-xl px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-fidelix-purple to-fidelix-purple-light hover:scale-105 dark:text-fidelix-purple-darkest dark:bg-gradient-to-r dark:from-fidelix-yellow dark:to-accent-yellow-dark"
              >
                Começar agora grátis
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <footer className="bg-fidelix-gray-light dark:bg-fidelix-purple-darkest border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-10 sm:py-12 lg:px-8">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <a href="#" className="flex items-center">
                <Logo className="h-10 mr-3" />
              </a>
              <p className="mt-4 max-w-xs text-sm text-gray-500 dark:text-gray-400">
                O pulo do gato para fidelizar seus clientes.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Produto</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <a href="#how-it-works" className="hover:underline">Como Funciona</a>
                  </li>
                  <li>
                    <a href="#benefits" className="hover:underline">Benefícios</a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <a href="#" className="hover:underline">Política de Privacidade</a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">Termos &amp; Condições</a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Recursos</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <a href="#faq" className="hover:underline">FAQ</a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">Contato</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
              &copy; 2024 <a href="#" className="hover:underline">Fidelix™</a>. Todos os direitos reservados.
            </span>
            <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          <p className="sr-only">
            Fidelix é um app brasileiro criado para pequenos negócios que querem vender mais através de programas de fidelidade. Com ele, qualquer microempreendedor pode criar seu cartão de fidelidade digital e manter seus clientes voltando com recompensas simples.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NewLandingPage;