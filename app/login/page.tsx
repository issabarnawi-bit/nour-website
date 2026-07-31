import AdminLoginForm from "../../src/features/auth/components/AdminLoginForm";
export default function AdminLoginPage() {
  return (
    <main className="nr-admin-login-page" dir="rtl">
      <section className="nr-admin-login-card">
        <div className="nr-admin-login-heading">
          <span className="nr-admin-login-logo">ن</span>

          <div>
            <p>لوحة إدارة NourApp Platform</p>
            <h1>تسجيل الدخول</h1>
            <span>
              أدخل بيانات حساب الإدارة للوصول إلى لوحة التحكم.
            </span>
          </div>
        </div>

        <AdminLoginForm />
      </section>
    </main>
  );
}