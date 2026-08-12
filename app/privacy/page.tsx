"use client";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../../src/core/i18n";

const privacySectionsAr = [
  {
    title: "1. مقدمة",
    content: [
      "تحترم شركة كود لاند لتقنية المعلومات خصوصية مستخدمي منصة وتطبيق  نور آب، ويشار إلى الموقع والتطبيق والخدمات المرتبطة بهما مجتمعين باسم المنصة.",
      "توضح هذه السياسة كيفية جمع بياناتك الشخصية واستخدامها وحفظها ومشاركتها وحمايتها عند استخدام منصة  نور آب.",
      "باستخدامك للمنصة أو إنشاء حساب فيها، فإنك تقر باطلاعك على هذه السياسة. وفي الحالات التي تتطلب موافقتك، لن تتم معالجة بياناتك إلا بعد الحصول على الموافقة اللازمة.",
    ],
  },
  {
    title: "2. جهة التحكم في البيانات",
    content: [
      "تعد شركة كود لاند لتقنية المعلومات جهة التحكم في البيانات الشخصية التي تتم معالجتها من خلال منصة  نور آب، ما لم يذكر خلاف ذلك.",
    ],
    items: [
      "اسم المنشأة: شركة كود لاند لتقنية المعلومات.",
      "الاسم التجاري:  نور آب.",
      "رقم التواصل: +966 56 748 8377.",
      "العنوان: شارع عبدالرحمن بن عبدالقادر فقيه، حي النسيم، مكة المكرمة 24372، المملكة العربية السعودية.",
    ],
  },
  {
    title: "3. نطاق السياسة",
    content: ["تسري هذه السياسة على البيانات التي يتم جمعها من خلال:"],
    items: [
      "الموقع الإلكتروني لمنصة  نور آب.",
      "تطبيقات  نور آب على الهواتف والأجهزة الذكية.",
      "حسابات المستخدمين ومقدمي الخدمات والشركاء.",
      "خدمات الدعم الفني وخدمة العملاء.",
      "النماذج الإلكترونية والاستبيانات والمراسلات.",
      "عمليات الدفع والاشتراك والطلبات.",
      "ملفات تعريف الارتباط والتقنيات المشابهة.",
    ],
  },
  {
    title: "4. البيانات التي نجمعها",
    content: [
      "قد نجمع أنواعًا مختلفة من البيانات بحسب طبيعة استخدامك للمنصة والخدمات التي تطلبها.",
    ],
    items: [
      "بيانات الهوية، مثل الاسم وتاريخ الميلاد والجنسية ورقم الهوية عند الحاجة.",
      "بيانات الاتصال، مثل رقم الهاتف والبريد الإلكتروني والعنوان والمدينة والدولة.",
      "بيانات الحساب، مثل اسم المستخدم وإعدادات الحساب وسجلات تسجيل الدخول.",
      "بيانات الطلبات والحجوزات والاشتراكات والفواتير وحالة الدفع.",
      "بيانات الموقع التقريبي أو الدقيق بعد الحصول على إذن الجهاز.",
      "البيانات التقنية، مثل نوع الجهاز والمتصفح ونظام التشغيل وعنوان الإنترنت.",
      "رسائل الدعم والشكاوى والاستفسارات والمرفقات.",
      "بيانات مقدمي الخدمات والمنشآت والتراخيص والحسابات البنكية.",
    ],
  },
  {
    title: "5. مصادر جمع البيانات",
    items: [
      "مباشرة منك عند التسجيل أو استخدام المنصة.",
      "من جهازك أو متصفحك بصورة آلية.",
      "من مزودي خدمات الدفع والتوصيل والتحقق.",
      "من مقدمي الخدمات والشركاء المسجلين في المنصة.",
      "من الجهات الحكومية أو المصادر العامة عندما يسمح النظام بذلك.",
      "من خدمات تسجيل الدخول التابعة لأطراف أخرى.",
    ],
  },
  {
    title: "6. أغراض معالجة البيانات",
    items: [
      "إنشاء الحساب وإدارته والتحقق من هوية المستخدم.",
      "تقديم خدمات المنصة وتنفيذ الطلبات والحجوزات.",
      "معالجة المدفوعات والمبالغ المستردة وإصدار الفواتير.",
      "تمكين التواصل بين المستخدم ومقدمي الخدمات.",
      "تقديم خدمات الموقع والتوصيل.",
      "تقديم الدعم الفني ومعالجة الشكاوى.",
      "تخصيص تجربة المستخدم وتحسين الخدمات.",
      "تحليل الأداء وتطوير الخصائص الجديدة.",
      "منع الاحتيال وإساءة الاستخدام.",
      "حماية أمن المنصة والحسابات.",
      "إرسال الإشعارات التشغيلية والتسويقية المسموح بها.",
      "الوفاء بالمتطلبات النظامية والمحاسبية والضريبية.",
    ],
  },
  {
    title: "7. المسوغات النظامية للمعالجة",
    items: [
      "موافقة صاحب البيانات.",
      "تنفيذ عقد يكون صاحب البيانات طرفًا فيه.",
      "اتخاذ إجراءات بناءً على طلب المستخدم قبل إبرام العقد.",
      "الوفاء بالتزام نظامي يقع على الشركة.",
      "حماية المصالح الحيوية لصاحب البيانات أو شخص آخر.",
      "تحقيق مصلحة مشروعة لا تتعارض مع حقوق صاحب البيانات.",
      "أي حالات أخرى تجيزها الأنظمة واللوائح السارية.",
    ],
  },
  {
    title: "8. ملفات تعريف الارتباط",
    content: [
      "قد تستخدم المنصة ملفات تعريف الارتباط والتقنيات المشابهة لتشغيل الموقع، وحفظ إعدادات المستخدم، وتحليل الاستخدام، ومنع الاحتيال، وتحسين الأمن.",
      "يمكنك إدارة ملفات تعريف الارتباط من إعدادات المتصفح، وقد يؤدي تعطيل الملفات الضرورية إلى تعطل بعض وظائف المنصة.",
    ],
  },
  {
    title: "9. مشاركة البيانات والإفصاح عنها",
    content: ["لا تبيع  نور آب بياناتك الشخصية."],
    items: [
      "مقدمو الخدمات والموردون اللازمون لتنفيذ الطلب.",
      "شركات التوصيل والنقل والخدمات اللوجستية.",
      "البنوك ومقدمو خدمات الدفع والتحصيل.",
      "مقدمو خدمات الاستضافة والحوسبة السحابية.",
      "خدمات الرسائل والإشعارات والدعم الفني.",
      "مقدمو خدمات التحقق من الهوية ومكافحة الاحتيال.",
      "المستشارون القانونيون والمحاسبون والمدققون.",
      "الجهات الحكومية والقضائية والرقابية المختصة.",
      "أي طرف آخر بعد الحصول على الموافقة المطلوبة.",
    ],
  },
  {
    title: "10. نقل البيانات خارج المملكة",
    content: [
      "قد تتطلب بعض الخدمات التقنية أو التشغيلية نقل البيانات أو تخزينها خارج المملكة العربية السعودية.",
      "عند إجراء نقل دولي للبيانات، تلتزم الشركة بالمتطلبات النظامية والضمانات اللازمة والحد الأدنى من البيانات المطلوبة.",
    ],
  },
  {
    title: "11. الاحتفاظ بالبيانات وإتلافها",
    content: [
      "نحتفظ بالبيانات للمدة اللازمة لتحقيق الغرض الذي جمعت من أجله أو للمدة المطلوبة بموجب الأنظمة والالتزامات التعاقدية والمحاسبية والضريبية.",
      "بعد انتهاء الغرض أو مدة الاحتفاظ، يتم إتلاف البيانات بصورة آمنة أو إزالة ما يؤدي إلى تحديد هوية صاحبها، ما لم يتطلب النظام الاحتفاظ بها لمدة أطول.",
    ],
  },
  {
    title: "12. حماية البيانات",
    items: [
      "التحكم في صلاحيات الوصول.",
      "تشفير البيانات أثناء النقل والتخزين حيثما كان مناسبًا.",
      "استخدام وسائل المصادقة وحماية الحسابات.",
      "النسخ الاحتياطي الآمن.",
      "مراقبة الأنظمة والسجلات الأمنية.",
      "إدارة الثغرات والتحديثات.",
      "تدريب الموظفين على الخصوصية وأمن المعلومات.",
      "مراجعة مقدمي الخدمات وتقييد وصولهم إلى البيانات.",
    ],
  },
  {
    title: "13. تسرب البيانات والحوادث الأمنية",
    content: [
      "عند وقوع حادث يمس البيانات الشخصية، تتخذ الشركة الإجراءات اللازمة لاحتواء الحادث وتقييم أثره ومعالجته.",
      "يتم إشعار الجهات المختصة وأصحاب البيانات المتأثرين عندما تتطلب الأنظمة ذلك.",
    ],
  },
  {
    title: "14. حقوق صاحب البيانات",
    items: [
      "الحق في العلم بطريقة جمع البيانات والغرض من معالجتها.",
      "الحق في الوصول إلى البيانات الشخصية.",
      "الحق في طلب نسخة واضحة ومقروءة من البيانات.",
      "الحق في تصحيح البيانات أو استكمالها أو تحديثها.",
      "الحق في طلب إتلاف البيانات عند انتهاء الغرض منها.",
      "الحق في سحب الموافقة عندما تعتمد المعالجة عليها.",
      "الحق في تقديم شكوى بشأن معالجة البيانات.",
    ],
  },
  {
    title: "15. ممارسة حقوقك",
    content: [
      "يمكنك ممارسة حقوقك أو تقديم استفسار أو شكوى من خلال وسائل التواصل الموضحة في نهاية هذه الصفحة.",
      "قد نطلب المعلومات اللازمة للتحقق من هويتك وتحديد طبيعة الطلب قبل معالجته.",
    ],
  },
  {
    title: "16. بيانات الأطفال وناقصي الأهلية",
    content: [
      "لا تستهدف المنصة الأطفال أو ناقصي الأهلية إلا عندما تسمح طبيعة الخدمة بذلك وبعد تطبيق المتطلبات النظامية.",
      "عندما تتطلب الخدمة معالجة بيانات طفل أو ناقص أهلية، قد نطلب موافقة الولي أو الوصي النظامي.",
    ],
  },
  {
    title: "17. الرسائل التسويقية",
    content: [
      "قد ترسل المنصة عروضًا وأخبارًا ورسائل تسويقية عندما تسمح الأنظمة بذلك.",
      "يمكن إلغاء الاشتراك من خلال رابط إلغاء الاشتراك أو إعدادات الحساب أو التواصل مع خدمة العملاء.",
      "قد تستمر الإشعارات التشغيلية الضرورية المتعلقة بالحساب والطلبات والمدفوعات والأمان.",
    ],
  },
  {
    title: "18. تحديث سياسة الخصوصية",
    content: [
      "يجوز للشركة تحديث هذه السياسة عند تغيير الخدمات أو المتطلبات النظامية أو ممارسات معالجة البيانات.",
      "سيتم نشر النسخة المحدثة على المنصة مع توضيح تاريخ آخر تحديث، وقد يتم إشعار المستخدم بالتغييرات الجوهرية.",
    ],
  },
  {
    title: "19. اللغة المعتمدة",
    content: [
      "قد تتوفر هذه السياسة بلغات أخرى لتسهيل الاطلاع عليها. وفي حال وجود تعارض بين النسخة العربية وأي ترجمة، تكون النسخة العربية هي المرجع ما لم تقض الأنظمة بخلاف ذلك.",
    ],
  },
  {
    title: "20. التواصل معنا",
    content: [
      "للاستفسارات المتعلقة بالخصوصية أو بطريقة معالجة بياناتك، يرجى التواصل مع إدارة الخصوصية في منصة  نور آب.",
    ],
    items: [
      "الهاتف: +966 56 748 8377.",
      "الموقع الإلكتروني: NourAppappglobal.com.",
      "العنوان: شارع عبدالرحمن بن عبدالقادر فقيه، حي النسيم، مكة المكرمة 24372، المملكة العربية السعودية.",
    ],
  },
];


