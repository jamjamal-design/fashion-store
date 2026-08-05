"use client";

import { ScrollReveal } from "./scroll-reveal";

export function SizeGuide() {
  // Size conversion data
  const bustWaistSizes = [
    { us: "0", letter: "XXXS", bust: "31¾", bustCm: "80.6", waist: "23½", waistCm: "59.7" },
    { us: "2", letter: "XXS", bust: "32¼", bustCm: "81.9", waist: "24½", waistCm: "62.2" },
    { us: "4", letter: "XS", bust: "34", bustCm: "86.4", waist: "26", waistCm: "66.0" },
    { us: "6", letter: "S", bust: "36¼", bustCm: "92.1", waist: "28¼", waistCm: "71.8" },
    { us: "8", letter: "M", bust: "38½", bustCm: "97.8", waist: "30¾", waistCm: "78.1" },
    { us: "10", letter: "L", bust: "41", bustCm: "104.1", waist: "33½", waistCm: "85.1" },
    { us: "12", letter: "XL", bust: "42½", bustCm: "108.0", waist: "35½", waistCm: "90.2" },
  ];

  const numericSizes = [
    { us: "1", bust: "31½", bustCm: "80.0", waist: "23½", waistCm: "59.7" },
    { us: "2", bust: "32¼", bustCm: "81.9", waist: "24½", waistCm: "62.2" },
    { us: "4", bust: "34", bustCm: "86.4", waist: "26", waistCm: "66.0" },
    { us: "6", bust: "35½", bustCm: "90.2", waist: "27½", waistCm: "69.9" },
    { us: "8", bust: "37", bustCm: "94.0", waist: "30", waistCm: "76.2" },
    { us: "10", bust: "38½", bustCm: "97.8", waist: "30¾", waistCm: "78.1" },
    { us: "12", bust: "40¼", bustCm: "102.2", waist: "32¾", waistCm: "83.2" },
    { us: "14", bust: "41¾", bustCm: "106.0", waist: "34½", waistCm: "87.6" },
    { us: "16", bust: "43¾", bustCm: "111.1", waist: "36½", waistCm: "92.7" },
  ];

  const equivalentSizes = [
    { us: "0", europe: "XXS", uk: "4", mexico: "EECH" },
    { us: "2", europe: "XS", uk: "6", mexico: "ECH" },
    { us: "4", europe: "S", uk: "8", mexico: "CH" },
    { us: "6", europe: "M", uk: "10", mexico: "M" },
    { us: "8", europe: "L", uk: "12", mexico: "G" },
    { us: "10", europe: "XL", uk: "14", mexico: "EG" },
    { us: "12", europe: "XXL", uk: "16", mexico: "EEG" },
  ];

  const internationalSizes = [
    { us: "0", uk: "4", eu: "32", france: "34", italy: "38", australia: "4", japan: "5", korea: "44", mexico: "EECH", bust: "31¾", bustCm: "80.6", waist: "23½", waistCm: "59.7" },
    { us: "2", uk: "6", eu: "34", france: "36", italy: "40", australia: "6", japan: "7", korea: "55", mexico: "ECH", bust: "32¼", bustCm: "81.9", waist: "24½", waistCm: "62.2" },
    { us: "4", uk: "8", eu: "36", france: "38", italy: "42", australia: "8", japan: "9", korea: "66", mexico: "CH", bust: "34", bustCm: "86.4", waist: "26", waistCm: "66.0" },
    { us: "6", uk: "10", eu: "38", france: "40", italy: "44", australia: "10", japan: "11", korea: "77", mexico: "M", bust: "36¼", bustCm: "92.1", waist: "28¼", waistCm: "71.8" },
    { us: "8", uk: "12", eu: "40", france: "42", italy: "46", australia: "12", japan: "13", korea: "88", mexico: "G", bust: "38½", bustCm: "97.8", waist: "30¾", waistCm: "78.1" },
    { us: "10", uk: "14", eu: "42", france: "44", italy: "48", australia: "14", japan: "15", korea: "99", mexico: "EG", bust: "41", bustCm: "104.1", waist: "33½", waistCm: "85.1" },
    { us: "12", uk: "16", eu: "44", france: "46", italy: "50", australia: "16", japan: "17", korea: "110", mexico: "EEG", bust: "42½", bustCm: "108.0", waist: "35½", waistCm: "90.2" },
  ];

  const cellClass = "whitespace-nowrap px-4 py-3.5 text-sm text-[color:var(--muted)]";
  const headClass =
    "whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--gold)]";
  const rowClass = "border-t border-[rgba(201,168,76,0.10)] transition-colors duration-200 hover:bg-[rgba(201,168,76,0.05)]";
  const measure = (inch: string, cm: string) => (
    <span className="font-semibold text-[color:var(--rich-black)]">
      {inch} in <span className="font-normal text-[color:var(--muted)]">({cm} cm)</span>
    </span>
  );

  return (
    <section className="section-shell py-16 md:py-24">
      <div className="mb-12 flex flex-col items-center text-center">
        <ScrollReveal>
          <span className="section-badge">Find your fit</span>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="mt-4 text-3xl font-black md:text-5xl">
            Clothing <span className="text-[color:var(--gold)]">Size Guide</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="mt-3 max-w-xl text-muted">
            Determine your correct size from your body measurements and see how sizes compare across
            different countries.
          </p>
        </ScrollReveal>
      </div>

      <div className="space-y-10">
        {/* ── Section 1: Size Guide (Bust & Waist) ── */}
        <ScrollReveal>
          <div className="overflow-hidden rounded-[1.75rem] border border-[rgba(201,168,76,0.15)] bg-white/70 p-6 shadow-[0_20px_50px_rgba(var(--ink-rgb),0.05)] backdrop-blur-md md:p-8">
            <h3 className="text-xl font-bold text-[color:var(--rich-black)] md:text-2xl">
              Size Guide (Bust & Waist)
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
              Find your ideal clothing size by comparing your bust and waist measurements with our US
              sizing chart.
            </p>
            <div className="mt-6 -mx-2 overflow-x-auto px-2">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr>
                    <th className={headClass}>US Size</th>
                    <th className={headClass}>Letter Size</th>
                    <th className={headClass}>Bust</th>
                    <th className={headClass}>Waist</th>
                  </tr>
                </thead>
                <tbody>
                  {bustWaistSizes.map((row) => (
                    <tr key={row.us} className={rowClass}>
                      <td className={`${cellClass} font-bold text-[color:var(--rich-black)]`}>{row.us}</td>
                      <td className={cellClass}>{row.letter}</td>
                      <td className={cellClass}>{measure(row.bust, row.bustCm)}</td>
                      <td className={cellClass}>{measure(row.waist, row.waistCm)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Section 2: Numeric Size Guide ── */}
        <ScrollReveal delay={0.1}>
          <div className="overflow-hidden rounded-[1.75rem] border border-[rgba(201,168,76,0.15)] bg-white/70 p-6 shadow-[0_20px_50px_rgba(var(--ink-rgb),0.05)] backdrop-blur-md md:p-8">
            <h3 className="text-xl font-bold text-[color:var(--rich-black)] md:text-2xl">Numeric Size Guide</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
              Another way of showing {"women's"} clothing sizes using numeric sizing.
            </p>
            <div className="mt-6 -mx-2 overflow-x-auto px-2">
              <table className="w-full min-w-[480px] border-collapse text-left">
                <thead>
                  <tr>
                    <th className={headClass}>US</th>
                    <th className={headClass}>Bust</th>
                    <th className={headClass}>Waist</th>
                  </tr>
                </thead>
                <tbody>
                  {numericSizes.map((row) => (
                    <tr key={row.us} className={rowClass}>
                      <td className={`${cellClass} font-bold text-[color:var(--rich-black)]`}>{row.us}</td>
                      <td className={cellClass}>{measure(row.bust, row.bustCm)}</td>
                      <td className={cellClass}>{measure(row.waist, row.waistCm)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Section 3: Equivalent Sizes ── */}
        <ScrollReveal delay={0.1}>
          <div className="overflow-hidden rounded-[1.75rem] border border-[rgba(201,168,76,0.15)] bg-white/70 p-6 shadow-[0_20px_50px_rgba(var(--ink-rgb),0.05)] backdrop-blur-md md:p-8">
            <h3 className="text-xl font-bold text-[color:var(--rich-black)] md:text-2xl">Equivalent Sizes</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
              Different countries use different clothing size systems. The chart below shows their
              approximate equivalents.
            </p>
            <div className="mt-6 -mx-2 overflow-x-auto px-2">
              <table className="w-full min-w-[480px] border-collapse text-left">
                <thead>
                  <tr>
                    <th className={headClass}>US</th>
                    <th className={headClass}>Europe</th>
                    <th className={headClass}>UK</th>
                    <th className={headClass}>Mexico</th>
                  </tr>
                </thead>
                <tbody>
                  {equivalentSizes.map((row) => (
                    <tr key={row.us} className={rowClass}>
                      <td className={`${cellClass} font-bold text-[color:var(--rich-black)]`}>{row.us}</td>
                      <td className={cellClass}>{row.europe}</td>
                      <td className={cellClass}>{row.uk}</td>
                      <td className={cellClass}>{row.mexico}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* ── Section 4: International Size Conversion ── */}
      <div className="mt-12 flex flex-col items-center text-center">
        <ScrollReveal>
          <span className="section-badge">Shop worldwide</span>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="mt-4 text-3xl font-black md:text-5xl">
            International <span className="text-[color:var(--gold)]">Size Conversion</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="mt-3 max-w-xl text-muted">
            Compare {"women's"} clothing sizes across major shopping regions so you can order with
            confidence, wherever you are.
          </p>
        </ScrollReveal>
      </div>
      <ScrollReveal delay={0.3}>
        <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-[rgba(201,168,76,0.15)] bg-white/70 p-6 shadow-[0_20px_50px_rgba(var(--ink-rgb),0.05)] backdrop-blur-md md:p-8">
          <div className="-mx-2 overflow-x-auto px-2">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr>
                  <th className={headClass}>US</th>
                  <th className={headClass}>UK</th>
                  <th className={headClass}>Europe (EU)</th>
                  <th className={headClass}>France</th>
                  <th className={headClass}>Italy</th>
                  <th className={headClass}>Australia</th>
                  <th className={headClass}>Japan</th>
                  <th className={headClass}>Korea</th>
                  <th className={headClass}>Mexico</th>
                  <th className={headClass}>Bust</th>
                  <th className={headClass}>Waist</th>
                </tr>
              </thead>
              <tbody>
                {internationalSizes.map((row) => (
                  <tr key={row.us} className={rowClass}>
                    <td className={`${cellClass} font-bold text-[color:var(--rich-black)]`}>{row.us}</td>
                    <td className={cellClass}>{row.uk}</td>
                    <td className={cellClass}>{row.eu}</td>
                    <td className={cellClass}>{row.france}</td>
                    <td className={cellClass}>{row.italy}</td>
                    <td className={cellClass}>{row.australia}</td>
                    <td className={cellClass}>{row.japan}</td>
                    <td className={cellClass}>{row.korea}</td>
                    <td className={cellClass}>{row.mexico}</td>
                    <td className={cellClass}>{measure(row.bust, row.bustCm)}</td>
                    <td className={cellClass}>{measure(row.waist, row.waistCm)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-[color:var(--text-light)]">
            Conversions are approximate. Measurements may vary slightly by brand and garment cut.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}