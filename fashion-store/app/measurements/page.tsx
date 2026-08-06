"use client";

import { useState, useRef, useCallback, type FormEvent, type DragEvent, type ChangeEvent } from "react";
import Link from "next/link";
import { whatsappUrl } from "../data/store";
import { saveMeasurements, type SavedMeasurements } from "../../lib/measurements";

type TabKey = "men" | "women";

const menMeasurements = [
  {
    name: "Chest",
    description: "Measure around the fullest part of your chest, keeping the tape level under your arms.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2" />
        <path d="M4 12c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2" />
        <path d="M4 16c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2" />
      </svg>
    ),
  },
  {
    name: "Waist",
    description: "Measure around your natural waistline, just above the belly button, keeping the tape snug but not tight.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="9" ry="4" />
        <path d="M3 12v4c0 2.2 4 4 9 4s9-1.8 9-4v-4" />
      </svg>
    ),
  },
  {
    name: "Hips",
    description: "Measure around the fullest part of your hips and seat, keeping the tape parallel to the floor.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c-3 0-5 2-5 5 0 3 2 5 5 5s5-2 5-5c0-3-2-5-5-5z" />
        <path d="M5 21c1-4 3.5-6 7-6s6 2 7 6" />
      </svg>
    ),
  },
  {
    name: "Inseam",
    description: "Measure from the top of your inner thigh down to the floor, without shoes.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18" />
        <path d="M8 21h8" />
        <path d="M12 3c-2 0-3 1-3 3s1 3 3 3 3-1 3-3-1-3-3-3z" />
      </svg>
    ),
  },
  {
    name: "Sleeve",
    description: "Measure from the center of the back of your neck, across the shoulder, and down to the wrist.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8c4 0 6-2 8-2s4 2 8 2" />
        <path d="M6 8v8c0 2 2 3 4 3s4-1 4-3V8" />
        <path d="M14 8v8c0 2 2 3 4 3s4-1 4-3V8" />
      </svg>
    ),
  },
  {
    name: "Neck",
    description: "Measure around the base of your neck, keeping one finger between the tape and your neck for comfort.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3h8l1 5c0 3-2 5-5 5s-5-2-5-5l1-5z" />
        <path d="M12 13v8" />
        <path d="M8 21h8" />
      </svg>
    ),
  },
];

const womenMeasurements = [
  {
    name: "Bust",
    description: "Measure around the fullest part of your bust, keeping the tape level and snug across the back.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2" />
        <path d="M4 12c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2" />
        <path d="M4 16c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2" />
      </svg>
    ),
  },
  {
    name: "Waist",
    description: "Measure around your natural waistline, the narrowest part of your torso, keeping the tape relaxed.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="9" ry="4" />
        <path d="M3 12v4c0 2.2 4 4 9 4s9-1.8 9-4v-4" />
      </svg>
    ),
  },
  {
    name: "Hips",
    description: "Measure around the fullest part of your hips and seat, approximately 8 inches below your waist.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c-3 0-5 2-5 5 0 3 2 5 5 5s5-2 5-5c0-3-2-5-5-5z" />
        <path d="M5 21c1-4 3.5-6 7-6s6 2 7 6" />
      </svg>
    ),
  },
  {
    name: "Inseam",
    description: "Measure from the top of your inner thigh down to the floor, without shoes.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18" />
        <path d="M8 21h8" />
        <path d="M12 3c-2 0-3 1-3 3s1 3 3 3 3-1 3-3-1-3-3-3z" />
      </svg>
    ),
  },
  {
    name: "Sleeve",
    description: "Measure from the center of the back of your neck, across the shoulder, and down to the wrist.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8c4 0 6-2 8-2s4 2 8 2" />
        <path d="M6 8v8c0 2 2 3 4 3s4-1 4-3V8" />
        <path d="M14 8v8c0 2 2 3 4 3s4-1 4-3V8" />
      </svg>
    ),
  },
  {
    name: "Shoulder",
    description: "Measure from the edge of one shoulder across the back to the edge of the other shoulder.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8c4 0 6-2 8-2s4 2 8 2" />
        <path d="M6 8v8c0 2 2 3 4 3s4-1 4-3V8" />
      </svg>
    ),
  },
];

const menSizeChart = [
  { size: "S", chest: "34–36", waist: "28–30", hips: "34–36", sleeve: "32–33" },
  { size: "M", chest: "38–40", waist: "32–34", hips: "38–40", sleeve: "33–34" },
  { size: "L", chest: "42–44", waist: "36–38", hips: "42–44", sleeve: "34–35" },
  { size: "XL", chest: "46–48", waist: "40–42", hips: "46–48", sleeve: "35–36" },
  { size: "XXL", chest: "50–52", waist: "44–46", hips: "50–52", sleeve: "36–37" },
];