const privacySectionsEn = [
  {
    title: "1. Introduction",
    content: [
      "Code Land Information Technology Company respects the privacy of users of the NourApp platform and application. The website, application, and related services are collectively referred to as the Platform.",
      "This Policy explains how we collect, use, store, share, and protect your personal data when you use NourApp.",
      "By using the Platform or creating an account, you acknowledge that you have reviewed this Policy. Where consent is required, your data will only be processed after the necessary consent has been obtained.",
    ],
  },
  {
    title: "2. Data Controller",
    content: [
      "Code Land Information Technology Company is the controller of personal data processed through NourApp unless otherwise stated.",
    ],
    items: [
      "Entity name: Code Land Information Technology Company.",
      "Trade name: NourApp.",
      "Contact number: +966 56 748 8377.",
      "Address: Abdulrahman Bin Abdulqader Faqih Street, Al Naseem District, Makkah 24372, Kingdom of Saudi Arabia.",
    ],
  },
  {
    title: "3. Scope of this Policy",
    content: ["This Policy applies to data collected through:"],
    items: [
      "The NourApp website.",
      "NourApp applications on mobile phones and smart devices.",
      "User, service-provider, and partner accounts.",
      "Technical support and customer service.",
      "Electronic forms, surveys, and correspondence.",
      "Payments, subscriptions, and orders.",
      "Cookies and similar technologies.",
    ],
  },
  {
    title: "4. Data We Collect",
    content: [
      "We may collect different categories of data depending on how you use the Platform and the services you request.",
    ],
    items: [
      "Identity data, such as name, date of birth, nationality, and identification number where required.",
      "Contact data, such as phone number, email, address, city, and country.",
      "Account data, such as username, account settings, and login records.",
      "Order, booking, subscription, invoice, and payment-status data.",
      "Approximate or precise location data after device permission is obtained.",
      "Technical data, such as device type, browser, operating system, and IP address.",
      "Support messages, complaints, inquiries, and attachments.",
      "Service-provider and establishment data, licenses, and bank-account information.",
    ],
  },
  {
    title: "5. Sources of Data",
    items: [
      "Directly from you when you register or use the Platform.",
      "Automatically from your device or browser.",
      "From payment, delivery, and verification providers.",
      "From service providers and partners registered on the Platform.",
      "From government authorities or public sources where permitted by law.",
      "From third-party login services.",
    ],
  },
  {
    title: "6. Purposes of Processing",
    items: [
      "Creating and managing accounts and verifying user identity.",
      "Providing Platform services and fulfilling orders and bookings.",
      "Processing payments and refunds and issuing invoices.",
      "Enabling communication between users and service providers.",
      "Providing location and delivery services.",
      "Providing technical support and handling complaints.",
      "Personalizing the user experience and improving services.",
      "Analyzing performance and developing new features.",
      "Preventing fraud and misuse.",
      "Protecting the Platform and user accounts.",
      "Sending permitted operational and marketing notifications.",
      "Meeting legal, accounting, and tax requirements.",
    ],
  },
  {
    title: "7. Legal Bases for Processing",
    items: [
      "Consent of the data subject.",
      "Performance of a contract to which the data subject is a party.",
      "Taking steps at the user's request before entering into a contract.",
      "Compliance with a legal obligation applicable to the Company.",
      "Protection of the vital interests of the data subject or another person.",
      "Pursuit of a legitimate interest that does not conflict with the rights of the data subject.",
      "Any other cases permitted by applicable laws and regulations.",
    ],
  },
  {
    title: "8. Cookies",
    content: [
      "The Platform may use cookies and similar technologies to operate the website, remember user preferences, analyze usage, prevent fraud, and improve security.",
      "You can manage cookies through your browser settings. Disabling necessary cookies may affect some Platform functions.",
    ],
  },
  {
    title: "9. Data Sharing and Disclosure",
    content: ["NourApp does not sell your personal data."],
    items: [
      "Service providers and suppliers necessary to fulfill an order.",
      "Delivery, transport, and logistics companies.",
      "Banks and payment and collection providers.",
      "Hosting and cloud-computing providers.",
      "Messaging, notification, and technical-support services.",
      "Identity-verification and anti-fraud providers.",
      "Legal advisers, accountants, and auditors.",
      "Competent government, judicial, and regulatory authorities.",
      "Any other party after obtaining the required consent.",
    ],
  },
  {
    title: "10. International Data Transfers",
    content: [
      "Certain technical or operational services may require data to be transferred to or stored outside the Kingdom of Saudi Arabia.",
      "When making an international transfer, the Company applies the required legal safeguards and limits the transfer to the minimum data necessary.",
    ],
  },
  {
    title: "11. Data Retention and Disposal",
    content: [
      "We retain data for as long as necessary to fulfill the purpose for which it was collected or for the period required under applicable laws and contractual, accounting, and tax obligations.",
      "After the purpose or retention period ends, data is securely destroyed or de-identified unless the law requires it to be retained for a longer period.",
    ],
  },
  {
    title: "12. Data Protection",
    items: [
      "Access-control measures.",
      "Encryption of data in transit and at rest where appropriate.",
      "Authentication and account-protection measures.",
      "Secure backups.",
      "Monitoring of systems and security logs.",
      "Vulnerability and update management.",
      "Employee training on privacy and information security.",
      "Reviewing service providers and restricting their access to data.",
    ],
  },
  {
    title: "13. Data Breaches and Security Incidents",
    content: [
      "If an incident affecting personal data occurs, the Company takes appropriate steps to contain, assess, and remediate the incident.",
      "Relevant authorities and affected data subjects will be notified when required by applicable laws.",
    ],
  },
  {
    title: "14. Data Subject Rights",
    items: [
      "The right to know how data is collected and the purpose of processing.",
      "The right to access personal data.",
      "The right to request a clear and readable copy of personal data.",
      "The right to correct, complete, or update personal data.",
      "The right to request destruction of data when the purpose for processing has ended.",
      "The right to withdraw consent where processing is based on consent.",
      "The right to submit a complaint regarding the processing of personal data.",
    ],
  },
  {
    title: "15. Exercising Your Rights",
    content: [
      "You may exercise your rights or submit an inquiry or complaint using the contact methods shown at the end of this page.",
      "We may request information necessary to verify your identity and determine the nature of your request before processing it.",
    ],
  },
  {
    title: "16. Children and Persons Lacking Legal Capacity",
    content: [
      "The Platform does not target children or persons lacking legal capacity unless the nature of the service permits it and applicable requirements are implemented.",
      "Where the service requires processing data relating to a child or a person lacking legal capacity, we may request consent from the legal guardian or custodian.",
    ],
  },
  {
    title: "17. Marketing Communications",
    content: [
      "The Platform may send offers, news, and marketing messages where permitted by law.",
      "You may unsubscribe through the unsubscribe link, account settings, or by contacting customer service.",
      "Necessary operational notifications relating to accounts, orders, payments, and security may continue to be sent.",
    ],
  },
  {
    title: "18. Updates to this Privacy Policy",
    content: [
      "The Company may update this Policy when services, legal requirements, or data-processing practices change.",
      "The updated version will be published on the Platform with the date of the latest update, and users may be notified of material changes.",
    ],
  },
  {
    title: "19. Governing Language",
    content: [
      "This Policy may be made available in other languages for convenience. If there is any conflict between the Arabic version and any translation, the Arabic version will prevail unless applicable law provides otherwise.",
    ],
  },
  {
    title: "20. Contact Us",
    content: [
      "For privacy-related inquiries or questions about how your data is processed, please contact the privacy administration of NourApp.",
    ],
    items: [
      "Phone: +966 56 748 8377.",
      "Website: NourAppglobal.com.",
      "Address: Abdulrahman Bin Abdulqader Faqih Street, Al Naseem District, Makkah 24372, Kingdom of Saudi Arabia.",
    ],
  },
];

