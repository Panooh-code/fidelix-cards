import React from 'react';

const MascotSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <img
            loading="lazy"
            src="https://i.imgur.com/EY1zGPQ.png"
            alt="Mascote Gato Roxo Fidelix com expressão travessa e charmosa"
            className="mx-auto w-64 lg:w-80"
          />
          <h2 className="mt-8 text-3xl font-poppins font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Conheça o Fidelix
          </h2>
          <div className="mt-6 bg-white dark:bg-fidelix-gray-dark p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-lg leading-8 text-gray-600 dark:text-gray-400">
              O Fidelix é livre e travesso como seu cliente, sempre dando voltas! Mas também um amigo fiel. Adora um petisco e outras recompensas!
            </p>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Ele sabe tudo sobre fidelização e vai te guiar pelo app com dicas espertas pra bombar suas vendas.
            </p>
          </div>
          <h3 className="sr-only">
            Mascote Fidelix - especialista em fidelização digital para pequenos negócios
          </h3>
        </div>
      </div>
    </section>
  );
};

export default MascotSection;