const womenSizeChart = [
  { size: "XS", bust: "32–33", waist: "24–25", hips: "34–35", sleeve: "30–31" },
  { size: "S", bust: "34–35", waist: "26–27", hips: "36–37", sleeve: "31–32" },
  { size: "M", bust: "36–37", waist: "28–29", hips: "38–39", sleeve: "32–33" },
  { size: "L", bust: "38–40", waist: "30–32", hips: "40–42", sleeve: "33–34" },
  { size: "XL", bust: "42–44", waist: "34–36", hips: "44–46", sleeve: "34–35" },
];

const tips = [
  "Use a soft measuring tape and measure over bare skin or thin clothing for the most accurate results.",
  "Stand naturally with your feet together and arms relaxed at your sides — don't hold your breath or suck in.",
  "Keep the tape level and parallel to the floor. It should be snug but never tight enough to dig in.",
  "For the most precise fit, ask someone to help you measure hard-to-reach areas like your back and shoulders.",
  "Compare your measurements to the chart and, if you fall between sizes, we recommend sizing up for a more comfortable fit.",
];

// ── Measurement Reference Photos ──
const MAX_PHOTO_SIZE_MB = 5;
const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_PHOTO_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

const photoExamples = [
  "Front view",
  "Side view",
  "Back view",
  "Shoulder measurement",
  "Chest measurement",
  "Waist measurement",
  "Trouser measurement",
];

const womenPhotoExamples = [
  "Front view",
  "Side view",
  "Back view",
  "Bust measurement",
  "Waist measurement",
  "Hip measurement",
  "Dress measurement",
];

type UploadedPhoto = {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
};

// Complete men's measurement form fields (all in inches)
const menFormFields = [
  "Neck",
  "Shoulder Width",
  "Chest",
  "Waist",
  "Hip",
  "Biceps",
  "Sleeve Length",
  "Wrist",
  "Shirt Length",
  "Thigh",
  "Knee",
  "Calf",
  "Inseam",
  "Outseam",
  "Trouser Length",
  "Ankle",
] as const;

type MenFormValues = Record<(typeof menFormFields)[number], string>;

const initialMenFormValues: MenFormValues = menFormFields.reduce(
  (acc, field) => ({ ...acc, [field]: "" }),
  {} as MenFormValues,
);

// Complete women's measurement form fields (all in inches)
const womenFormFields = [
  "Shoulder",
  "Bust",
  "Under Bust",
  "Waist",
  "Hip",
  "Shoulder to Bust",
  "Shoulder to Waist",
  "Shoulder to Knee",
  "Shoulder to Floor",
  "Sleeve Length",
  "Armhole",
  "Biceps",
  "Wrist",
  "Neck",
  "Thigh",
  "Knee",
  "Calf",
  "Dress Length",
] as const;

type WomenFormValues = Record<(typeof womenFormFields)[number], string>;

const initialWomenFormValues: WomenFormValues = womenFormFields.reduce(
  (acc, field) => ({ ...acc, [field]: "" }),
  {} as WomenFormValues,
);

