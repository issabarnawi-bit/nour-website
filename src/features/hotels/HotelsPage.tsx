"use client";

import { useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { createClient } from "../../lib/supabase/client";

import type {
  Hotel,
  HotelFormValues,
} from "./types";

import { HotelForm } from "./forms";

import {
  createHotel,
  listHotels,
  softDeleteHotel,
  updateHotel,
  updateHotelStatus,
} from "./services";

export default function HotelsPage() {
  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const queryClient =
    useQueryClient();

  const [search, setSearch] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingHotel, setEditingHotel] =
    useState<Hotel | null>(null);

  const [hotelPendingDelete, setHotelPendingDelete] =
    useState<Hotel | null>(null);

  const hotelsQuery = useQuery({
    queryKey: ["hotels"],
    queryFn: () =>
      listHotels(supabase),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  async function refreshHotels() {
    await queryClient.invalidateQueries({
      queryKey: ["hotels"],
    });
  }

  const createMutation =
    useMutation({
      mutationFn: (
        values: HotelFormValues,
      ) =>
        createHotel(
          supabase,
          values,
        ),

      onSuccess: async () => {
        await refreshHotels();

        setShowForm(false);
        setEditingHotel(null);
      },
    });

  const updateMutation =
    useMutation({
      mutationFn: async ({
        hotel,
        values,
        removedGalleryIds,
      }: {
        hotel: Hotel;
        values: HotelFormValues;
        removedGalleryIds: string[];
      }) =>
        updateHotel(
          supabase,
          hotel.id,
          {
            values,

            currentCoverMediaId:
              hotel.coverMediaId,

            existingGallery:
              hotel.gallery.map(
                (image) => ({
                  id: image.id,
                  mediaId:
                    image.mediaId,
                }),
              ),

            removedGalleryIds,
          },
        ),

      onSuccess: async () => {
        await refreshHotels();

        setEditingHotel(null);
        setShowForm(false);
      },
    });

  const deleteMutation =
    useMutation({
      mutationFn: (
        hotelId: string,
      ) =>
        softDeleteHotel(
          supabase,
          hotelId,
        ),

      onSuccess: async () => {
        await refreshHotels();

        setHotelPendingDelete(
          null,
        );
      },
    });

  const statusMutation =
    useMutation({
      mutationFn: ({
        hotelId,
        isActive,
      }: {
        hotelId: string;
        isActive: boolean;
      }) =>
        updateHotelStatus(
          supabase,
          hotelId,
          isActive,
        ),

      onSuccess:
        refreshHotels,
    });

  const hotels =
    hotelsQuery.data ?? [];

  const filteredHotels =
    hotels.filter((hotel) => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return true;
      }

      return [
        hotel.nameAr,
        hotel.nameEn,
        hotel.cityAr,
        hotel.cityEn,
      ].some((value) =>
        value
          .toLowerCase()
          .includes(query),
      );
    });

  function openCreate() {
    setEditingHotel(null);
    setShowForm(true);
  }

  function openEdit(
    hotel: Hotel,
  ) {
    setEditingHotel(hotel);
    setShowForm(true);
  }

  function closeForm() {
    if (
      createMutation.isPending ||
      updateMutation.isPending
    ) {
      return;
    }

    setEditingHotel(null);
    setShowForm(false);
  }

  return (
    <div className="hotels-page">
      <header className="hotels-page__header">
        <div>
          <span className="hotels-page__eyebrow">
            إدارة الإقامة
          </span>

          <h1>الفنادق</h1>

          <p>
            إدارة الفنادق وصور
            الإقامة وربطها لاحقًا
            ببرامج نور آب.
          </p>
        </div>

        <button
          type="button"
          className="hotels-page__add"
          onClick={openCreate}
        >
          + إضافة فندق
        </button>
      </header>

      <section className="hotels-page__stats">
        <article>
          <strong>
            {hotels.length}
          </strong>
          <span>
            إجمالي الفنادق
          </span>
        </article>

        <article>
          <strong>
            {
              hotels.filter(
                (hotel) =>
                  hotel.status ===
                  "active",
              ).length
            }
          </strong>
          <span>
            الفنادق المفعلة
          </span>
        </article>

        <article>
          <strong>
            {
              hotels.filter(
                (hotel) =>
                  hotel.coverUrl,
              ).length
            }
          </strong>
          <span>
            بصور غلاف
          </span>
        </article>

        <article>
          <strong>
            {hotels.reduce(
              (
                count,
                hotel,
              ) =>
                count +
                hotel.gallery
                  .length,
              0,
            )}
          </strong>
          <span>
            صور المعرض
          </span>
        </article>
      </section>

      <section className="hotels-page__toolbar">
        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value,
            )
          }
          placeholder="البحث باسم الفندق أو المدينة..."
        />
      </section>

      {hotelsQuery.isLoading ? (
        <div className="hotels-page__state">
          جارٍ تحميل الفنادق...
        </div>
      ) : null}

      {hotelsQuery.isError ? (
        <div className="hotels-page__state hotels-page__state--error">
          تعذر تحميل الفنادق.
        </div>
      ) : null}

      {!hotelsQuery.isLoading &&
      !hotelsQuery.isError &&
      filteredHotels.length ===
        0 ? (
        <div className="hotels-page__state">
          لا توجد فنادق حتى الآن.
        </div>
      ) : null}

      {filteredHotels.length >
      0 ? (
        <div className="hotels-page__grid">
          {filteredHotels.map(
            (hotel) => (
              <article
                key={hotel.id}
                className="hotel-card"
              >
                <div className="hotel-card__media">
                  {hotel.coverUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={
                        hotel.coverUrl
                      }
                      alt={
                        hotel.nameAr
                      }
                    />
                  ) : (
                    <div className="hotel-card__placeholder">
                      <span>
                        🏨
                      </span>
                    </div>
                  )}

                  <span
                    className={`hotel-card__status ${
                      hotel.status ===
                      "active"
                        ? "is-active"
                        : "is-inactive"
                    }`}
                  >
                    {hotel.status ===
                    "active"
                      ? "مفعّل"
                      : "غير مفعّل"}
                  </span>
                </div>

                <div className="hotel-card__body">
                  <div className="hotel-card__title">
                    <div>
                      <span>
                        {hotel.cityAr ||
                          "المدينة غير محددة"}
                      </span>

                      <h3>
                        {hotel.nameAr}
                      </h3>

                      <small>
                        {
                          hotel.nameEn
                        }
                      </small>
                    </div>

                    <strong>
                      {"★".repeat(
                        hotel.stars,
                      )}
                    </strong>
                  </div>

                  <div className="hotel-card__meta">
                    <span>
                      {
                        hotel.gallery
                          .length
                      }{" "}
                      صور
                    </span>

                    <span>
                      ترتيب{" "}
                      {
                        hotel.sortOrder
                      }
                    </span>
                  </div>

                  <div className="hotel-card__actions">
                    <button
                      type="button"
                      onClick={() =>
                        openEdit(
                          hotel,
                        )
                      }
                    >
                      تعديل
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        statusMutation.mutate(
                          {
                            hotelId:
                              hotel.id,

                            isActive:
                              hotel.status !==
                              "active",
                          },
                        )
                      }
                    >
                      {hotel.status ===
                      "active"
                        ? "تعطيل"
                        : "تفعيل"}
                    </button>

                    <button
                      type="button"
                      className="is-danger"
                      onClick={() =>
                        setHotelPendingDelete(
                          hotel,
                        )
                      }
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </article>
            ),
          )}
        </div>
      ) : null}

      {showForm ? (
        <div
          className="hotels-modal"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="hotels-modal__backdrop"
            aria-label="إغلاق"
            onClick={closeForm}
          />

          <div className="hotels-modal__panel">
            <div className="hotels-modal__header">
              <div>
                <span>
                  {editingHotel
                    ? "تعديل الفندق"
                    : "فندق جديد"}
                </span>

                <h2>
                  {editingHotel
                    ? editingHotel.nameAr
                    : "إضافة فندق"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
              >
                ×
              </button>
            </div>

            <HotelForm
              key={
                editingHotel
                  ? `${editingHotel.id}-${editingHotel.updatedAt}`
                  : "create-hotel"
              }
              initialValues={
                editingHotel
                  ? {
                      nameAr:
                        editingHotel.nameAr,

                      nameEn:
                        editingHotel.nameEn,

                      cityAr:
                        editingHotel.cityAr,

                      cityEn:
                        editingHotel.cityEn,

                      stars:
                        editingHotel.stars,

                      descriptionAr:
                        editingHotel.descriptionAr,

                      descriptionEn:
                        editingHotel.descriptionEn,

                      addressAr:
                        editingHotel.addressAr,

                      addressEn:
                        editingHotel.addressEn,

                      latitude:
                        editingHotel.latitude,

                      longitude:
                        editingHotel.longitude,

                      sortOrder:
                        editingHotel.sortOrder,

                      isActive:
                        editingHotel.status ===
                        "active",
                    }
                  : undefined
              }
              existingCoverUrl={
                editingHotel?.coverUrl
              }
              existingGallery={
                editingHotel?.gallery ??
                []
              }
              isSubmitting={
                createMutation.isPending ||
                updateMutation.isPending
              }
              submitLabel={
                editingHotel
                  ? "حفظ التعديلات"
                  : "إضافة الفندق"
              }
              onSubmit={async (
                values,
                options,
              ) => {
                if (
                  editingHotel
                ) {
                  await updateMutation.mutateAsync(
                    {
                      hotel:
                        editingHotel,

                      values,

                      removedGalleryIds:
                        options?.removedGalleryIds ??
                        [],
                    },
                  );

                  return;
                }

                await createMutation.mutateAsync(
                  values,
                );
              }}
            />
          </div>
        </div>
      ) : null}

      {hotelPendingDelete ? (
        <div
          className="hotels-confirm"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="hotels-confirm__backdrop"
            aria-label="إغلاق"
            onClick={() =>
              setHotelPendingDelete(
                null,
              )
            }
          />

          <div className="hotels-confirm__panel">
            <span>
              حذف الفندق
            </span>

            <h3>
              {
                hotelPendingDelete.nameAr
              }
            </h3>

            <p>
              سيتم نقل الفندق إلى
              الحذف الناعم ولن يظهر
              ضمن الفنادق النشطة.
            </p>

            <div>
              <button
                type="button"
                onClick={() =>
                  setHotelPendingDelete(
                    null,
                  )
                }
              >
                إلغاء
              </button>

              <button
                type="button"
                className="is-danger"
                disabled={
                  deleteMutation.isPending
                }
                onClick={() =>
                  deleteMutation.mutate(
                    hotelPendingDelete.id,
                  )
                }
              >
                {deleteMutation.isPending
                  ? "جارٍ الحذف..."
                  : "تأكيد الحذف"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .hotels-page {
          display: grid;
          gap: 22px;
        }

        .hotels-page__header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
        }

        .hotels-page__eyebrow {
          display: block;
          margin-bottom: 7px;
          color: var(--nour-primary);
          font-size: 11px;
          font-weight: 900;
        }

        .hotels-page__header h1 {
          margin: 0;
          color: var(--nour-text-primary);
          font-size: 30px;
        }

        .hotels-page__header p {
          margin: 7px 0 0;
          color: #768399;
          font-size: 13px;
        }

        .hotels-page__add {
          min-height: 44px;
          padding-inline: 18px;
          border: 0;
          border-radius: 12px;
          color: #fff;
          background: var(--nour-primary);
          font: inherit;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .hotels-page__stats {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .hotels-page__stats article {
          padding: 18px;
          border: 1px solid var(--nour-border);
          border-radius: 16px;
          background: var(--nour-surface);
        }

        .hotels-page__stats strong {
          display: block;
          color: var(--nour-text-primary);
          font-size: 24px;
        }

        .hotels-page__stats span {
          display: block;
          margin-top: 5px;
          color: #7c899c;
          font-size: 11px;
        }

        .hotels-page__toolbar {
          padding: 14px;
          border: 1px solid var(--nour-border);
          border-radius: 16px;
          background: var(--nour-surface);
        }

        .hotels-page__toolbar input {
          width: 100%;
          min-height: 42px;
          padding-inline: 13px;
          border: 1px solid var(--nour-border);
          border-radius: 11px;
          color: var(--nour-text-primary);
          background: var(--nour-background);
          font: inherit;
          outline: none;
        }

        .hotels-page__state {
          display: grid;
          min-height: 160px;
          place-items: center;
          padding: 24px;
          border: 1px solid var(--nour-border);
          border-radius: 18px;
          color: #7c899c;
          background: var(--nour-surface);
          text-align: center;
        }

        .hotels-page__state--error {
          color: #b91c1c;
        }

        .hotels-page__grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .hotel-card {
          overflow: hidden;
          border: 1px solid var(--nour-border);
          border-radius: 20px;
          background: var(--nour-surface);
          box-shadow: var(--nour-shadow-sm);
        }

        .hotel-card__media {
          position: relative;
          height: 190px;
          overflow: hidden;
          background: #edf2f7;
        }

        .hotel-card__media img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hotel-card__placeholder {
          display: grid;
          width: 100%;
          height: 100%;
          place-items: center;
          color: #7890aa;
          font-size: 38px;
        }

        .hotel-card__status {
          position: absolute;
          top: 12px;
          inset-inline-start: 12px;
          padding: 6px 9px;
          border-radius: 999px;
          color: #fff;
          font-size: 9px;
          font-weight: 900;
        }

        .hotel-card__status.is-active {
          background: #17966b;
        }

        .hotel-card__status.is-inactive {
          background: #718096;
        }

        .hotel-card__body {
          padding: 16px;
        }

        .hotel-card__title {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .hotel-card__title > div > span {
          color: var(--nour-primary);
          font-size: 10px;
          font-weight: 800;
        }

        .hotel-card__title h3 {
          margin: 5px 0 2px;
          color: var(--nour-text-primary);
          font-size: 16px;
        }

        .hotel-card__title small {
          color: #8490a1;
        }

        .hotel-card__title strong {
          color: #e6aa00;
          font-size: 11px;
          white-space: nowrap;
        }

        .hotel-card__meta {
          display: flex;
          gap: 8px;
          margin-top: 14px;
        }

        .hotel-card__meta span {
          padding: 6px 8px;
          border-radius: 8px;
          color: #718096;
          background: var(--nour-background);
          font-size: 9px;
        }

        .hotel-card__actions {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 7px;
          margin-top: 15px;
        }

        .hotel-card__actions button {
          min-height: 35px;
          border: 1px solid var(--nour-border);
          border-radius: 9px;
          color: var(--nour-text-primary);
          background: var(--nour-background);
          font: inherit;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
        }

        .hotel-card__actions .is-danger {
          color: #c53030;
        }

        .hotels-modal,
        .hotels-confirm {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: grid;
          place-items: center;
          padding: 20px;
        }

        .hotels-modal__backdrop,
        .hotels-confirm__backdrop {
          position: absolute;
          inset: 0;
          border: 0;
          background: rgba(5, 18, 35, 0.58);
          backdrop-filter: blur(5px);
        }

        .hotels-modal__panel {
          position: relative;
          z-index: 1;
          width: min(920px, 100%);
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          padding: 22px;
          border: 1px solid var(--nour-border);
          border-radius: 24px;
          background: var(--nour-background);
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.2);
        }

        .hotels-modal__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 20px;
        }

        .hotels-modal__header span {
          color: var(--nour-primary);
          font-size: 10px;
          font-weight: 900;
        }

        .hotels-modal__header h2 {
          margin: 4px 0 0;
          color: var(--nour-text-primary);
          font-size: 22px;
        }

        .hotels-modal__header > button {
          width: 37px;
          height: 37px;
          border: 1px solid var(--nour-border);
          border-radius: 10px;
          color: var(--nour-text-primary);
          background: var(--nour-surface);
          font-size: 22px;
          cursor: pointer;
        }

        .hotels-confirm__panel {
          position: relative;
          z-index: 1;
          width: min(420px, 100%);
          padding: 24px;
          border-radius: 20px;
          background: var(--nour-surface);
          text-align: center;
        }

        .hotels-confirm__panel > span {
          color: #c53030;
          font-size: 10px;
          font-weight: 900;
        }

        .hotels-confirm__panel h3 {
          margin: 7px 0;
          color: var(--nour-text-primary);
        }

        .hotels-confirm__panel p {
          color: #7c899c;
          font-size: 12px;
          line-height: 1.7;
        }

        .hotels-confirm__panel > div {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-top: 18px;
        }

        .hotels-confirm__panel button {
          min-height: 39px;
          border: 1px solid var(--nour-border);
          border-radius: 10px;
          background: var(--nour-background);
          font: inherit;
          cursor: pointer;
        }

        .hotels-confirm__panel button.is-danger {
          border-color: #c53030;
          color: #fff;
          background: #c53030;
        }

        @media (max-width: 1050px) {
          .hotels-page__grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .hotels-page__header {
            align-items: stretch;
            flex-direction: column;
          }

          .hotels-page__stats {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .hotels-page__grid {
            grid-template-columns: 1fr;
          }

          .hotels-modal {
            padding: 8px;
          }

          .hotels-modal__panel {
            max-height: calc(100vh - 16px);
            padding: 14px;
          }
        }
      `}</style>
    </div>
  );
}