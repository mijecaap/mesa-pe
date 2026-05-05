import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  QrCode,
  MessageCircle,
  PenTool,
  Wallet,
  Megaphone,
  Check,
  ArrowRight,
  Star,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const metadata = {
  title: "Mesa.pe — Tu carta digital en 5 minutos",
  description:
    "Crea tu carta digital, genera un código QR y recibe pedidos por WhatsApp. Sin comisiones, sin apps. Ideal para restaurantes, cafeterías y negocios de comida en Perú.",
  openGraph: {
    title: "Mesa.pe — Tu carta digital en 5 minutos",
    description:
      "Crea tu carta digital, genera códigos QR y recibe pedidos por WhatsApp en minutos.",
    type: "website",
    locale: "es_PE",
  },
};

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#2A211E]">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#EDE6DE]/60 bg-[#FDF8F3]/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#2A211E]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C25E3A] text-white">
            <QrCode className="h-4 w-4" />
          </div>
          <span className="font-display text-xl font-semibold">Mesa.pe</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a
            href="#funciones"
            className="text-[#7D6F65] transition-colors hover:text-[#2A211E]"
          >
            Funciones
          </a>
          <a
            href="#precios"
            className="text-[#7D6F65] transition-colors hover:text-[#2A211E]"
          >
            Precios
          </a>
          <a
            href="#faq"
            className="text-[#7D6F65] transition-colors hover:text-[#2A211E]"
          >
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden text-sm font-medium text-[#7D6F65] transition-colors hover:text-[#2A211E] md:block"
          >
            Iniciar sesión
          </Link>
          <Link href="/sign-up">
            <Button className="rounded-full bg-[#C25E3A] px-5 text-white hover:bg-[#A3492D]">
              Empezar gratis
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/4 rounded-full bg-[#C25E3A]/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/3 translate-y-1/4 rounded-full bg-[#4A6B5D]/[0.04] blur-3xl" />

      <div className="container relative grid items-center gap-8 py-16 lg:grid-cols-2 lg:gap-12 lg:py-28">
        {/* Image first on mobile for visual punch */}
        <div className="relative order-1 lg:order-2 opacity-0-start animate-fade-in-up animation-delay-150">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-[2rem] lg:max-w-none lg:rounded-[2.5rem]">
            <Image
              src="/images/landing/hero.webp"
              alt="Mesa con platillos peruanos coloridos servidos en una mesa de madera rústica"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Warm overlay for cohesion */}
            <div className="absolute inset-0 bg-[#C25E3A]/5" />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-4 -left-4 z-10 rounded-2xl border border-[#EDE6DE] bg-white px-4 py-3 shadow-xl lg:-left-8">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4A6B5D]/10">
                <MessageCircle className="h-4 w-4 text-[#4A6B5D]" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#2A211E]">Pedido recibido</div>
                <div className="text-[10px] text-[#7D6F65]">vía WhatsApp</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative order-2 max-w-xl space-y-7 lg:order-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EDE6DE] bg-white/60 px-4 py-1.5 text-xs font-medium text-[#7D6F65] backdrop-blur-sm opacity-0-start animate-fade-in-up">
            <Star className="h-3.5 w-3.5 fill-[#C25E3A] text-[#C25E3A]" />
            Lanzamiento oficial en Perú
          </div>

          <h1 className="text-balance font-display text-[clamp(2.5rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-tight opacity-0-start animate-fade-in-up animation-delay-150">
            Tu{" "}
            <span className="text-[#C25E3A]">carta digital</span>{" "}
            lista antes de que se enfríe el café
          </h1>

          <p className="max-w-md text-lg leading-relaxed text-[#7D6F65] opacity-0-start animate-fade-in-up animation-delay-300">
            Crea tu menú online, compártelo con un QR y recibe pedidos directo
            a tu WhatsApp. Sin comisiones, sin complicaciones.
          </p>

          <div className="flex flex-wrap items-center gap-4 opacity-0-start animate-fade-in-up animation-delay-450">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="group rounded-full bg-[#C25E3A] px-8 text-white hover:bg-[#A3492D]"
              >
                Crear carta gratis
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/la-lucha-sangucheria">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-[#2A211E] px-8 text-[#2A211E] hover:bg-[#2A211E] hover:text-[#FDF8F3]"
              >
                Ver demo
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#7D6F65] opacity-0-start animate-fade-in-up animation-delay-600">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[#4A6B5D]" strokeWidth={3} />{" "}
              Sin tarjeta de crédito
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[#4A6B5D]" strokeWidth={3} />{" "}
              Setup en 5 minutos
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[#4A6B5D]" strokeWidth={3} />{" "}
              Cancela cuando quieras
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const images = [
    {
      src: "/images/landing/social-tacos.webp",
      alt: "Ceviche peruano servido en una mesa de madera rústica",
      label: "Restaurantes",
    },
    {
      src: "/images/landing/social-cafe.webp",
      alt: "Café pasado peruano servido en una taza de cerámica artesanal",
      label: "Cafeterías",
    },
    {
      src: "/images/landing/social-bar.webp",
      alt: "Interior cálido de un bar peruano con luz ámbar",
      label: "Bares y más",
    },
  ];

  return (
    <section className="border-y border-[#EDE6DE] bg-white py-16 lg:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="opacity-0-start animate-fade-in-up">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#C25E3A] uppercase">
              Hecho en Perú
            </span>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.15] tracking-tight">
              Para negocios de comida que{" "}
              <span className="text-[#C25E3A]">saben lo que hacen</span>
            </h2>
            <p className="mt-4 max-w-md text-[#7D6F65] leading-relaxed">
              Desde sangucherías en La Victoria hasta cafeterías en Miraflores.
              Mesa.pe entiende el ritmo de la cocina peruana.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 opacity-0-start animate-fade-in-up animation-delay-200">
            {images.map((img) => (
              <div key={img.label} className="group relative aspect-[3/4] overflow-hidden rounded-2xl">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A211E]/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-sm font-semibold text-white">
                  {img.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: QrCode,
      title: "QR instantáneo",
      description:
        "Genera tu código QR en segundos. Tus clientes escanean y ven tu carta al instante. Sin apps, sin esperas.",
      image: "/images/landing/feature-qr.webp",
      imageAlt:
        "Carta de restaurante con código QR visible sobre mesa de madera",
    },
    {
      icon: MessageCircle,
      title: "Pedidos por WhatsApp",
      description:
        "Los clientes confirman su orden y te llega directo a tu WhatsApp con todos los detalles. Tan simple como conversar.",
      image: "/images/landing/feature-whatsapp.webp",
      imageAlt:
        "Persona recibiendo un pedido por WhatsApp en su celular",
    },
    {
      icon: PenTool,
      title: "Fácil de editar",
      description:
        "Actualiza precios, productos y disponibilidad en tiempo real desde tu dashboard. Tu carta siempre está al día.",
      image: "/images/landing/feature-edit.webp",
      imageAlt: "Dueña de negocio actualizando su menú en una tablet",
    },
    {
      icon: Wallet,
      title: "Sin comisiones",
      description:
        "No cobramos por pedido ni por transacción. Tú recibes el pago directamente y te quedas con todo lo que ganas.",
      image: "/images/landing/feature-fees.webp",
      imageAlt: "Dueño de negocio peruano confiado detrás del mostrador de su restaurante",
    },
    {
      icon: Megaphone,
      title: "Promociones y banners",
      description:
        "Destaca ofertas especiales con banners visuales en tu carta digital. Atrae más clientes con promociones temporales.",
      image: "/images/landing/feature-promotions.webp",
      imageAlt: "Banner de promoción en carta digital de restaurante",
    },
  ];

  return (
    <section id="funciones" className="py-24 lg:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#C25E3A] uppercase">
            Funciones
          </span>
          <h2 className="mt-4 text-balance font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight leading-[1.15]">
            Todo lo que necesitas{" "}
            <span className="text-[#C25E3A]">para vender más</span>
          </h2>
        </div>

        <div className="mt-20 space-y-24 lg:space-y-32">
          {features.map((f, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={f.title}
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                  isEven ? "" : "lg:[direction:rtl]"
                }`}
              >
                <div className={`${isEven ? "" : "lg:[direction:ltr]"} opacity-0-start animate-fade-in-up`}>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem]">
                    <Image
                      src={f.image}
                      alt={f.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-[#C25E3A]/5" />
                  </div>
                </div>
                <div className={`${isEven ? "" : "lg:[direction:ltr]"} space-y-5 opacity-0-start animate-fade-in-up animation-delay-200`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C25E3A]/10 text-[#C25E3A]">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight lg:text-3xl">
                    {f.title}
                  </h3>
                  <p className="max-w-md text-lg leading-relaxed text-[#7D6F65]">
                    {f.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Crea tu cuenta",
      desc: "Regístrate gratis y configura los datos de tu negocio en minutos.",
    },
    {
      num: "02",
      title: "Carga tu menú",
      desc: "Agrega productos, categorías, fotos y precios desde el dashboard.",
    },
    {
      num: "03",
      title: "Comparte tu QR",
      desc: "Imprime o muestra tu código QR y empieza a recibir pedidos.",
    },
  ];

  return (
    <section className="border-y border-[#EDE6DE] bg-white py-24 lg:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#C25E3A] uppercase">
            Cómo funciona
          </span>
          <h2 className="mt-4 text-balance font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight leading-[1.15]">
            De tu cocina al cliente{" "}
            <span className="text-[#C25E3A]">en 3 pasos</span>
          </h2>
        </div>

        <div className="relative mt-20">
          {/* Connector line desktop */}
          <div className="absolute top-10 left-0 hidden h-0.5 w-full bg-[#C25E3A]/15 lg:block" />

          <div className="grid gap-12 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center opacity-0-start animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#C25E3A] bg-[#FDF8F3] font-display text-2xl font-bold text-[#C25E3A]">
                  {step.num}
                </div>
                <h3 className="mt-8 text-xl font-semibold">{step.title}</h3>
                <p className="mx-auto mt-3 max-w-xs leading-relaxed text-[#7D6F65]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "S/ 0",
      period: "/mes",
      description: "Perfecto para empezar",
      features: [
        "Hasta 10 productos",
        "Hasta 5 categorías",
        "1 promoción activa",
        "Código QR básico",
        "Pedidos por WhatsApp",
        "Marca de agua Mesa.pe",
      ],
      cta: "Crear cuenta",
      href: "/sign-up",
      highlighted: false,
    },
    {
      name: "Starter",
      price: "S/ 29",
      period: "/mes",
      description: "Para negocios en crecimiento",
      features: [
        "Hasta 50 productos",
        "Hasta 10 categorías",
        "3 promociones activas",
        "Código QR personalizado",
        "Pedidos por WhatsApp",
        "Sin marca de agua",
      ],
      cta: "Empezar con Starter",
      href: "/sign-up",
      highlighted: true,
    },
    {
      name: "Pro",
      price: "S/ 79",
      period: "/mes",
      description: "Para negocios establecidos",
      features: [
        "Productos ilimitados",
        "Categorías ilimitadas",
        "Promociones ilimitadas",
        "Analytics avanzados",
        "Múltiples métodos de pago",
        "Soporte prioritario",
      ],
      cta: "Empezar con Pro",
      href: "/sign-up",
      highlighted: false,
    },
  ];

  return (
    <section id="precios" className="py-24 lg:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#C25E3A] uppercase">
            Precios
          </span>
          <h2 className="mt-4 text-balance font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight leading-[1.15]">
            Simples y <span className="text-[#C25E3A]">transparentes</span>
          </h2>
          <p className="mt-5 text-lg text-[#7D6F65]">
            Sin costos ocultos. Sin comisiones por pedido. Cancela cuando
            quieras.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-8 transition-shadow duration-300 hover:shadow-xl lg:p-10 opacity-0-start animate-fade-in-up ${
                plan.highlighted
                  ? "border-[#2A211E] bg-[#2A211E] text-[#FDF8F3] shadow-xl"
                  : "border-[#EDE6DE] bg-white"
              }`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#C25E3A] px-4 py-1 text-xs font-semibold text-white">
                  Más popular
                </div>
              )}
              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold ${
                    plan.highlighted ? "text-[#FDF8F3]" : "text-[#2A211E]"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mt-1.5 text-sm ${
                    plan.highlighted ? "text-[#FDF8F3]/70" : "text-[#7D6F65]"
                  }`}
                >
                  {plan.description}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold">
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ${
                      plan.highlighted
                        ? "text-[#FDF8F3]/70"
                        : "text-[#7D6F65]"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-[15px]">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          plan.highlighted
                            ? "text-[#C25E3A]"
                            : "text-[#4A6B5D]"
                        }`}
                        strokeWidth={2.5}
                      />
                      <span
                        className={
                          plan.highlighted ? "text-[#FDF8F3]/90" : ""
                        }
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10">
                <Link href={plan.href} className="block">
                  <Button
                    className={`w-full rounded-full ${
                      plan.highlighted
                        ? "bg-[#C25E3A] text-white hover:bg-[#A3492D]"
                        : "bg-[#2A211E] text-white hover:bg-[#1a1513]"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      question: "¿Necesito una app para usar Mesa.pe?",
      answer:
        "No. Tus clientes solo escanean el QR con la cámara de su celular y ven tu carta directamente en el navegador. No necesitan descargar nada.",
    },
    {
      question: "¿Cómo recibo los pedidos?",
      answer:
        "Cuando un cliente finaliza su orden, lo redirigimos a un mensaje de WhatsApp pre-escrito con todos los detalles del pedido. Tú lo recibes como cualquier mensaje de WhatsApp.",
    },
    {
      question: "¿Puedo cambiar de plan más adelante?",
      answer:
        "Sí, puedes subir o bajar de plan en cualquier momento desde tu dashboard. Los cambios se aplican de inmediato.",
    },
    {
      question: "¿Qué pasa si alcanzo el límite de productos?",
      answer:
        "Te avisaremos cuando estés cerca del límite. Si lo alcanzas, podrás actualizar a un plan superior con un clic.",
    },
    {
      question: "¿Es seguro?",
      answer:
        "Sí. Usamos autenticación con Clerk, base de datos en PostgreSQL con Prisma, y todos los datos se transmiten de forma encriptada.",
    },
  ];

  return (
    <section id="faq" className="border-t border-[#EDE6DE] bg-white py-24 lg:py-32">
      <div className="container max-w-3xl">
        <div className="text-center">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#C25E3A] uppercase">
            FAQ
          </span>
          <h2 className="mt-4 text-balance font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight leading-[1.15]">
            Preguntas <span className="text-[#C25E3A]">frecuentes</span>
          </h2>
        </div>
        <Accordion className="mt-12">
          {items.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-[#EDE6DE]"
            >
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline py-5">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-[#7D6F65] leading-relaxed pb-5">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#C25E3A] px-8 py-20 text-center text-white lg:px-16 lg:py-24">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute top-0 right-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 -translate-x-1/3 translate-y-1/3 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight leading-[1.15]">
              Listo para modernizar{" "}
              <span className="italic">tu carta</span>?
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-lg text-white/80">
              Únete a cientos de negocios de comida en Perú que ya venden más con
              Mesa.pe.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="rounded-full bg-white px-8 text-[#C25E3A] hover:bg-[#FDF8F3]"
                >
                  Crear carta gratis
                </Button>
              </Link>
              <Link href="/la-lucha-sangucheria">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/30 bg-transparent px-8 text-white hover:bg-white/10"
                >
                  Ver demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#EDE6DE] bg-[#FDF8F3] py-14">
      <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2 text-lg font-bold text-[#2A211E]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C25E3A] text-white">
            <QrCode className="h-4 w-4" />
          </div>
          <span className="font-display text-xl font-semibold">Mesa.pe</span>
        </div>
        <p className="text-sm text-[#7D6F65]">
          &copy; {new Date().getFullYear()} Mesa.pe. Hecho con cuidado en Lima,
          Perú.
        </p>
        <div className="flex gap-6 text-sm text-[#7D6F65]">
          <Link
            href="/sign-in"
            className="transition-colors hover:text-[#2A211E]"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/sign-up"
            className="transition-colors hover:text-[#2A211E]"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </footer>
  );
}
