"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ScrollReveal } from "../components/scroll-reveal";
import { saveMeasurements } from "../../lib/measurements";

type TabKey = "men" | "women";
type MeasurementKind =
  | "chest"
  | "waist"
  | "hips"
  | "shoulder"
  | "sleeve"
  | "neck"
  | "arm"
  | "thigh"
  | "inseam"
  | "trouser-length"
  | "back-width"
  | "bust"
  | "underbust"
  | "dress-length"
  | "skirt-length";

type MeasurementGuide = {
  name: string;
  kind: MeasurementKind;
  description: string;
  tape: string;
  stance: string;
  example: string;
  tips: string[];
};

const introPills = [
  "Use a flexible measuring tape.",
  "Wear fitted clothing or light fabric.",
  "Stand naturally with relaxed posture.",
  "Keep the tape level and parallel to the floor.",
  "Ask someone to help with difficult areas.",
];

function createEmptyValues(guides: MeasurementGuide[]) {
  return guides.reduce<Record<string, string>>((accumulator, guide) => {
    accumulator[guide.kind] = "";
    return accumulator;
  }, {});
}

const menGuides: MeasurementGuide[] = [
  {
    name: "Chest",
    kind: "chest",
    description:
      "Wrap the tape around the fullest part of the chest, just under the armpits, and keep it smooth across the back.",
    tape: "Start at the center of the chest line, wrap around the fullest point, and return to the starting edge without twisting the tape.",
    stance: "Stand upright with arms relaxed at your sides and shoulders neutral.",
    example: "The tape should sit level across the back and stay comfortably snug around the chest.",
    tips: ["Relax your shoulders", "Breathe normally", "Keep the tape snug, not tight"],
  },
  {
    name: "Waist",
    kind: "waist",
    description:
      "Measure around the natural waistline, slightly above the belly button, where the torso bends most naturally.",
    tape: "Place the tape around the narrowest part of the torso and bring both ends together at the front.",
    stance: "Stand naturally and do not suck in your stomach.",
    example: "The tape should remain horizontal and sit smoothly against the body without pinching.",
    tips: ["Do not suck in your stomach", "Find the narrowest point", "Hold the tape flat all the way around"],
  },
  {
    name: "Hip",
    kind: "hips",
    description:
      "Measure around the fullest part of the hips and seat, keeping the tape parallel to the floor.",
    tape: "Wrap the tape around the widest part of the hips and return it to the front at the same level.",
    stance: "Stand with feet together and weight evenly balanced.",
    example: "Keep the tape level around the seat so the measurement reflects the fullest point.",
    tips: ["Stand with feet together", "Measure at the widest point", "Check the tape from the side and back"],
  },
  {
    name: "Shoulder",
    kind: "shoulder",
    description:
      "Measure across the top of the shoulders from one shoulder edge to the other.",
    tape: "Place the tape at the outer edge of one shoulder and run it straight across the back to the opposite shoulder edge.",
    stance: "Stand straight with the shoulders relaxed and level.",
    example: "The tape should follow the natural shoulder line and not dip below the upper back.",
    tips: ["Find the shoulder bone edges", "Keep the tape straight across the back", "Ask someone to help for precision"],
  },
  {
    name: "Sleeve Length",
    kind: "sleeve",
    description:
      "Measure from the center back of the neck, over the shoulder, and down to the wrist bone.",
    tape: "Start at the center back of the neck, pass over the shoulder, and end at the wrist bone with the arm slightly bent.",
    stance: "Keep the arm relaxed with a natural bend.",
    example: "The tape should follow the curve of the shoulder and sleeve path without slack.",
    tips: ["Keep the arm slightly bent", "Ask for help when possible", "Follow the natural curve of the arm"],
  },
  {
    name: "Neck",
    kind: "neck",
    description:
      "Measure around the base of the neck, leaving a small amount of breathing room for comfort.",
    tape: "Wrap the tape around the neck base and leave a finger-width gap before joining the ends.",
    stance: "Stand upright and keep your chin level.",
    example: "The tape should sit where a collar would naturally rest.",
    tips: ["Leave space for one finger", "Keep the tape comfortably loose", "Measure where a collar would sit"],
  },
  {
    name: "Arm/Bicep",
    kind: "arm",
    description:
      "Measure around the fullest part of the upper arm, usually at the bicep area.",
    tape: "Wrap the tape around the thickest part of the upper arm and meet it at the front without squeezing.",
    stance: "Let the arm hang relaxed at the side or bend it slightly for accuracy.",
    example: "The tape should remain level and sit comfortably around the upper arm muscle.",
    tips: ["Do not flex the bicep", "Keep the tape level", "Measure the fullest part of the arm"],
  },
  {
    name: "Thigh",
    kind: "thigh",
    description:
      "Measure around the fullest part of the thigh, usually high on the leg near the crotch area.",
    tape: "Place the tape around the upper thigh at the widest point and bring it back to the front on the same line.",
    stance: "Stand with feet slightly apart and weight evenly distributed.",
    example: "The tape should not angle up or down; keep it parallel to the floor.",
    tips: ["Stand evenly on both feet", "Find the widest upper-thigh point", "Keep the tape smooth around the leg"],
  },
  {
    name: "Inseam",
    kind: "inseam",
    description:
      "Measure from the top of the inner thigh straight down to the floor with shoes removed.",
    tape: "Start at the crotch point or a flat book held between the legs, then measure straight down to the floor.",
    stance: "Stand straight with legs slightly apart for a clear line.",
    example: "The tape should run vertically from the inner thigh to the floor without slanting.",
    tips: ["Use a book at the crotch point", "Keep legs slightly apart", "Measure straight, not diagonally"],
  },
  {
    name: "Trouser Length",
    kind: "trouser-length",
    description:
      "Measure from the top of the waistband area down to the desired trouser hem point.",
    tape: "Start at the top of the trouser waist position and end at the bottom hem point you want.",
    stance: "Stand tall and keep the legs straight while marking the length.",
    example: "The tape should track the outer leg line all the way down to the hem level.",
    tips: ["Decide where you want the trouser to finish", "Measure along the outside leg line", "Keep the tape vertical"],
  },
  {
    name: "Back Width",
    kind: "back-width",
    description:
      "Measure across the upper back between the points where the arms meet the torso.",
    tape: "Place the tape from one back armhole point to the other, keeping it level across the shoulder blades.",
    stance: "Stand straight with shoulders relaxed and arms slightly away from the body.",
    example: "The tape should cross the upper back horizontally, just below the shoulder line.",
    tips: ["Ask for a helper if possible", "Keep the tape straight across the back", "Do not let it dip below the shoulder blades"],
  },
];

