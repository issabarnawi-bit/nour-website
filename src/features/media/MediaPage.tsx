"use client";

import Link from "next/link";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";

import Button from "../../components/ui/Button";
import { useLanguage } from "../../core/i18n";
import { useToast } from "../../core/notifications";
import { createClient } from "../../lib/supabase/client";

import {
  deleteMedia,
  getMedia,
  uploadMedia,
} from "./services";
import type {
  MediaItem,
} from "./services";

export default function MediaPage() {
  const { language } = useLanguage();
  const { showToast } = useToast();

  const isArabic = language === "ar";

  const supabase = useMemo(() => {
    return createClient();
  }, []);

  const [isUploadOpen, setIsUploadOpen] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [altAr, setAltAr] =
    useState("");

  const [altEn, setAltEn] =
    useState("");

  const [isUploading, setIsUploading] =
    useState(false);

  const [uploadError, setUploadError] =
    useState("");

  const [
    deletingMediaId,
    setDeletingMediaId,
  ] = useState<string | null>(null);

  const [searchValue, setSearchValue] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState<"all" | "images" | "files">(
      "all",
    );

  const previewUrl = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    return URL.createObjectURL(
      selectedFile,
    );
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(
          previewUrl,
        );
      }
    };
  }, [previewUrl]);

  const {
    data: mediaItems = [],
    isLoading,
    isError,
    error,
    refetch: refetchMedia,
  } = useQuery({
    queryKey: ["media"],
    queryFn: () => getMedia(supabase),
  });

  function resetUploadForm() {
    setSelectedFile(null);
    setAltAr("");
    setAltEn("");
    setUploadError("");
  }

  function openUploadDialog() {
    resetUploadForm();
    setIsUploadOpen(true);
  }

  function closeUploadDialog() {
    if (isUploading) {
      return;
    }

    resetUploadForm();
    setIsUploadOpen(false);
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0] ?? null;

    setUploadError("");
    setSelectedFile(file);
  }

  async function handleUpload(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!selectedFile) {
      setUploadError(
        isArabic
          ? "يرجى اختيار ملف أولًا."
          : "Please select a file first.",
      );
      return;
    }

    setUploadError("");
    setIsUploading(true);

    try {
      await uploadMedia(
        supabase,
        {
          file: selectedFile,
          folder: "library",
          altAr,
          altEn,
        },
      );

      await refetchMedia();

      resetUploadForm();
      setIsUploadOpen(false);

      showToast({
        title: isArabic
          ? "تم رفع الملف بنجاح"
          : "File uploaded successfully",
        variant: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : isArabic
            ? "تعذر رفع الملف."
            : "Unable to upload the file.";

      setUploadError(message);

      showToast({
        title: isArabic
          ? "تعذر رفع الملف"
          : "Unable to upload file",
        description: message,
        variant: "error",
      });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDeleteMedia(
    media: MediaItem,
  ) {
    const confirmed = window.confirm(
      isArabic
        ? "هل أنت متأكد من حذف هذا الملف؟ لن يتم الحذف إذا كان مستخدمًا في برنامج أو دولة."
        : "Are you sure you want to delete this file? It will not be deleted if it is used by a program or country.",
    );

    if (!confirmed) {
      return;
    }

    setDeletingMediaId(media.id);

    try {
      await deleteMedia(
        supabase,
        {
          mediaId: media.id,
          bucket: media.bucket,
          path: media.path,
        },
      );

      await refetchMedia();

      showToast({
        title: isArabic
          ? "تم حذف الملف بنجاح"
          : "File deleted successfully",
        variant: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : isArabic
            ? "تعذر حذف الملف."
            : "Unable to delete the file.";

      showToast({
        title: isArabic
          ? "تعذر حذف الملف"
          : "Unable to delete file",
        description: message,
        variant: "error",
      });
    } finally {
      setDeletingMediaId(null);
    }
  }

  const filteredMediaItems =
    mediaItems.filter((media) => {
      const search = searchValue
        .trim()
        .toLowerCase();

      const matchesSearch =
        !search ||
        media.fileName
          .toLowerCase()
          .includes(search) ||
        media.altAr
          .toLowerCase()
          .includes(search) ||
        media.altEn
          .toLowerCase()
          .includes(search);

      const isImage =
        media.mimeType.startsWith(
          "image/",
        );

      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "images" &&
          isImage) ||
        (typeFilter === "files" &&
          !isImage);

      return (
        matchesSearch &&
        matchesType
      );
    });

  return (
    <section className="nr-dashboard">
      <div className="nr-dashboard-heading">
        <div>
          <span className="nr-dashboard-kicker">
            {isArabic
              ? "إدارة المحتوى"
              : "Content Management"}
          </span>

          <h1>
            {isArabic
              ? "الوسائط"
              : "Media"}
          </h1>

          <p>
            {isArabic
              ? "إدارة الصور والملفات المستخدمة في المنصة."
              : "Manage images and files used across the platform."}
          </p>
        </div>

        <Button
          type="button"
          onClick={openUploadDialog}
        >
          {isArabic
            ? "رفع ملف"
            : "Upload File"}
        </Button>
      </div>

      <div className="nr-media-toolbar">
        <input
          type="search"
          className="nr-input"
          value={searchValue}
          onChange={(event) => {
            setSearchValue(
              event.target.value,
            );
          }}
          placeholder={
            isArabic
              ? "ابحث باسم الملف أو النص البديل..."
              : "Search by file name or alt text..."
          }
        />

        <select
          className="nr-input"
          value={typeFilter}
          onChange={(event) => {
            setTypeFilter(
              event.target.value as
                | "all"
                | "images"
                | "files",
            );
          }}
        >
          <option value="all">
            {isArabic
              ? "جميع الوسائط"
              : "All media"}
          </option>

          <option value="images">
            {isArabic
              ? "الصور فقط"
              : "Images only"}
          </option>

          <option value="files">
            {isArabic
              ? "الملفات فقط"
              : "Files only"}
          </option>
        </select>

        <div className="nr-programs-results-count">
          {isArabic
            ? `${filteredMediaItems.length} عنصر`
            : `${filteredMediaItems.length} items`}
        </div>
      </div>

      {isLoading ? (
        <div className="nr-state">
          <strong>
            {isArabic
              ? "جاري تحميل الوسائط..."
              : "Loading media..."}
          </strong>
        </div>
      ) : isError ? (
        <div className="nr-state">
          <strong>
            {isArabic
              ? "تعذر تحميل الوسائط"
              : "Unable to load media"}
          </strong>

          <p>
            {error instanceof Error
              ? error.message
              : isArabic
                ? "حدث خطأ غير متوقع."
                : "An unexpected error occurred."}
          </p>
        </div>
      ) : filteredMediaItems.length === 0 ? (
        <div className="nr-state">
          <strong>
            {isArabic
              ? "لا توجد وسائط"
              : "No media found"}
          </strong>

          <p>
            {isArabic
              ? "ابدأ برفع أول صورة أو ملف."
              : "Start by uploading your first image or file."}
          </p>
        </div>
      ) : (
        <div className="nr-media-grid">
          {filteredMediaItems.map(
            (media: MediaItem) => (
              <article
                key={media.id}
                className="nr-media-card"
              >
                <div className="nr-media-preview">
                  {media.publicUrl ? (
                    <img
                      src={media.publicUrl}
                      alt={
                        isArabic
                          ? media.altAr || media.fileName
                          : media.altEn || media.fileName
                      }
                    />
                  ) : null}
                </div>

                <div className="nr-media-card-body">
                  <div>
                    <h2>{media.fileName}</h2>
                    <p>{media.mimeType}</p>
                  </div>

                  <div className="nr-media-card-actions">
                    <Link
                      href={`/admin/media/${media.id}`}
                      className="nr-program-action"
                    >
                      {isArabic
                        ? "عرض التفاصيل"
                        : "View Details"}
                    </Link>

                    <button
                      type="button"
                      className="nr-program-action nr-program-action-delete"
                      onClick={() => {
                        void handleDeleteMedia(
                          media,
                        );
                      }}
                      disabled={
                        deletingMediaId ===
                        media.id
                      }
                    >
                      {deletingMediaId ===
                      media.id
                        ? isArabic
                          ? "جاري الحذف..."
                          : "Deleting..."
                        : isArabic
                          ? "حذف"
                          : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ),
          )}
        </div>
      )}

      {isUploadOpen ? (
        <div
          className="nr-modal-backdrop"
          role="presentation"
          onMouseDown={closeUploadDialog}
        >
          <section
            className="nr-modal nr-media-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-media-title"
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
          >
            <div className="nr-modal-header">
              <div>
                <span className="nr-dashboard-kicker">
                  {isArabic
                    ? "إدارة الوسائط"
                    : "Media Management"}
                </span>

                <h2 id="upload-media-title">
                  {isArabic
                    ? "رفع ملف جديد"
                    : "Upload New File"}
                </h2>

                <p>
                  {isArabic
                    ? "اختر الملف وأدخل النص البديل ثم اضغط رفع."
                    : "Choose a file, add alternative text, then upload."}
                </p>
              </div>

              <button
                type="button"
                className="nr-modal-close"
                onClick={closeUploadDialog}
                disabled={isUploading}
                aria-label={
                  isArabic
                    ? "إغلاق النافذة"
                    : "Close dialog"
                }
              >
                ×
              </button>
            </div>

            <form
              className="nr-media-upload-form"
              onSubmit={(event) => {
                void handleUpload(event);
              }}
            >
              <label className="nr-media-file-field">
                <span>
                  {isArabic
                    ? "اختر الملف"
                    : "Choose File"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>

              {previewUrl && selectedFile?.type.startsWith("image/") ? (
                <div className="nr-media-upload-preview">
                  <img
                    src={previewUrl}
                    alt={
                      isArabic
                        ? "معاينة الملف"
                        : "File preview"
                    }
                  />
                </div>
              ) : null}

              <div className="nr-media-upload-grid">
                <label>
                  <span>
                    {isArabic
                      ? "النص البديل بالعربية"
                      : "Arabic Alternative Text"}
                  </span>

                  <input
                    type="text"
                    className="nr-input"
                    value={altAr}
                    onChange={(event) => {
                      setAltAr(event.target.value);
                    }}
                    disabled={isUploading}
                  />
                </label>

                <label>
                  <span>
                    {isArabic
                      ? "النص البديل بالإنجليزية"
                      : "English Alternative Text"}
                  </span>

                  <input
                    type="text"
                    className="nr-input"
                    value={altEn}
                    onChange={(event) => {
                      setAltEn(event.target.value);
                    }}
                    disabled={isUploading}
                  />
                </label>
              </div>

              {uploadError ? (
                <p className="nr-admin-login-error">
                  {uploadError}
                </p>
              ) : null}

              <div className="nr-media-upload-actions">
                <button
                  type="button"
                  className="nr-program-action"
                  onClick={closeUploadDialog}
                  disabled={isUploading}
                >
                  {isArabic
                    ? "إلغاء"
                    : "Cancel"}
                </button>

                <Button
                  type="submit"
                  disabled={
                    isUploading ||
                    !selectedFile
                  }
                >
                  {isUploading
                    ? isArabic
                      ? "جاري الرفع..."
                      : "Uploading..."
                    : isArabic
                      ? "رفع الملف"
                      : "Upload File"}
                </Button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </section>
  );
}