export default function PrivacyPage() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const privacySections = isArabic ? privacySectionsAr : privacySectionsEn;

  return (
    <main className="legal-page" dir={isArabic ? "rtl" : "ltr"}>
      <div className="legal-page-glow legal-page-glow-one" aria-hidden="true" />
      <div className="legal-page-glow legal-page-glow-two" aria-hidden="true" />

      <header className="legal-header">
        <div
          className="container legal-navigation"
          aria-label={isArabic ? "التنقل القانوني" : "Legal navigation"}
        >
          <Link href="/" className="legal-brand">
            <Image
              src="/images/site/v-logo.png"
              alt={isArabic ? "شعار نور آب" : "NourApp logo"}
              width={92}
              height={92}
              priority
            />
            <span className="legal-brand-copy">
              <small>
                {isArabic
                  ? "رفيق رحلتك إلى العمرة"
                  : "Your companion for the Umrah journey"}
              </small>
            </span>
          </Link>

          <Link href="/" className="back-home">
            {isArabic ? "العودة إلى الرئيسية ←" : "← Back to Home"}
          </Link>
        </div>
      </header>

      <section className="legal-hero">
        <div className="container legal-hero-inner">
          <span className="section-label">
            <span aria-hidden="true">✦</span>{" "}
            {isArabic ? "الوثائق القانونية" : "Legal Documents"}
          </span>

          <h1>{isArabic ? "سياسة الخصوصية" : "Privacy Policy"}</h1>

          <p>
            {isArabic
              ? "توضح هذه السياسة كيفية جمع بيانات المستخدمين واستخدامها وحمايتها عند استخدام موقع وتطبيق وخدمات منصة نور آب."
              : "This Policy explains how user data is collected, used, and protected when using the NourApp website, application, and services."}
          </p>

          <div className="legal-meta">
            <span>
              {isArabic
                ? "تاريخ النفاذ: 18 يوليو 2026"
                : "Effective date: July 18, 2026"}
            </span>
            <span>
              {isArabic
                ? "آخر تحديث: 18 يوليو 2026"
                : "Last updated: July 18, 2026"}
            </span>
            <span>{isArabic ? "الإصدار: 1.0" : "Version: 1.0"}</span>
          </div>
        </div>
      </section>

      <section className="legal-content-section">
        <div className="container legal-layout">
          <aside className="legal-sidebar">
            <strong>{isArabic ? "محتويات الصفحة" : "On this page"}</strong>
            <nav>
              {privacySections.map((section, index) => (
                <a href={`#section-${index + 1}`} key={section.title}>
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <article
            className="legal-document"
            aria-label={isArabic ? "سياسة الخصوصية" : "Privacy Policy"}
          >
            <div className="legal-notice">
              {isArabic
                ? "يرجى قراءة هذه السياسة بعناية قبل إنشاء حساب أو استخدام خدمات منصة نور آب."
                : "Please read this Policy carefully before creating an account or using NourApp services."}
            </div>

            {privacySections.map((section, index) => (
              <section
                className="legal-section"
                id={`section-${index + 1}`}
                key={section.title}
              >
                <h2>{section.title}</h2>

                {section.content?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                {section.items && (
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>
        </div>
      </section>

      <footer className="legal-footer">
        <div className="legal-footer-orb" aria-hidden="true" />
        <div className="container">
          <span>
            {isArabic
              ? "© 2026 نور آب. جميع الحقوق محفوظة."
              : "© 2026 NourApp. All rights reserved."}
          </span>

          <div>
            <Link href="/privacy">
              {isArabic ? "سياسة الخصوصية" : "Privacy Policy"}
            </Link>
            <Link href="/terms">
              {isArabic ? "الشروط والأحكام" : "Terms & Conditions"}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}