const womenGuides: MeasurementGuide[] = [
  {
    name: "Bust",
    kind: "bust",
    description:
      "Measure around the fullest part of the bust while keeping the tape level across the back and under the arms.",
    tape: "Wrap the tape around the fullest part of the bust and bring it back to the front at the same height.",
    stance: "Stand upright with relaxed shoulders and arms at your sides.",
    example: "The tape should sit evenly across the back and follow the fullest point of the bust.",
    tips: ["Wear a well-fitted bra", "Do not pull the tape too tight", "Keep the tape level from front to back"],
  },
  {
    name: "Under Bust",
    kind: "underbust",
    description:
      "Measure directly under the bust where a bra band would normally sit.",
    tape: "Place the tape snugly around the ribcage directly below the bust and meet it at the front.",
    stance: "Stand tall and breathe normally without lifting the chest.",
    example: "The tape should remain parallel to the floor and sit firmly on the ribcage line.",
    tips: ["Keep the tape firm but comfortable", "Stay level across the back", "Measure just below the bust"],
  },
  {
    name: "Waist",
    kind: "waist",
    description:
      "Measure the natural waistline, the narrowest part of the torso, while standing relaxed and upright.",
    tape: "Wrap the tape around the narrowest part of the waist and bring the ends together at the front.",
    stance: "Stand naturally without tightening the stomach.",
    example: "Keep the tape horizontal and lightly touching the body at the waistline.",
    tips: ["Stand naturally", "Do not hold your breath", "Keep the tape parallel to the floor"],
  },
  {
    name: "Hip",
    kind: "hips",
    description:
      "Measure around the fullest part of the hips and seat, usually about 8 inches below the waist.",
    tape: "Wrap the tape around the widest part of the hips and return to the starting point on the same level.",
    stance: "Stand with feet together and weight balanced evenly.",
    example: "The tape should sit over the fullest curve of the hips, not above the waist.",
    tips: ["Keep your feet together", "Measure the widest point", "Make sure the tape stays flat"],
  },
  {
    name: "Shoulder",
    kind: "shoulder",
    description:
      "Measure from one shoulder edge across the back to the other shoulder edge, following the top seam line.",
    tape: "Place the tape from shoulder point to shoulder point across the upper back.",
    stance: "Stand upright with the shoulders loose and level.",
    example: "The tape should run straight across the shoulder line without dipping into the arm opening.",
    tips: ["Find the shoulder bone edges", "Keep the tape straight across the back", "Ask someone to help for precision"],
  },
  {
    name: "Sleeve Length",
    kind: "sleeve",
    description:
      "Measure from the center back of the neck, across the shoulder, and down to the wrist bone.",
    tape: "Start at the neck center, move over the shoulder point, and finish at the wrist bone.",
    stance: "Keep the arm relaxed with a slight bend at the elbow.",
    example: "The tape should follow the natural arm curve without pulling tight across the shoulder.",
    tips: ["Keep the elbow soft", "Use a helper if possible", "Follow the natural arm line"],
  },
  {
    name: "Neck",
    kind: "neck",
    description:
      "Measure around the base of the neck, leaving a small amount of breathing room for comfort.",
    tape: "Wrap the tape around the neck base and leave a finger-width gap before joining the ends.",
    stance: "Stand upright and keep your chin level.",
    example: "The tape should sit where a collar would naturally rest.",
    tips: ["Leave space for one finger", "Keep the tape comfortably loose", "Measure where a collar would sit"],
  },
  {
    name: "Arm/Bicep",
    kind: "arm",
    description:
      "Measure around the fullest part of the upper arm, usually at the bicep area.",
    tape: "Wrap the tape around the thickest part of the upper arm and meet it at the front without squeezing.",
    stance: "Let the arm hang relaxed at the side or bend it slightly for accuracy.",
    example: "The tape should remain level and sit comfortably around the upper arm muscle.",
    tips: ["Do not flex the bicep", "Keep the tape level", "Measure the fullest part of the arm"],
  },
  {
    name: "Thigh",
    kind: "thigh",
    description:
      "Measure around the fullest part of the thigh, usually high on the leg near the crotch area.",
    tape: "Place the tape around the upper thigh at the widest point and bring it back to the front on the same line.",
    stance: "Stand with feet slightly apart and weight evenly distributed.",
    example: "The tape should not angle up or down; keep it parallel to the floor.",
    tips: ["Stand evenly on both feet", "Find the widest upper-thigh point", "Keep the tape smooth around the leg"],
  },
  {
    name: "Inseam",
    kind: "inseam",
    description:
      "Measure from the top of the inner thigh straight down to the floor with shoes off.",
    tape: "Start at the crotch point or a flat book held between the legs, then measure straight down to the floor.",
    stance: "Stand straight with legs slightly apart for a clear line.",
    example: "The tape should run vertically from the inner thigh to the floor without slanting.",
    tips: ["Use a flat book for accuracy", "Keep your stance balanced", "Measure directly downward"],
  },
  {
    name: "Dress Length",
    kind: "dress-length",
    description:
      "Measure from the top of the shoulder down to the point where you want the dress to finish.",
    tape: "Start at the top of the shoulder and end at the desired hem level.",
    stance: "Stand tall with the body straight so the length falls naturally.",
    example: "The tape should travel in a clean vertical line down the front of the body.",
    tips: ["Decide your hem point first", "Keep the tape vertical", "Measure while standing straight"],
  },
  {
    name: "Skirt Length",
    kind: "skirt-length",
    description:
      "Measure from the waistband position down to the point where you want the skirt to end.",
    tape: "Start at the waistband and finish at the chosen hem point.",
    stance: "Stand straight with the hips level and relaxed.",
    example: "The tape should drop straight down from the waist without curving around the leg.",
    tips: ["Mark the waistband first", "Keep the tape aligned to the front", "Measure to the exact hem point"],
  },
  {
    name: "Back Width",
    kind: "back-width",
    description:
      "Measure across the upper back between the points where the arms meet the torso.",
    tape: "Place the tape from one back armhole point to the other, keeping it level across the shoulder blades.",
    stance: "Stand straight with shoulders relaxed and arms slightly away from the body.",
    example: "The tape should cross the upper back horizontally, just below the shoulder line.",
    tips: ["Ask for a helper if possible", "Keep the tape straight across the back", "Do not let it dip below the shoulder blades"],
  },
];