export default function MeasurementsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("men");
  const [menFormValues, setMenFormValues] = useState<MenFormValues>(initialMenFormValues);
  const [menFormErrors, setMenFormErrors] = useState<Partial<Record<(typeof menFormFields)[number], string>>>({});
  const [menFormSuccess, setMenFormSuccess] = useState(false);
  const [menFormAttempted, setMenFormAttempted] = useState(false);

  // ── Photo upload state ──
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoIdCounter = useRef(0);

  // Validate and add photo files
  const addPhotoFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: UploadedPhoto[] = [];
    let errorMessage: string | null = null;

    fileArray.forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      const isAllowedType = ALLOWED_PHOTO_TYPES.includes(file.type) || ALLOWED_PHOTO_EXTENSIONS.includes(ext);

      if (!isAllowedType) {
        errorMessage = `"${file.name}" is not supported. Please upload JPG, PNG, or WebP images only.`;
        return;
      }

      if (file.size > MAX_PHOTO_SIZE_BYTES) {
        errorMessage = `"${file.name}" exceeds the ${MAX_PHOTO_SIZE_MB}MB maximum file size.`;
        return;
      }

      photoIdCounter.current += 1;
      validFiles.push({
        id: `photo-${photoIdCounter.current}`,
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      });
    });

    if (errorMessage) {
      setPhotoError(errorMessage);
    } else {
      setPhotoError(null);
    }

    if (validFiles.length > 0) {
      setPhotos((prev) => [...prev, ...validFiles]);
    }
  }, []);

  // Handle file input change
  const handlePhotoInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addPhotoFiles(e.target.files);
    }
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  // Handle drag over
  const handlePhotoDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle drag leave
  const handlePhotoDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Handle drop
  const handlePhotoDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addPhotoFiles(e.dataTransfer.files);
    }
  };

  // Remove a photo
  const handlePhotoRemove = (id: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) {
        URL.revokeObjectURL(photo.previewUrl);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const activeMeasurements = activeTab === "men" ? menMeasurements : womenMeasurements;
  const activeChart = activeTab === "men" ? menSizeChart : womenSizeChart;
  const chartColumns = activeTab === "men"
    ? ["Size", "Chest (in)", "Waist (in)", "Hips (in)", "Sleeve (in)"]
    : ["Size", "Bust (in)", "Waist (in)", "Hips (in)", "Sleeve (in)"];

  const cellClass = "whitespace-nowrap px-4 py-3.5 text-sm text-[color:var(--muted)]";
  const headClass =
    "whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--gold)]";
  const rowClass = "border-t border-[rgba(201,168,76,0.10)] transition-colors duration-200 hover:bg-[rgba(201,168,76,0.05)]";

  // ── Women's form state ──
  const [womenFormValues, setWomenFormValues] = useState<WomenFormValues>(initialWomenFormValues);
  const [womenFormErrors, setWomenFormErrors] = useState<Partial<Record<(typeof womenFormFields)[number], string>>>({});
  const [womenFormSuccess, setWomenFormSuccess] = useState(false);
  const [womenFormAttempted, setWomenFormAttempted] = useState(false);

  // Handle men's form input changes — numbers only, positive values
  const handleMenFormChange = (field: (typeof menFormFields)[number], value: string) => {
    // Allow only digits and a single decimal point
    const sanitized = value.replace(/[^\d.]/g, "");
    // Prevent multiple decimal points
    const parts = sanitized.split(".");
    const cleanValue = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : sanitized;

    setMenFormValues((prev) => ({ ...prev, [field]: cleanValue }));

    // Clear error for this field as user types
    if (menFormErrors[field]) {
      setMenFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Handle women's form input changes — numbers only, positive values
  const handleWomenFormChange = (field: (typeof womenFormFields)[number], value: string) => {
    // Allow only digits and a single decimal point
    const sanitized = value.replace(/[^\d.]/g, "");
    // Prevent multiple decimal points
    const parts = sanitized.split(".");
    const cleanValue = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : sanitized;

    setWomenFormValues((prev) => ({ ...prev, [field]: cleanValue }));

    // Clear error for this field as user types
    if (womenFormErrors[field]) {
      setWomenFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Validate a single men's field
  const validateMenField = (field: (typeof menFormFields)[number], value: string): string | undefined => {
    if (!value.trim()) {
      return "This field is required";
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      return "Please enter a valid number";
    }
    if (num <= 0) {
      return "Must be a positive value";
    }
    return undefined;
  };

  // Validate a single women's field
  const validateWomenField = (field: (typeof womenFormFields)[number], value: string): string | undefined => {
    if (!value.trim()) {
      return "This field is required";
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      return "Please enter a valid number";
    }
    if (num <= 0) {
      return "Must be a positive value";
    }
    return undefined;
  };

  // Convert uploaded photo files to data URLs for persistence
  const photosToDataUrls = useCallback(async (): Promise<{ name: string; size: number; dataUrl: string }[]> => {
    const results: { name: string; size: number; dataUrl: string }[] = [];
    for (const photo of photos) {
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(photo.file);
        });
        results.push({ name: photo.name, size: photo.size, dataUrl });
      } catch {
        // Skip photos that fail to convert
      }
    }
    return results;
  }, [photos]);

  // Persist measurements to localStorage so they survive page navigation
  const persistMeasurements = useCallback(
    async (type: "men" | "women", values: Record<string, string>) => {
      const photoData = await photosToDataUrls();
      const data: SavedMeasurements = {
        type,
        values,
        photos: photoData,
        savedAt: new Date().toISOString(),
      };
      saveMeasurements(data);
    },
    [photosToDataUrls],
  );

  // Validate all men's fields on submit
  const handleMenFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMenFormAttempted(true);

    const newErrors: Partial<Record<(typeof menFormFields)[number], string>> = {};
    let hasErrors = false;

    menFormFields.forEach((field) => {
      const error = validateMenField(field, menFormValues[field]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    setMenFormErrors(newErrors);
    setMenFormSuccess(!hasErrors);

    if (!hasErrors) {
      await persistMeasurements("men", menFormValues);
    }
  };

  // Validate all women's fields on submit
  const handleWomenFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWomenFormAttempted(true);

    const newErrors: Partial<Record<(typeof womenFormFields)[number], string>> = {};
    let hasErrors = false;

    womenFormFields.forEach((field) => {
      const error = validateWomenField(field, womenFormValues[field]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    setWomenFormErrors(newErrors);
    setWomenFormSuccess(!hasErrors);

    if (!hasErrors) {
      await persistMeasurements("women", womenFormValues);
    }
  };

  return (
    <div className="section-shell py-8 md:py-12">
      {/* ── Page header ── */}
      <section className="glass-surface no-hover rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="section-badge">Measurements</span>
            <h1 className="text-4xl font-black tracking-tight text-[color:var(--rich-black)] md:text-5xl">
              Find your <span className="gradient-text">perfect fit</span>
            </h1>
            <p className="max-w-2xl text-muted">
              Accurate measurements are the foundation of impeccable tailoring. Follow our guides to
              measure yourself correctly and discover the size that fits you flawlessly.
            </p>
          </div>
          <Link href={whatsappUrl} target="_blank" rel="noreferrer" className="button-secondary shrink-0">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Ask a stylist
          </Link>
        </div>
      </section>

      {/* ── Tab switcher ── */}
      <div className="mt-10 flex justify-center">
        <div
          role="tablist"
          aria-label="Measurement guides"
          className="relative grid w-full max-w-xl grid-cols-2 gap-1 rounded-full border border-[rgba(201,168,76,0.20)] bg-white/60 p-1.5 shadow-[0_8px_32px_rgba(var(--ink-rgb),0.06)] backdrop-blur-md"
        >
          {/* Sliding gold indicator */}
          <span
            aria-hidden="true"
            className={`absolute inset-y-1.5 w-[calc(50%-0.375rem)] rounded-full bg-[var(--gold-gradient)] shadow-[0_6px_20px_rgba(201,168,76,0.35)] transition-transform duration-500 ${
              activeTab === "men" ? "translate-x-1.5" : "translate-x-[calc(100%+0.75rem)]"
            }`}
            style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
          />
          <button
            type="button"
            role="tab"
            id="tab-men"
            aria-selected={activeTab === "men"}
            aria-controls="panel-men"
            onClick={() => setActiveTab("men")}
            className={`relative z-10 flex items-center justify-center gap-2 rounded-full px-4 py-3.5 text-sm font-extrabold uppercase tracking-[0.08em] transition-colors duration-300 md:text-base ${
              activeTab === "men" ? "text-white" : "text-[color:var(--muted)] hover:text-[color:var(--gold)]"
            }`}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="3" />
              <path d="M12 8v5" />
              <path d="M8 13h8" />
              <path d="M12 13v8" />
              <path d="M8 21l4-4 4 4" />
            </svg>
            Men's
          </button>
          <button
            type="button"
            role="tab"
            id="tab-women"
            aria-selected={activeTab === "women"}
            aria-controls="panel-women"
            onClick={() => setActiveTab("women")}
            className={`relative z-10 flex items-center justify-center gap-2 rounded-full px-4 py-3.5 text-sm font-extrabold uppercase tracking-[0.08em] transition-colors duration-300 md:text-base ${
              activeTab === "women" ? "text-white" : "text-[color:var(--muted)] hover:text-[color:var(--gold)]"
            }`}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="3" />
              <path d="M12 8v5" />
              <path d="M8 13h8" />
              <path d="M12 13v8" />
              <path d="M8 21l4-4 4 4" />
            </svg>
            Women's
          </button>
        </div>
      </div>

      {/* ── Tab panels ── */}
      <div className="mt-10">
        {/* Men's panel */}
        <div
          key="panel-men"
          role="tabpanel"
          id="panel-men"
          aria-labelledby="tab-men"
          hidden={activeTab !== "men"}
          className={`measurement-panel ${activeTab === "men" ? "measurement-panel-enter" : ""}`}
        >
          <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-3">
            {/* Measurement instructions */}
            <div className="overflow-hidden rounded-2xl border border-[rgba(201,168,76,0.15)] bg-white/70 p-4 shadow-[0_12px_32px_rgba(var(--ink-rgb),0.04)] backdrop-blur-md md:p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(201,168,76,0.12)] text-[color:var(--gold)]">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v18" />
                    <path d="M8 21h8" />
                    <path d="M12 3c-2 0-3 1-3 3s1 3 3 3 3-1 3-3-1-3-3-3z" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-base font-black text-[color:var(--rich-black)] md:text-lg">
                    How to measure — <span className="text-[color:var(--gold)]">Men</span>
                  </h2>
                  <p className="text-xs text-muted">Six key measurements for the perfect fit</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {activeMeasurements.map((m) => (
                  <div
                    key={m.name}
                    className="group rounded-xl border border-[rgba(201,168,76,0.10)] bg-white/60 p-3 transition-all duration-300 hover:border-[rgba(201,168,76,0.35)] hover:bg-[rgba(201,168,76,0.05)] hover:shadow-[0_8px_24px_rgba(201,168,76,0.10)]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(201,168,76,0.10)] text-[color:var(--gold)] transition-colors duration-300 group-hover:bg-[var(--gold-gradient)] group-hover:text-white">
                        {m.icon}
                      </span>
                      <h3 className="text-xs font-extrabold uppercase tracking-[0.06em] text-[color:var(--rich-black)]">
                        {m.name}
                      </h3>
                    </div>
                    <p className="mt-2 text-[11px] leading-4 text-muted">{m.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Size chart */}
            <div className="overflow-hidden rounded-2xl border border-[rgba(201,168,76,0.15)] bg-white/70 p-4 shadow-[0_12px_32px_rgba(var(--ink-rgb),0.04)] backdrop-blur-md md:p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(201,168,76,0.12)] text-[color:var(--gold)]">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M3 10h18" />
                    <path d="M9 4v6" />
                    <path d="M15 4v6" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-base font-black text-[color:var(--rich-black)] md:text-lg">
                    {activeTab === "men" ? "Men's" : "Women's"} <span className="text-[color:var(--gold)]">Size Chart</span>
                  </h2>
                  <p className="text-xs text-muted">Measurements in inches</p>
                </div>
              </div>

              <div className="mt-4 -mx-2 overflow-x-auto px-2">
                <table className="w-full min-w-[380px] border-collapse text-left">
                  <thead>
                    <tr>
                      {chartColumns.map((col) => (
                        <th key={col} className={headClass}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeChart.map((row) => (
                      <tr key={row.size} className={rowClass}>
                        <td className={`${cellClass} font-bold text-[color:var(--rich-black)]`}>{row.size}</td>
                        {Object.entries(row)
                          .filter(([key]) => key !== "size")
                          .map(([key, value]) => (
                            <td key={key} className={cellClass}>{value}</td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[11px] text-[color:var(--text-light)]">
                Sizes are approximate. Our atelier will take exact measurements.
              </p>
            </div>

            {/* Tips card */}
            <div className="rounded-2xl border border-[rgba(201,168,76,0.15)] bg-white/70 p-4 shadow-[0_12px_32px_rgba(var(--ink-rgb),0.04)] backdrop-blur-md md:p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(201,168,76,0.12)] text-[color:var(--gold)]">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                    <path d="M12 2a7 7 0 00-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0012 2z" />
                  </svg>
                </span>
                <h2 className="text-base font-black text-[color:var(--rich-black)] md:text-lg">
                  Pro <span className="text-[color:var(--gold)]">Tips</span>
                </h2>
              </div>
              <ul className="mt-4 space-y-2.5">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs leading-5 text-muted">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(201,168,76,0.12)] text-[10px] font-black text-[color:var(--gold)]">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Men's Measurement Form ── */}
          <form
            onSubmit={handleMenFormSubmit}
            noValidate
            className="mt-10 rounded-[1.75rem] border border-[rgba(201,168,76,0.15)] bg-white/70 p-6 shadow-[0_20px_50px_rgba(var(--ink-rgb),0.05)] backdrop-blur-md md:p-8"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(201,168,76,0.12)] text-[color:var(--gold)]">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-xl font-black text-[color:var(--rich-black)] md:text-2xl">
                    Men's <span className="text-[color:var(--gold)]">Measurement Form</span>
                  </h2>
                  <p className="text-sm text-muted">Enter all measurements in inches</p>
                </div>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(201,168,76,0.20)] bg-[rgba(201,168,76,0.08)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--gold)]">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18" />
                  <path d="M8 21h8" />
                  <path d="M12 3c-2 0-3 1-3 3s1 3 3 3 3-1 3-3-1-3-3-3z" />
                </svg>
                All fields required
              </span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {menFormFields.map((field) => {
                const error = menFormErrors[field];
                const hasError = !!error;
                return (
                  <div key={field} className="group">
                    <label
                      htmlFor={`men-${field.toLowerCase().replace(/\s+/g, "-")}`}
                      className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-[0.06em] text-[color:var(--muted)]"
                    >
                      <span>{field}</span>
                      <span className="text-[10px] font-semibold normal-case tracking-normal text-[color:var(--gold)]">inches</span>
                    </label>
                    <div className="relative">
                      <input
                        id={`men-${field.toLowerCase().replace(/\s+/g, "-")}`}
                        type="text"
                        inputMode="decimal"
                        placeholder="0.0"
                        value={menFormValues[field]}
                        onChange={(e) => handleMenFormChange(field, e.target.value)}
                        aria-invalid={hasError}
                        aria-describedby={hasError ? `men-${field.toLowerCase().replace(/\s+/g, "-")}-error` : undefined}
                        className={`input-field pr-14 ${hasError ? "!border-[rgba(212,120,106,0.6)] !shadow-[0_0_0_4px_rgba(212,120,106,0.12)]" : ""}`}
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-bold text-[color:var(--gold)]">
                        in
                      </span>
                    </div>
                    {hasError && (
                      <p
                        id={`men-${field.toLowerCase().replace(/\s+/g, "-")}-error`}
                        className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-[#D4786A]"
                      >
                        <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4" />
                          <path d="M12 16h.01" />
                        </svg>
                        {error}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <p className={`text-xs ${menFormSuccess ? "font-bold text-[color:var(--gold)]" : "text-[color:var(--text-light)]"}`}>
                {menFormSuccess
                  ? "✓ All measurements recorded successfully."
                  : menFormAttempted
                    ? "Please fix the highlighted fields and try again."
                    : "All 16 fields are required. Values must be positive numbers."}
              </p>
              <button type="submit" className="button-primary px-8 py-3">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Submit Measurements
              </button>
            </div>
          </form>

          {/* ── Measurement Reference Photos ── */}
          <section className="mt-10 rounded-[1.75rem] border border-[rgba(201,168,76,0.15)] bg-white/70 p-6 shadow-[0_20px_50px_rgba(var(--ink-rgb),0.05)] backdrop-blur-md md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(201,168,76,0.12)] text-[color:var(--gold)]">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-xl font-black text-[color:var(--rich-black)] md:text-2xl">
                    Measurement <span className="text-[color:var(--gold)]">Reference Photos</span>
                  </h2>
                  <p className="text-sm text-muted">Upload photos showing your body measurements for accurate tailoring</p>
                </div>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(201,168,76,0.20)] bg-[rgba(201,168,76,0.08)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--gold)]">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <path d="M17 8l-5-5-5 5" />
                  <path d="M12 3v12" />
                </svg>
                JPG · PNG · WebP
              </span>
            </div>

            {/* Example photo types */}
            <div className="mt-6 flex flex-wrap gap-2">
              {photoExamples.map((example) => (
                <span
                  key={example}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.06)] px-3 py-1 text-xs font-semibold text-[color:var(--muted)]"
                >
                  <svg className="h-3 w-3 text-[color:var(--gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {example}
                </span>
              ))}
            </div>

            {/* Drag & drop zone */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={handlePhotoDragOver}
              onDragLeave={handlePhotoDragLeave}
              onDrop={handlePhotoDrop}
              className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all duration-300 ${
                isDragging
                  ? "border-[rgba(201,168,76,0.7)] bg-[rgba(201,168,76,0.10)] shadow-[0_0_0_4px_rgba(201,168,76,0.12)]"
                  : "border-[rgba(201,168,76,0.25)] bg-white/40 hover:border-[rgba(201,168,76,0.5)] hover:bg-[rgba(201,168,76,0.05)]"
              }`}
            >
              <span className={`flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 ${
                isDragging ? "bg-[var(--gold-gradient)] text-white scale-110" : "bg-[rgba(201,168,76,0.12)] text-[color:var(--gold)]"
              }`}>
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <path d="M17 8l-5-5-5 5" />
                  <path d="M12 3v12" />
                </svg>
              </span>
              <p className="mt-4 text-base font-extrabold text-[color:var(--rich-black)]">
                {isDragging ? "Drop your photos here" : "Drag & drop your photos here"}
              </p>
              <p className="mt-1 text-sm text-muted">
                or <span className="font-bold text-[color:var(--gold)] underline underline-offset-2">browse files</span>
              </p>
              <p className="mt-3 text-xs text-[color:var(--text-light)]">
                Maximum {MAX_PHOTO_SIZE_MB}MB per file · JPG, PNG, or WebP
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                multiple
                onChange={handlePhotoInputChange}
                className="hidden"
                aria-label="Upload measurement reference photos"
              />
            </div>

            {/* Error message */}
            {photoError && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-[rgba(212,120,106,0.30)] bg-[rgba(212,120,106,0.08)] px-4 py-3 text-sm font-semibold text-[#D4786A]">
                <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
                {photoError}
              </div>
            )}

            {/* Uploaded photo previews */}
            {photos.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[color:var(--gold)]">
                    Uploaded Photos ({photos.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      photos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
                      setPhotos([]);
                    }}
                    className="text-xs font-bold text-[color:var(--muted)] transition-colors hover:text-[#D4786A]"
                  >
                    Clear all
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative overflow-hidden rounded-2xl border border-[rgba(201,168,76,0.15)] bg-white/60 shadow-[0_8px_24px_rgba(var(--ink-rgb),0.06)]"
                    >
                      <div className="aspect-[4/5] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.previewUrl}
                          alt={photo.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(var(--scrim-rgb),0.92)] via-[rgba(var(--scrim-rgb),0.6)] to-transparent p-3 pt-10">
                        <p className="truncate text-xs font-bold text-[color:var(--rich-black)]">{photo.name}</p>
                        <p className="mt-0.5 text-[10px] font-semibold text-[color:var(--gold)]">{formatFileSize(photo.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePhotoRemove(photo.id)}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(26,26,26,0.75)] text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-[#D4786A]"
                        aria-label={`Remove ${photo.name}`}
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18" />
                          <path d="M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Women's panel */}
        <div
          key="panel-women"
          role="tabpanel"
          id="panel-women"
          aria-labelledby="tab-women"
          hidden={activeTab !== "women"}
          className={`measurement-panel ${activeTab === "women" ? "measurement-panel-enter" : ""}`}
        >
          <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-3">
            {/* Measurement instructions */}
            <div className="overflow-hidden rounded-2xl border border-[rgba(201,168,76,0.15)] bg-white/70 p-4 shadow-[0_12px_32px_rgba(var(--ink-rgb),0.04)] backdrop-blur-md md:p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(201,168,76,0.12)] text-[color:var(--gold)]">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v18" />
                    <path d="M8 21h8" />
                    <path d="M12 3c-2 0-3 1-3 3s1 3 3 3 3-1 3-3-1-3-3-3z" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-base font-black text-[color:var(--rich-black)] md:text-lg">
                    How to measure — <span className="text-[color:var(--gold)]">Women</span>
                  </h2>
                  <p className="text-xs text-muted">Six key measurements for the perfect fit</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {activeMeasurements.map((m) => (
                  <div
                    key={m.name}
                    className="group rounded-xl border border-[rgba(201,168,76,0.10)] bg-white/60 p-3 transition-all duration-300 hover:border-[rgba(201,168,76,0.35)] hover:bg-[rgba(201,168,76,0.05)] hover:shadow-[0_8px_24px_rgba(201,168,76,0.10)]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(201,168,76,0.10)] text-[color:var(--gold)] transition-colors duration-300 group-hover:bg-[var(--gold-gradient)] group-hover:text-white">
                        {m.icon}
                      </span>
                      <h3 className="text-xs font-extrabold uppercase tracking-[0.06em] text-[color:var(--rich-black)]">
                        {m.name}
                      </h3>
                    </div>
                    <p className="mt-2 text-[11px] leading-4 text-muted">{m.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Size chart */}
            <div className="overflow-hidden rounded-2xl border border-[rgba(201,168,76,0.15)] bg-white/70 p-4 shadow-[0_12px_32px_rgba(var(--ink-rgb),0.04)] backdrop-blur-md md:p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(201,168,76,0.12)] text-[color:var(--gold)]">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M3 10h18" />
                    <path d="M9 4v6" />
                    <path d="M15 4v6" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-base font-black text-[color:var(--rich-black)] md:text-lg">
                    {activeTab === "men" ? "Men's" : "Women's"} <span className="text-[color:var(--gold)]">Size Chart</span>
                  </h2>
                  <p className="text-xs text-muted">Measurements in inches</p>
                </div>
              </div>

              <div className="mt-4 -mx-2 overflow-x-auto px-2">
                <table className="w-full min-w-[380px] border-collapse text-left">
                  <thead>
                    <tr>
                      {chartColumns.map((col) => (
                        <th key={col} className={headClass}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeChart.map((row) => (
                      <tr key={row.size} className={rowClass}>
                        <td className={`${cellClass} font-bold text-[color:var(--rich-black)]`}>{row.size}</td>
                        {Object.entries(row)
                          .filter(([key]) => key !== "size")
                          .map(([key, value]) => (
                            <td key={key} className={cellClass}>{value}</td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[11px] text-[color:var(--text-light)]">
                Sizes are approximate. Our atelier will take exact measurements.
              </p>
            </div>

            {/* Tips card */}
            <div className="rounded-2xl border border-[rgba(201,168,76,0.15)] bg-white/70 p-4 shadow-[0_12px_32px_rgba(var(--ink-rgb),0.04)] backdrop-blur-md md:p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(201,168,76,0.12)] text-[color:var(--gold)]">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                    <path d="M12 2a7 7 0 00-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0012 2z" />
                  </svg>
                </span>
                <h2 className="text-base font-black text-[color:var(--rich-black)] md:text-lg">
                  Pro <span className="text-[color:var(--gold)]">Tips</span>
                </h2>
              </div>
              <ul className="mt-4 space-y-2.5">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs leading-5 text-muted">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(201,168,76,0.12)] text-[10px] font-black text-[color:var(--gold)]">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Women's Measurement Form ── */}
          <form
            onSubmit={handleWomenFormSubmit}
            noValidate
            className="mt-10 rounded-[1.75rem] border border-[rgba(201,168,76,0.15)] bg-white/70 p-6 shadow-[0_20px_50px_rgba(var(--ink-rgb),0.05)] backdrop-blur-md md:p-8"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(201,168,76,0.12)] text-[color:var(--gold)]">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-xl font-black text-[color:var(--rich-black)] md:text-2xl">
                    Women's <span className="text-[color:var(--gold)]">Measurement Form</span>
                  </h2>
                  <p className="text-sm text-muted">Enter all measurements in inches</p>
                </div>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(201,168,76,0.20)] bg-[rgba(201,168,76,0.08)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--gold)]">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18" />
                  <path d="M8 21h8" />
                  <path d="M12 3c-2 0-3 1-3 3s1 3 3 3 3-1 3-3-1-3-3-3z" />
                </svg>
                All fields required
              </span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {womenFormFields.map((field) => {
                const error = womenFormErrors[field];
                const hasError = !!error;
                return (
                  <div key={field} className="group">
                    <label
                      htmlFor={`women-${field.toLowerCase().replace(/\s+/g, "-")}`}
                      className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-[0.06em] text-[color:var(--muted)]"
                    >
                      <span>{field}</span>
                      <span className="text-[10px] font-semibold normal-case tracking-normal text-[color:var(--gold)]">inches</span>
                    </label>
                    <div className="relative">
                      <input
                        id={`women-${field.toLowerCase().replace(/\s+/g, "-")}`}
                        type="text"
                        inputMode="decimal"
                        placeholder="0.0"
                        value={womenFormValues[field]}
                        onChange={(e) => handleWomenFormChange(field, e.target.value)}
                        aria-invalid={hasError}
                        aria-describedby={hasError ? `women-${field.toLowerCase().replace(/\s+/g, "-")}-error` : undefined}
                        className={`input-field pr-14 ${hasError ? "!border-[rgba(212,120,106,0.6)] !shadow-[0_0_0_4px_rgba(212,120,106,0.12)]" : ""}`}
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-bold text-[color:var(--gold)]">
                        in
                      </span>
                    </div>
                    {hasError && (
                      <p
                        id={`women-${field.toLowerCase().replace(/\s+/g, "-")}-error`}
                        className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-[#D4786A]"
                      >
                        <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4" />
                          <path d="M12 16h.01" />
                        </svg>
                        {error}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <p className={`text-xs ${womenFormSuccess ? "font-bold text-[color:var(--gold)]" : "text-[color:var(--text-light)]"}`}>
                {womenFormSuccess
                  ? "✓ All measurements recorded successfully."
                  : womenFormAttempted
                    ? "Please fix the highlighted fields and try again."
                    : "All 18 fields are required. Values must be positive numbers."}
              </p>
              <button type="submit" className="button-primary px-8 py-3">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Submit Measurements
              </button>
            </div>
          </form>

          {/* ── Women's Measurement Reference Photos ── */}
          <section className="mt-10 rounded-[1.75rem] border border-[rgba(201,168,76,0.15)] bg-white/70 p-6 shadow-[0_20px_50px_rgba(var(--ink-rgb),0.05)] backdrop-blur-md md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(201,168,76,0.12)] text-[color:var(--gold)]">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-xl font-black text-[color:var(--rich-black)] md:text-2xl">
                    Women's <span className="text-[color:var(--gold)]">Reference Photos</span>
                  </h2>
                  <p className="text-sm text-muted">Upload photos of your measurements for accurate tailoring</p>
                </div>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(201,168,76,0.20)] bg-[rgba(201,168,76,0.08)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--gold)]">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <path d="M17 8l-5-5-5 5" />
                  <path d="M12 3v12" />
                </svg>
                JPG · PNG · WebP
              </span>
            </div>

            {/* Example photo types */}
            <div className="mt-6 flex flex-wrap gap-2">
              {womenPhotoExamples.map((example) => (
                <span
                  key={example}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.06)] px-3 py-1 text-xs font-semibold text-[color:var(--muted)]"
                >
                  <svg className="h-3 w-3 text-[color:var(--gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {example}
                </span>
              ))}
            </div>

            {/* Drag & drop zone */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={handlePhotoDragOver}
              onDragLeave={handlePhotoDragLeave}
              onDrop={handlePhotoDrop}
              className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all duration-300 ${
                isDragging
                  ? "border-[rgba(201,168,76,0.7)] bg-[rgba(201,168,76,0.10)] shadow-[0_0_0_4px_rgba(201,168,76,0.12)]"
                  : "border-[rgba(201,168,76,0.25)] bg-white/40 hover:border-[rgba(201,168,76,0.5)] hover:bg-[rgba(201,168,76,0.05)]"
              }`}
            >
              <span className={`flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 ${
                isDragging ? "bg-[var(--gold-gradient)] text-white scale-110" : "bg-[rgba(201,168,76,0.12)] text-[color:var(--gold)]"
              }`}>
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <path d="M17 8l-5-5-5 5" />
                  <path d="M12 3v12" />
                </svg>
              </span>
              <p className="mt-4 text-base font-extrabold text-[color:var(--rich-black)]">
                {isDragging ? "Drop your photos here" : "Drag & drop your photos here"}
              </p>
              <p className="mt-1 text-sm text-muted">
                or <span className="font-bold text-[color:var(--gold)] underline underline-offset-2">browse files</span>
              </p>
              <p className="mt-3 text-xs text-[color:var(--text-light)]">
                Maximum {MAX_PHOTO_SIZE_MB}MB per file · JPG, PNG, or WebP
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                multiple
                onChange={handlePhotoInputChange}
                className="hidden"
                aria-label="Upload women's measurement reference photos"
              />
            </div>

            {/* Error message */}
            {photoError && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-[rgba(212,120,106,0.30)] bg-[rgba(212,120,106,0.08)] px-4 py-3 text-sm font-semibold text-[#D4786A]">
                <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
                {photoError}
              </div>
            )}

            {/* Uploaded photo previews */}
            {photos.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[color:var(--gold)]">
                    Uploaded Photos ({photos.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      photos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
                      setPhotos([]);
                    }}
                    className="text-xs font-bold text-[color:var(--muted)] transition-colors hover:text-[#D4786A]"
                  >
                    Clear all
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative overflow-hidden rounded-2xl border border-[rgba(201,168,76,0.15)] bg-white/60 shadow-[0_8px_24px_rgba(var(--ink-rgb),0.06)]"
                    >
                      <div className="aspect-[4/5] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.previewUrl}
                          alt={photo.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(var(--scrim-rgb),0.92)] via-[rgba(var(--scrim-rgb),0.6)] to-transparent p-3 pt-10">
                        <p className="truncate text-xs font-bold text-[color:var(--rich-black)]">{photo.name}</p>
                        <p className="mt-0.5 text-[10px] font-semibold text-[color:var(--gold)]">{formatFileSize(photo.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePhotoRemove(photo.id)}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(26,26,26,0.75)] text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-[#D4786A]"
                        aria-label={`Remove ${photo.name}`}
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18" />
                          <path d="M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}