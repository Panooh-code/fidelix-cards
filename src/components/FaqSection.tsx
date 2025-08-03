import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-6">
      <dt>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-start justify-between text-left text-gray-900 dark:text-white"
        >
          <span className="text-base font-semibold leading-7">{question}</span>
          <span className="ml-6 flex h-7 items-center">
            <ChevronDown
              className={`h-6 w-6 transform transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </span>
        </button>
      </dt>
      {isOpen && (
        <dd className="mt-2 pr-12">
          <p className="text-base leading-7 text-gray-600 dark:text-gray-300">
            {answer}
          </p>
        </dd>
      )}
    </div>
  );
};

const FaqSection: React.FC = () => {
  const faqs = [
    {
      question: "É grátis usar o Fidelix?",
      answer: "Sim! Você pode começar gratuitamente e criar seu primeiro cartão sem pagar nada."
    },
    {
      question: "Preciso baixar algum aplicativo?",
      answer: "Não! O Fidelix funciona direto no navegador, tanto no celular quanto no computador."
    },
    {
      question: "Funciona para qualquer tipo de negócio?",
      answer: "Sim! Se você atende clientes com recorrência — como salão, loja, padaria, marmitex, pet shop ou qualquer outro — o Fidelix é pra você."
    }
  ];

  return (
    <section id="faq" className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <h2 className="text-center text-3xl font-poppins font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Perguntas Frequentes sobre o Fidelix
        </h2>
        <dl className="mt-16 space-y-6">
          {faqs.map((faq, index) => (
            <FaqItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </dl>
      </div>
    </section>
  );
};

export default FaqSection;