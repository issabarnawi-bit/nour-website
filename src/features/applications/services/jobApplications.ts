import { createClient } from "../../../lib/supabase/client";

export type EmploymentType =
  | "full_time"
  | "part_time"
  | "remote"
  | "internship"
  | "other";

export type JobApplicationInput = {
  fullName: string;
  email: string;
  phone: string;
  country?: string;
  city?: string;
  specialization?: string;
  currentJobTitle?: string;
  yearsOfExperience?: number | null;
  employmentType: EmploymentType;
  linkedinUrl?: string;
  message?: string;
  privacyAccepted: boolean;
};

export type SubmitJobApplicationResult = {
  id: string;
};

const CV_BUCKET = "application-files";
const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_CV_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function clean(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function validateCv(file: File) {
  if (!ALLOWED_CV_TYPES.has(file.type)) {
    throw new Error("صيغة السيرة الذاتية غير مدعومة. استخدم PDF أو DOC أو DOCX.");
  }

  if (file.size > MAX_CV_SIZE_BYTES) {
    throw new Error("حجم السيرة الذاتية يجب ألا يتجاوز 5MB.");
  }
}

export async function submitJobApplication(
  values: JobApplicationInput,
  cvFile?: File | null,
): Promise<SubmitJobApplicationResult> {
  if (!values.privacyAccepted) {
    throw new Error("يجب الموافقة على سياسة الخصوصية قبل إرسال الطلب.");
  }

  const supabase = createClient();
  const applicationId = crypto.randomUUID();

  let cvPath: string | null = null;

  if (cvFile) {
    validateCv(cvFile);

    const safeName =
      sanitizeFileName(cvFile.name) ||
      `cv-${Date.now()}.pdf`;

    cvPath = `job-applications/${applicationId}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(CV_BUCKET)
      .upload(cvPath, cvFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: cvFile.type,
      });

    if (uploadError) {
      throw new Error(`تعذر رفع السيرة الذاتية: ${uploadError.message}`);
    }
  }

  const { error: insertError } = await supabase
    .from("job_applications")
    .insert({
      id: applicationId,
      full_name: values.fullName.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      country: clean(values.country),
      city: clean(values.city),
      specialization: clean(values.specialization),
      current_job_title: clean(values.currentJobTitle),
      years_of_experience:
        values.yearsOfExperience === null ||
        values.yearsOfExperience === undefined
          ? null
          : values.yearsOfExperience,
      employment_type: values.employmentType,
      linkedin_url: clean(values.linkedinUrl),
      cv_path: cvPath,
      message: clean(values.message),
      privacy_accepted: true,
      status: "new",
      source: "website",
    });

  if (insertError) {
    if (cvPath) {
      await supabase.storage.from(CV_BUCKET).remove([cvPath]);
    }

    throw new Error(`تعذر إرسال الطلب: ${insertError.message}`);
  }

  return { id: applicationId };
}