const guidesByTab: Record<TabKey, MeasurementGuide[]> = {
  men: menGuides,
  women: womenGuides,
};

function MeasurementIllustration({ kind }: { kind: MeasurementKind }) {
  const gradientId = useId();
  const accent = "rgba(201,168,76,0.95)";
  const accentSoft = "rgba(201,168,76,0.22)";
  const ink = "rgba(var(--ink-rgb),0.72)";

  const baseFigure = (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="100%" stopColor="rgba(245,240,232,0.70)" />
        </linearGradient>
      </defs>
      <circle cx="128" cy="40" r="18" fill={`url(#${gradientId})`} stroke={ink} strokeWidth="2" />
      <path
        d="M108 60c6 10 12 15 20 15s14-5 20-15"
        fill="none"
        stroke={ink}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M95 76c12-12 58-12 70 0 7 8 9 20 9 35 0 33-8 52-10 70-1 9 0 18 4 24H92c4-6 5-15 4-24-2-18-10-37-10-70 0-15 2-27 9-35Z"
        fill={`url(#${gradientId})`}
        stroke={ink}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M88 118c-14 12-26 28-33 47"
        fill="none"
        stroke={ink}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M172 118c14 12 26 28 33 47"
        fill="none"
        stroke={ink}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M100 180c-2 12-8 24-17 32"
        fill="none"
        stroke={ink}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M156 180c2 12 8 24 17 32"
        fill="none"
        stroke={ink}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  );

  const highlight = (() => {
    switch (kind) {
      case "chest":
      case "bust":
        return (
          <>
            <path d="M86 104h84" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
            <circle cx="86" cy="104" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <circle cx="170" cy="104" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <text
              x="128"
              y="94"
              textAnchor="middle"
              className="fill-[color:var(--rich-black)] text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              Chest line
            </text>
          </>
        );
      case "underbust":
        return (
          <>
            <path d="M88 120h80" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
            <circle cx="88" cy="120" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <circle cx="168" cy="120" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <text
              x="128"
              y="110"
              textAnchor="middle"
              className="fill-[color:var(--rich-black)] text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              Under bust
            </text>
          </>
        );
      case "waist":
        return (
          <>
            <path d="M90 136h76" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
            <circle cx="90" cy="136" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <circle cx="166" cy="136" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <text
              x="128"
              y="126"
              textAnchor="middle"
              className="fill-[color:var(--rich-black)] text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              Waist line
            </text>
          </>
        );
      case "shoulder":
        return (
          <>
            <path d="M74 78h108" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
            <circle cx="74" cy="78" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <circle cx="182" cy="78" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <text
              x="128"
              y="68"
              textAnchor="middle"
              className="fill-[color:var(--rich-black)] text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              Shoulder span
            </text>
          </>
        );
      case "back-width":
        return (
          <>
            <path d="M74 92h108" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
            <circle cx="74" cy="92" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <circle cx="182" cy="92" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <text
              x="128"
              y="82"
              textAnchor="middle"
              className="fill-[color:var(--rich-black)] text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              Back width
            </text>
          </>
        );
      case "hips":
        return (
          <>
            <path d="M82 162h92" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
            <circle cx="82" cy="162" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <circle cx="174" cy="162" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <text
              x="128"
              y="152"
              textAnchor="middle"
              className="fill-[color:var(--rich-black)] text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              Hip line
            </text>
          </>
        );
      case "arm":
        return (
          <>
            <path d="M170 118c-16 6-30 14-40 26" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
            <circle cx="170" cy="118" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <circle cx="130" cy="144" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <text
              x="160"
              y="108"
              textAnchor="middle"
              className="fill-[color:var(--rich-black)] text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              Arm / bicep
            </text>
          </>
        );
      case "thigh":
        return (
          <>
            <path d="M118 162h56" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
            <circle cx="118" cy="162" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <circle cx="174" cy="162" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <text
              x="146"
              y="152"
              textAnchor="middle"
              className="fill-[color:var(--rich-black)] text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              Thigh
            </text>
          </>
        );
      case "inseam":
        return (
          <>
            <path d="M128 88v92" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
            <circle cx="128" cy="88" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <circle cx="128" cy="180" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <text
              x="160"
              y="136"
              textAnchor="middle"
              className="fill-[color:var(--rich-black)] text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              Inseam
            </text>
          </>
        );
      case "trouser-length":
        return (
          <>
            <path d="M128 74v118" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
            <circle cx="128" cy="74" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <circle cx="128" cy="192" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <text
              x="160"
              y="136"
              textAnchor="middle"
              className="fill-[color:var(--rich-black)] text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              Trouser length
            </text>
          </>
        );
      case "dress-length":
        return (
          <>
            <path d="M128 54v138" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
            <circle cx="128" cy="54" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <circle cx="128" cy="192" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <text
              x="162"
              y="128"
              textAnchor="middle"
              className="fill-[color:var(--rich-black)] text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              Dress length
            </text>
          </>
        );
      case "skirt-length":
        return (
          <>
            <path d="M128 136v84" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
            <circle cx="128" cy="136" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <circle cx="128" cy="220" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <text
              x="164"
              y="186"
              textAnchor="middle"
              className="fill-[color:var(--rich-black)] text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              Skirt length
            </text>
          </>
        );
      case "sleeve":
        return (
          <>
            <path d="M98 76c-10 15-20 33-24 53" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
            <circle cx="98" cy="76" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <circle cx="74" cy="129" r="5" fill={accentSoft} stroke={accent} strokeWidth="2" />
            <text
              x="154"
              y="120"
              textAnchor="middle"
              className="fill-[color:var(--rich-black)] text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              Sleeve length
            </text>
          </>
        );
      case "neck":
        return (
          <>
            <circle cx="128" cy="52" r="25" fill="none" stroke={accent} strokeWidth="4" />
            <text
              x="128"
              y="96"
              textAnchor="middle"
              className="fill-[color:var(--rich-black)] text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              Neck base
            </text>
          </>
        );
    }
  })();

  return (
    <svg viewBox="0 0 256 256" role="img" aria-hidden="true" className="h-full w-full">
      <rect x="0" y="0" width="256" height="256" rx="28" fill="rgba(255,255,255,0.55)" />
      <ellipse cx="128" cy="210" rx="74" ry="22" fill="rgba(201,168,76,0.08)" />
      {baseFigure}
      {highlight}
    </svg>
  );
}

