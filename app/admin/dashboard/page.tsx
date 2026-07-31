export default function AdminDashboardPage() {
  return (
    <section className="nr-dashboard">
      <div className="nr-dashboard-heading">
        <div>
          <span className="nr-dashboard-kicker">نظرة عامة</span>

          <h1>مرحبًا بك في NourApp Platform</h1>

          <p>
            من هنا ستتمكن من إدارة الدول والبرامج والمحتوى والمستخدمين
            وإعدادات المنصة.
          </p>
        </div>
      </div>

      <div className="nr-dashboard-stats">
        <article className="nr-dashboard-stat">
          <span>الدول</span>
          <strong>0</strong>
          <small>الدول المتاحة في المنصة</small>
        </article>

        <article className="nr-dashboard-stat">
          <span>البرامج</span>
          <strong>0</strong>
          <small>البرامج المنشورة والمسودات</small>
        </article>

        <article className="nr-dashboard-stat">
          <span>المستخدمون</span>
          <strong>1</strong>
          <small>المستخدمون المسجلون</small>
        </article>

        <article className="nr-dashboard-stat">
          <span>الوسائط</span>
          <strong>0</strong>
          <small>الصور والملفات المرفوعة</small>
        </article>
      </div>
    </section>
  );
}