"use client";

import dynamic from "next/dynamic";
import { useDashboardTour } from "@/hooks/use-dashboard-tour";
import { useEffect, useState } from "react";
import type { Step } from "react-joyride";

const Joyride = dynamic(
  () => import("react-joyride").then((mod) => ({ default: mod.Joyride })),
  { ssr: false }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JoyrideCallbackData = any;

const steps: Step[] = [
  {
    target: 'aside a[href="/dashboard/business"]',
    content:
      "Configura los datos de tu negocio: nombre, dirección, WhatsApp y horarios de atención.",
    title: "Mi Negocio",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: 'aside a[href="/dashboard/products"]',
    content:
      "Agrega productos, categorías, modificadores y fotos para armar tu menú digital.",
    title: "Productos",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: 'aside a[href="/dashboard/design"]',
    content:
      "Elige un tema de colores y personaliza la apariencia de tu carta pública.",
    title: "Diseño",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: 'aside a[href="/dashboard/qr"]',
    content:
      "Genera y descarga tu código QR en PNG, SVG o PDF listo para imprimir en tus mesas.",
    title: "Código QR",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: 'aside a[href="/dashboard/analytics"]',
    content:
      "Revisa visitas, clics a WhatsApp y productos más vistos para tomar mejores decisiones.",
    title: "Analytics",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "aside .business-selector-footer",
    content:
      "Si tienes varios negocios, puedes cambiar entre ellos desde aquí.",
    title: "Selector de negocio",
    placement: "right",
    skipBeacon: true,
  },
  {
    target: "#main-content",
    content: "¡Todo listo! Tu dashboard está preparado para recibir pedidos. 🚀",
    title: "Empieza a vender",
    placement: "center",
    skipBeacon: true,
  },
];

export function DashboardTour() {
  const { hasSeenTour, isReady, markAsSeen, saveProgress } =
    useDashboardTour();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isReady || hasSeenTour || !isDesktop) return;

    const timer = setTimeout(() => {
      setRun(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [isReady, hasSeenTour, isDesktop]);

  const handleJoyrideCallback = (data: JoyrideCallbackData) => {
    const { status, index, type } = data;

    if (type === "step:after") {
      setStepIndex(index + 1);
      saveProgress(index + 1);
    }

    const finishedOrSkipped = ["finished", "skipped"] as string[];
    if (finishedOrSkipped.includes(status as string)) {
      setRun(false);
      markAsSeen();
    }
  };

  if (!isReady || !isDesktop) return null;

  return (
    <Joyride
      run={run}
      steps={steps}
      stepIndex={stepIndex}
      continuous
      locale={{
        back: "Atrás",
        close: "Cerrar",
        last: "Finalizar",
        next: "Siguiente",
        skip: "Omitir tour",
      }}
      options={{
        arrowColor: "#ffffff",
        backgroundColor: "#ffffff",
        overlayColor: "rgba(61, 43, 31, 0.55)",
        primaryColor: "#E85D04",
        textColor: "#3D2B1F",
        zIndex: 10000,
        showProgress: true,
        buttons: ["back", "close", "primary", "skip"],
      }}
      styles={{
        tooltip: {
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
          padding: "20px",
        },
        tooltipTitle: {
          fontSize: "18px",
          fontWeight: 700,
          color: "#3D2B1F",
          marginBottom: "8px",
        },
        tooltipContent: {
          fontSize: "14px",
          lineHeight: "1.5",
          color: "#6B5B4F",
        },
        buttonPrimary: {
          backgroundColor: "#E85D04",
          borderRadius: "10px",
          color: "#ffffff",
          fontSize: "13px",
          fontWeight: 600,
          padding: "8px 16px",
        },
        buttonBack: {
          color: "#8C7B6B",
          fontSize: "13px",
          fontWeight: 500,
          marginRight: "8px",
        },
        buttonSkip: {
          color: "#A89B8C",
          fontSize: "12px",
        },
        spotlight: {
          fill: "rgba(255,255,255,0.08)",
        },
      }}
      onEvent={handleJoyrideCallback}
    />
  );
}