function GuideCard({
  guide,
  index,
  value,
  onChange,
}: {
  guide: MeasurementGuide;
  index: number;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <ScrollReveal delay={0.04 * index} className="h-full">
      <article className="glass-surface group h-full overflow-hidden rounded-[1.45rem] border border-[rgba(201,168,76,0.14)] bg-white/75 p-3.5 shadow-[0_20px_56px_rgba(var(--ink-rgb),0.05)] transition-transform duration-300 hover:-translate-y-1 md:p-4">
        <div className="space-y-3.5 md:space-y-4">
          <div className="rounded-[1.2rem] border border-[rgba(201,168,76,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(245,240,232,0.72))] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-transform duration-300 ease-out md:p-2.5 lg:group-hover:scale-[1.02]">
            <MeasurementIllustration kind={guide.kind} />
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(201,168,76,0.18)] bg-[rgba(201,168,76,0.08)] text-xs font-black uppercase tracking-[0.2em] text-[color:var(--gold)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[color:var(--gold)]">Measurement</p>
                <h3 className="mt-1 text-xl font-black tracking-tight text-[color:var(--rich-black)] md:text-[1.35rem]">
                  {guide.name}
                </h3>
              </div>
            </div>

            <p className="text-sm leading-6 text-muted md:text-[0.92rem]">{guide.description}</p>

            <div className="grid gap-2.5 rounded-[1.15rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/60 p-3.5 md:grid-cols-3 md:gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">Tape placement</p>
                <p className="mt-1 text-sm leading-6 text-muted">{guide.tape}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">How to stand</p>
                <p className="mt-1 text-sm leading-6 text-muted">{guide.stance}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">Look for</p>
                <p className="mt-1 text-sm leading-6 text-muted">{guide.example}</p>
              </div>
            </div>

            <div className="rounded-[1.15rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/60 p-3.5 md:p-4">
              <label className="block space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">Your value</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={value}
                  onChange={(event) => onChange(event.target.value)}
                  placeholder={`Enter ${guide.name.toLowerCase()} value`}
                  className="w-full rounded-2xl border border-[rgba(var(--ink-rgb),0.10)] bg-white/85 px-4 py-2.5 text-sm text-[color:var(--rich-black)] outline-none transition duration-300 placeholder:text-[color:var(--text-light)] focus:border-[rgba(201,168,76,0.45)] focus:ring-2 focus:ring-[rgba(201,168,76,0.12)]"
                />
              </label>

              <div className="mt-3 border-t border-[rgba(var(--ink-rgb),0.06)] pt-3">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">Simple tips</p>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  {guide.tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-sm leading-6 text-muted">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" aria-hidden="true" />
                      <span className="text-[0.9rem] leading-6">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
}

export default function MeasurementsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("men");
  const [valuesByTab, setValuesByTab] = useState<Record<TabKey, Record<string, string>>>(() => ({
    men: createEmptyValues(menGuides),
    women: createEmptyValues(womenGuides),
  }));
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const activeGuides = guidesByTab[activeTab];

  const handleFieldChange = (key: string, value: string) => {
    setValuesByTab((current) => ({
      ...current,
      [activeTab]: {
        ...current[activeTab],
        [key]: value,
      },
    }));
    setSubmitMessage(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    saveMeasurements({
      type: activeTab,
      values: valuesByTab[activeTab],
      photos: [],
      savedAt: new Date().toISOString(),
    });

    setSubmitMessage(
      `${activeTab === "men" ? "Men's" : "Women's"} measurements saved successfully.`,
    );
  };

  return (
    <div className="section-shell no-hover py-8 md:py-12">
      <section className="grid gap-6 rounded-[2rem] border border-[rgba(201,168,76,0.14)] bg-white/75 p-6 shadow-[0_30px_90px_rgba(var(--ink-rgb),0.06)] backdrop-blur-md md:gap-8 md:p-10 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
        <div className="space-y-6">
          <ScrollReveal>
            <span className="section-badge">Measurement guide</span>
          </ScrollReveal>

          <div className="space-y-4">
            <ScrollReveal delay={0.08}>
              <h1 className="max-w-2xl text-4xl font-black tracking-tight text-[color:var(--rich-black)] md:text-6xl">
                How to Measure Yourself
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.16}>
              <p className="max-w-2xl text-base leading-8 text-muted md:text-lg">
                Use a flexible measuring tape, wear fitted clothing, stand naturally, and keep the tape level
                around the body. When measuring the back, shoulders, or any hard-to-reach point, ask someone to
                assist so the result stays clean and accurate.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.24}>
            <div className="flex flex-wrap gap-3">
              {introPills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-[rgba(201,168,76,0.14)] bg-[rgba(201,168,76,0.06)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]"
                >
                  {pill}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.12}>
          <div className="glass-surface overflow-hidden rounded-[1.75rem] border border-[rgba(201,168,76,0.14)] bg-[linear-gradient(160deg,rgba(255,255,255,0.95),rgba(245,240,232,0.78))] p-5 shadow-[0_24px_70px_rgba(var(--ink-rgb),0.08)] md:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-[rgba(var(--ink-rgb),0.08)] pb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[color:var(--gold)]">Luxury fit ritual</p>
                <h2 className="mt-2 text-2xl font-black text-[color:var(--rich-black)]">Measure with calm, not guesswork</h2>
              </div>
              <div className="rounded-full border border-[rgba(201,168,76,0.14)] bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--gold)]">
                5 steps
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                "Prepare a soft tape.",
                "Stand in natural light.",
                "Keep posture relaxed.",
                "Check the tape is level.",
                "Measure twice for confidence.",
                "Write each value as you go.",
              ].map((step, index) => (
                <div
                  key={step}
                  className="rounded-[1.1rem] border border-[rgba(var(--ink-rgb),0.06)] bg-white/70 p-4"
                >
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--gold)]">
                    Step {index + 1}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="mt-8 space-y-6 md:mt-10 md:space-y-8">
        <ScrollReveal>
          <div className="rounded-[1.75rem] border border-[rgba(201,168,76,0.12)] bg-white/70 p-4 shadow-[0_20px_60px_rgba(var(--ink-rgb),0.05)] backdrop-blur-md md:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[color:var(--gold)]">Choose a guide</p>
                <h2 className="mt-2 text-2xl font-black text-[color:var(--rich-black)] md:text-3xl">
                  Switch between Men&apos;s and Women&apos;s measurements
                </h2>
              </div>

              <div className="inline-flex w-full flex-wrap justify-stretch rounded-[1.5rem] border border-[rgba(201,168,76,0.14)] bg-white/75 p-1 sm:w-auto sm:rounded-full">
                {(["men", "women"] as TabKey[]).map((tab) => {
                  const active = activeTab === tab;
                  const label = tab === "men" ? "Men's Measurements" : "Women's Measurements";

                  return (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 rounded-[1.1rem] px-4 py-3 text-sm font-bold transition-all duration-300 ease-out sm:flex-none sm:rounded-full sm:px-4 sm:py-2.5 ${
                        active
                          ? "bg-[color:var(--gold)] text-[#1A1A1A] shadow-[0_10px_28px_rgba(201,168,76,0.28)]"
                          : "text-[color:var(--foreground)] hover:-translate-y-0.5 hover:bg-[rgba(201,168,76,0.08)] hover:text-[color:var(--gold)]"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div role="tabpanel" aria-label={`${activeTab === "men" ? "Men's" : "Women's"} measurements`} className="space-y-5 md:space-y-6">
          <ScrollReveal>
            <div className="rounded-[1.75rem] border border-[rgba(201,168,76,0.12)] bg-white/75 p-5 shadow-[0_20px_60px_rgba(var(--ink-rgb),0.05)] md:p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[color:var(--gold)]">
                    {activeTab === "men" ? "Men's Measurements" : "Women's Measurements"}
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-[color:var(--rich-black)] md:text-3xl">
                    Visual instructions for every key point
                  </h3>
                </div>
                <p className="max-w-xl text-sm leading-7 text-muted">
                  Each guide shows where the tape should sit, how to hold your posture, and the small habits that
                  keep a measurement consistent.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
              {activeGuides.map((guide, index) => (
                <GuideCard
                  key={guide.name}
                  guide={guide}
                  index={index}
                  value={valuesByTab[activeTab][guide.kind] ?? ""}
                  onChange={(value) => handleFieldChange(guide.kind, value)}
                />
              ))}
            </div>

            <div className="rounded-[1.5rem] border border-[rgba(201,168,76,0.12)] bg-white/75 p-4 shadow-[0_20px_60px_rgba(var(--ink-rgb),0.05)] md:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-6 text-[color:var(--text-light)]">
                  Enter each value inside its card, then submit the active tab to save the full set.
                </p>
                <button type="submit" className="button-primary px-6 py-3 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(201,168,76,0.22)]">
                  Submit {activeTab === "men" ? "Men's" : "Women's"} Measurements
                </button>
              </div>

              {submitMessage && (
                <p className="mt-4 rounded-2xl border border-[rgba(201,168,76,0.14)] bg-[rgba(201,168,76,0.08)] px-4 py-3 text-sm font-medium text-[color:var(--rich-black)]">
                  {submitMessage}
                </p>
              )}
            </div>
          </form>

          <ScrollReveal direction="scale" delay={0.08}>
            <section className="overflow-hidden rounded-[2rem] border border-[rgba(201,168,76,0.18)] bg-[linear-gradient(135deg,#111111_0%,#1A1A1A_45%,#F8F1E6_45%,#FBF7F0_100%)] shadow-[0_28px_80px_rgba(var(--ink-rgb),0.10)]">
              <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
                <div className="flex items-center bg-[#111111] px-6 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14">
                  <div className="max-w-xl space-y-5">
                    <span className="section-badge border border-[rgba(201,168,76,0.18)] bg-[rgba(201,168,76,0.10)] text-[color:var(--gold)]">
                      Next step
                    </span>
                    <div className="space-y-3">
                      <h2 className="text-3xl font-black tracking-tight text-[#F8F1E6] md:text-5xl">
                        Ready to Find Your Perfect Fit?
                      </h2>
                      <p className="max-w-lg text-sm leading-7 text-[rgba(248,241,230,0.82)] md:text-base md:leading-8">
                        Now that you know how to take your measurements, explore our collection and find pieces designed to fit you beautifully.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/shop"
                        className="inline-flex items-center justify-center rounded-full border border-[rgba(201,168,76,0.24)] bg-[color:var(--gold)] px-6 py-3 text-sm font-bold text-[#111111] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(201,168,76,0.24)]"
                      >
                        Explore the Collection
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center justify-center bg-[#FBF7F0] px-6 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.12),transparent_46%),radial-gradient(circle_at_bottom_right,rgba(17,17,17,0.08),transparent_30%)]" />
                  <div className="relative w-full max-w-md rounded-[1.5rem] border border-[rgba(201,168,76,0.14)] bg-white/75 p-6 shadow-[0_20px_60px_rgba(var(--ink-rgb),0.06)]">
                    <div className="space-y-3">
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-[color:var(--gold)]">
                        Claireville luxury fitting
                      </p>
                      <p className="text-base leading-8 text-[color:var(--rich-black)]">
                        Elegant pieces, carefully tailored silhouettes, and a refined shopping experience made to complement your measurements.
                      </p>
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-3">
                      {[
                        "Warm ivory",
                        "Champagne gold",
                        "Polished black",
                      ].map((tone) => (
                        <div
                          key={tone}
                          className="rounded-2xl border border-[rgba(var(--ink-rgb),0.06)] bg-white px-3 py-4 text-center text-xs font-bold uppercase tracking-[0.16em] text-muted"
                        >
                          {tone}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}