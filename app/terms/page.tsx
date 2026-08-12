"use client";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../../src/core/i18n";

const termsSectionsAr = [
  {
    title: "1. مقدمة",
    content: [
      "تحكم هذه الشروط والأحكام استخدام الموقع الإلكتروني وتطبيقات وخدمات منصة  نور آب، المملوكة أو المدارة بواسطة شركة كود لاند لتقنية المعلومات.",
      "من خلال دخولك إلى المنصة أو إنشاء حساب أو تقديم طلب أو استخدام أي من خدماتها، فإنك تقر بأنك قرأت هذه الشروط وفهمتها ووافقت على الالتزام بها، إضافة إلى سياسة الخصوصية والسياسات الأخرى المنشورة على المنصة.",
      "إذا لم توافق على هذه الشروط، فيجب عليك التوقف عن استخدام المنصة.",
    ],
  },
  {
    title: "2. بيانات مقدم الخدمة",
    items: [
      "الاسم التجاري:  نور آب.",
      "اسم المنشأة: شركة كود لاند لتقنية المعلومات.",
      "رقم التواصل: +966 56 748 8377.",
      "الموقع الإلكتروني: NourAppappglobal.com.",
      "العنوان: شارع عبدالرحمن بن عبدالقادر فقيه، حي النسيم، مكة المكرمة 24372، المملكة العربية السعودية.",
    ],
  },
  {
    title: "3. التعريفات",
    items: [
      "المنصة: موقع  نور آب الإلكتروني وتطبيقاتها وخدماتها الرقمية.",
      "المستخدم: كل شخص يدخل إلى المنصة أو ينشئ حسابًا أو يستخدم خدماتها.",
      "العميل: المستخدم الذي يطلب أو يشتري خدمة أو منتجًا من خلال المنصة.",
      "مقدم الخدمة: الشخص أو المنشأة التي تعرض أو تقدم خدمة أو منتجًا من خلال المنصة.",
      "الطلب: أي طلب شراء أو حجز أو اشتراك أو تعاقد يتم تقديمه عبر المنصة.",
      "المحتوى: النصوص والصور والشعارات والتصاميم والمعلومات والملفات والتقييمات والمواد المنشورة في المنصة.",
      "الحساب: الملف الإلكتروني الخاص بالمستخدم الذي يمكّنه من استخدام خصائص المنصة.",
    ],
  },
  {
    title: "4. طبيعة خدمات المنصة",
    items: [
      "عرض المنتجات أو الخدمات.",
      "تمكين المستخدم من تقديم الطلبات أو الحجوزات.",
      "تسهيل التواصل بين العملاء ومقدمي الخدمات.",
      "معالجة المدفوعات الإلكترونية.",
      "إدارة الطلبات والفواتير.",
      "توفير خدمات الدعم والتقييم والمتابعة.",
      "توفير خصائص أو خدمات إضافية يتم الإعلان عنها داخل المنصة.",
    ],
    content: [
      "إذا كانت  نور آب تعمل وسيطًا تقنيًا بين العميل ومقدم الخدمة، فإن دورها يقتصر على تشغيل البيئة التقنية وتسهيل المعاملة، ما لم يذكر صراحة أن الشركة هي مقدم الخدمة أو البائع المباشر.",
    ],
  },
  {
    title: "5. أهلية الاستخدام",
    items: [
      "بلوغ السن النظامية اللازمة لإبرام العقود.",
      "التمتع بالأهلية النظامية الكاملة.",
      "عدم سبق تعليق الحساب أو المنع من استخدام المنصة.",
      "استخدام المنصة لأغراض مشروعة.",
      "تقديم معلومات صحيحة وحديثة.",
    ],
  },
  {
    title: "6. إنشاء الحساب",
    items: [
      "تقديم بيانات صحيحة وكاملة وحديثة.",
      "تحديث البيانات عند تغيرها.",
      "عدم انتحال شخصية أي فرد أو منشأة.",
      "عدم استخدام بيانات شخص آخر دون تفويض.",
      "الحفاظ على سرية كلمة المرور ورموز التحقق.",
      "إشعار المنصة عند الاشتباه في وصول غير مصرح به إلى الحساب.",
    ],
  },
  {
    title: "7. قواعد الاستخدام المقبول",
    items: [
      "مخالفة الأنظمة أو اللوائح أو الآداب العامة.",
      "الاحتيال أو التضليل أو انتحال الهوية.",
      "تقديم معلومات أو وثائق مزورة.",
      "انتهاك حقوق الملكية الفكرية أو الخصوصية.",
      "نشر محتوى مسيء أو غير قانوني أو تشهيري.",
      "محاولة اختراق المنصة أو تجاوز وسائل الحماية.",
      "جمع بيانات المستخدمين دون تصريح.",
      "استخدام أدوات آلية أو روبوتات دون موافقة مكتوبة.",
      "تنفيذ معاملات وهمية أو غير مشروعة.",
      "إجراء هندسة عكسية للمنصة أو نسخ مكوناتها التقنية.",
    ],
  },
  {
    title: "8. الطلبات والتعاقد الإلكتروني",
    content: [
      "عند تقديم المستخدم طلبًا عبر المنصة، فإنه يقدم عرضًا لشراء المنتج أو الخدمة وفق المعلومات والسعر الظاهرين وقت تقديم الطلب.",
      "لا يعد الطلب مقبولًا نهائيًا إلا بعد تأكيده، ونجاح الدفع عند الحاجة، والتحقق من توافر الخدمة أو المنتج.",
    ],
  },
  {
    title: "9. الأسعار والرسوم والضرائب",
    items: [
      "تعرض الأسعار والرسوم بالعملة المحددة قبل إتمام الطلب.",
      "قد تشمل الأسعار ضريبة القيمة المضافة أو تضاف بصورة منفصلة.",
      "قد تضاف رسوم توصيل أو تشغيل أو حجز أو معالجة.",
      "يعرض إجمالي المبلغ قبل تأكيد الدفع.",
      "يتحمل المستخدم الرسوم التي وافق عليها عند إتمام الطلب.",
    ],
  },
  {
    title: "10. الدفع",
    items: [
      "تقديم بيانات دفع صحيحة.",
      "امتلاك الصلاحية لاستخدام وسيلة الدفع.",
      "دفع جميع المبالغ المستحقة.",
      "تحمل الرسوم البنكية أو رسوم تحويل العملات التي تفرضها الجهة المصدرة.",
    ],
  },
  {
    title: "11. تنفيذ الخدمة والتوصيل",
    items: [
      "تقديم عنوان وموقع صحيحين.",
      "توفير رقم هاتف فعال.",
      "الحضور أو توفير شخص مخول للاستلام.",
      "تقديم التعليمات اللازمة للدخول أو التسليم.",
      "فحص الطلب عند الاستلام متى كان ذلك ممكنًا.",
    ],
  },
  {
    title: "12. الإلغاء والاسترجاع والاسترداد",
    content: [
      "تخضع عمليات الإلغاء والاسترجاع والاسترداد لطبيعة المنتج أو الخدمة، وحالة تنفيذ الطلب، وسياسة مقدم الخدمة، والحقوق المقررة للمستهلك.",
      "عند قبول الاسترداد، يعاد المبلغ إلى وسيلة الدفع الأصلية متى كان ذلك ممكنًا، وقد تختلف مدة ظهور المبلغ بحسب البنك أو مقدم الدفع.",
    ],
  },
  {
    title: "13. العروض والرموز الترويجية",
    items: [
      "يستخدم الرمز وفق الشروط الموضحة لكل عرض.",
      "لا يمكن استبداله بمبلغ نقدي.",
      "لا يجوز بيعه أو نقله.",
      "قد لا يجمع مع عرض آخر.",
      "يخضع لمدة صلاحية وحد أدنى للطلب.",
      "يجوز إلغاؤه عند إساءة الاستخدام أو الاحتيال.",
    ],
  },
  {
    title: "14. التقييمات والمحتوى المقدم من المستخدم",
    items: [
      "أن يكون المحتوى صحيحًا ويعكس تجربة المستخدم الفعلية.",
      "ألا ينتهك حقوق أي شخص.",
      "ألا يحتوي على بيانات شخصية غير مصرح بنشرها.",
      "ألا يتضمن إساءة أو تهديدًا أو تمييزًا أو محتوى غير مشروع.",
      "ألا يستخدم للإعلان غير المصرح به أو التلاعب بالتقييمات.",
    ],
  },
  {
    title: "15. التزامات مقدمي الخدمات",
    items: [
      "امتلاك التراخيص والتصاريح اللازمة.",
      "تقديم معلومات صحيحة عن المنشأة والخدمات.",
      "الالتزام بالأسعار والعروض المعلنة.",
      "تنفيذ الطلبات بالجودة والوقت المتفق عليهما.",
      "احترام حقوق المستهلك.",
      "إصدار الفواتير والمستندات النظامية.",
      "المحافظة على بيانات العملاء.",
      "معالجة الشكاوى والاسترجاع وفق الأنظمة.",
    ],
  },
  {
    title: "16. الملكية الفكرية",
    content: [
      "جميع الحقوق المتعلقة باسم  نور آب وعلاماتها وشعاراتها وتصاميمها وبرمجياتها وقواعد بياناتها ومحتواها مملوكة للشركة أو مرخصة لها.",
      "لا يجوز نسخ أو تعديل أو توزيع أو بيع أو استغلال أي جزء من المنصة دون موافقة كتابية مسبقة.",
    ],
  },
  {
    title: "17. خدمات وروابط الأطراف الثالثة",
    content: [
      "قد تعتمد المنصة على خدمات مقدمة من أطراف ثالثة، مثل بوابات الدفع والخرائط وخدمات تسجيل الدخول والتوصيل.",
      "تخضع هذه الخدمات لشروط وسياسات الأطراف التي تقدمها.",
    ],
  },
  {
    title: "18. توفر المنصة والتحديثات",
    content: [
      "نسعى إلى توفير المنصة بصورة مستمرة وآمنة، لكن قد يتم تعليق بعض الخدمات مؤقتًا بسبب الصيانة أو التحديث أو الأعطال الفنية أو المخاطر الأمنية أو الظروف الخارجة عن السيطرة.",
    ],
  },
  {
    title: "19. إخلاء المسؤولية",
    content: [
      "تقدم المنصة والخدمات وفق الوصف المتاح وعند توافرها.",
      "لا ينطبق أي استبعاد للمسؤولية على حالات الاحتيال أو الخطأ الجسيم أو الإخلال بالحقوق الإلزامية للمستهلك.",
    ],
  },
  {
    title: "20. حدود المسؤولية",
    content: [
      "في الحدود التي تسمح بها الأنظمة، تقتصر مسؤولية الشركة عن الأضرار المباشرة المثبتة الناتجة عن معاملة معينة على قيمة المبلغ الذي دفعه المستخدم مقابل تلك المعاملة.",
    ],
  },
  {
    title: "21. التعويض",
    items: [
      "مخالفة المستخدم لهذه الشروط.",
      "الاستخدام غير المشروع للمنصة.",
      "انتهاك حقوق طرف آخر.",
      "تقديم بيانات أو محتوى غير صحيح أو مخالف.",
      "استخدام الحساب في نشاط احتيالي أو محظور.",
    ],
  },
  {
    title: "22. تعليق الحساب وإنهاؤه",
    items: [
      "مخالفة الشروط أو السياسات.",
      "الاشتباه في الاحتيال أو إساءة الاستخدام.",
      "تقديم بيانات مزورة.",
      "وجود خطر أمني.",
      "عدم سداد المبالغ المستحقة.",
      "طلب جهة مختصة.",
      "توقف الخدمة أو النشاط.",
    ],
  },
  {
    title: "23. الخصوصية وحماية البيانات",
    content: [
      "تتم معالجة البيانات الشخصية وفق سياسة الخصوصية لمنصة  نور آب والأنظمة السارية.",
      "تعد سياسة الخصوصية جزءًا مكملًا لهذه الشروط.",
    ],
  },
  {
    title: "24. التواصل الإلكتروني",
    items: [
      "البريد الإلكتروني.",
      "الرسائل النصية.",
      "إشعارات التطبيق.",
      "الإشعارات داخل الحساب.",
      "وسائل التواصل التي يقدمها المستخدم.",
    ],
  },
  {
    title: "25. القوة القاهرة",
    content: [
      "لا تتحمل الشركة مسؤولية التأخير أو عدم التنفيذ الناتج عن أحداث خارجة بصورة معقولة عن سيطرتها، مثل الكوارث الطبيعية أو الجوائح أو الحروب أو انقطاع الاتصالات أو القرارات الحكومية أو حالات الطوارئ.",
    ],
  },
  {
    title: "26. تعديل الشروط",
    content: [
      "يجوز للمنصة تعديل هذه الشروط لمواكبة التغييرات النظامية وتطوير الخدمات ومتطلبات الأمن والامتثال.",
      "تنشر النسخة المحدثة مع تاريخ آخر تحديث، ويتم إشعار المستخدم بالتعديلات الجوهرية عند الحاجة.",
    ],
  },
  {
    title: "27. قابلية الفصل",
    content: [
      "إذا تبين أن أي حكم من هذه الشروط غير صالح أو غير قابل للتنفيذ، فلا يؤثر ذلك في صلاحية بقية الأحكام.",
    ],
  },
  {
    title: "28. عدم التنازل",
    content: [
      "عدم ممارسة الشركة لأي حق أو تأخرها في ممارسته لا يعد تنازلًا عنه، ولا يكون أي تنازل نافذًا إلا إذا كان مكتوبًا وصادرًا من ممثل مخول.",
    ],
  },
  {
    title: "29. الاتفاق الكامل",
    content: [
      "تمثل هذه الشروط وسياسة الخصوصية والسياسات المشار إليها كامل الاتفاق المتعلق باستخدام المنصة.",
    ],
  },
  {
    title: "30. النظام الواجب التطبيق",
    content: [
      "تخضع هذه الشروط وتفسر وفق أنظمة المملكة العربية السعودية.",
      "يلتزم الطرفان بمحاولة تسوية أي شكوى أو نزاع وديًا من خلال خدمة العملاء قبل اللجوء إلى الجهات المختصة.",
      "إذا تعذر الحل الودي، يكون الاختصاص للجهات القضائية أو اللجان المختصة في المملكة العربية السعودية.",
    ],
  },
];


const termsSectionsEn = [
  {
    title: "1. Introduction",
    content: [
      "These Terms and Conditions govern the use of the NourApp website, applications, and services, owned or operated by Code Land Information Technology Company.",
      "By accessing the Platform, creating an account, submitting an order, or using any of its services, you acknowledge that you have read, understood, and agreed to these Terms, in addition to the Privacy Policy and other policies published on the Platform.",
      "If you do not agree to these Terms, you must stop using the Platform.",
    ],
  },
  {
    title: "2. Service Provider Details",
    items: [
      "Trade name: NourApp.",
      "Entity name: Code Land Information Technology Company.",
      "Contact number: +966 56 748 8377.",
      "Website: NourAppglobal.com.",
      "Address: Abdulrahman Bin Abdulqader Faqih Street, Al Naseem District, Makkah 24372, Kingdom of Saudi Arabia.",
    ],
  },
  {
    title: "3. Definitions",
    items: [
      "Platform: the NourApp website, applications, and digital services.",
      "User: any person who accesses the Platform, creates an account, or uses its services.",
      "Customer: a user who requests or purchases a service or product through the Platform.",
      "Service Provider: a person or entity that offers or provides a service or product through the Platform.",
      "Order: any purchase, booking, subscription, or contracting request submitted through the Platform.",
      "Content: texts, images, logos, designs, information, files, ratings, and materials published on the Platform.",
      "Account: the user's electronic profile that enables access to Platform features.",
    ],
  },
  {
    title: "4. Nature of Platform Services",
    items: [
      "Displaying products or services.",
      "Enabling users to submit orders or bookings.",
      "Facilitating communication between customers and service providers.",
      "Processing electronic payments.",
      "Managing orders and invoices.",
      "Providing support, rating, and follow-up services.",
      "Providing additional features or services announced through the Platform.",
    ],
    content: [
      "Where NourApp acts as a technology intermediary between the customer and a service provider, its role is limited to operating the technical environment and facilitating the transaction unless it is expressly stated that the Company is the direct service provider or seller.",
    ],
  },
  {
    title: "5. Eligibility",
    items: [
      "Being of the legal age required to enter into contracts.",
      "Having full legal capacity.",
      "Not having previously had your account suspended or been prohibited from using the Platform.",
      "Using the Platform for lawful purposes.",
      "Providing accurate and up-to-date information.",
    ],
  },
  {
    title: "6. Account Creation",
    items: [
      "Providing accurate, complete, and current information.",
      "Updating information when it changes.",
      "Not impersonating any person or entity.",
      "Not using another person's information without authorization.",
      "Keeping passwords and verification codes confidential.",
      "Notifying the Platform if unauthorized access to the account is suspected.",
    ],
  },
  {
    title: "7. Acceptable Use Rules",
    items: [
      "Violating applicable laws, regulations, or public morals.",
      "Fraud, deception, or impersonation.",
      "Submitting false information or forged documents.",
      "Violating intellectual-property or privacy rights.",
      "Publishing abusive, unlawful, or defamatory content.",
      "Attempting to hack the Platform or bypass security controls.",
      "Collecting user data without authorization.",
      "Using automated tools or bots without written approval.",
      "Conducting fake or unlawful transactions.",
      "Reverse engineering the Platform or copying its technical components.",
    ],
  },
  {
    title: "8. Orders and Electronic Contracting",
    content: [
      "When a user submits an order through the Platform, the user is making an offer to purchase the relevant product or service based on the information and price displayed at the time the order is submitted.",
      "An order is not finally accepted until it is confirmed, payment succeeds where required, and the availability of the service or product is verified.",
    ],
  },
  {
    title: "9. Prices, Fees, and Taxes",
    items: [
      "Prices and fees are displayed in the specified currency before completion of the order.",
      "Prices may include VAT or VAT may be added separately.",
      "Delivery, operating, booking, or processing fees may be added.",
      "The total amount is displayed before payment is confirmed.",
      "The user is responsible for fees accepted when completing the order.",
    ],
  },
  {
    title: "10. Payment",
    items: [
      "Providing accurate payment information.",
      "Having authority to use the selected payment method.",
      "Paying all amounts due.",
      "Bearing bank charges or currency-conversion fees imposed by the issuer.",
    ],
  },
  {
    title: "11. Service Fulfilment and Delivery",
    items: [
      "Providing a correct address and location.",
      "Providing an active phone number.",
      "Being present or appointing an authorized person to receive the order.",
      "Providing any necessary access or delivery instructions.",
      "Inspecting the order on receipt where reasonably possible.",
    ],
  },
  {
    title: "12. Cancellation, Returns, and Refunds",
    content: [
      "Cancellation, return, and refund requests are subject to the nature of the product or service, the status of fulfilment, the service provider's policy, and applicable consumer rights.",
      "Where a refund is approved, the amount will be returned to the original payment method where possible. The time required for the amount to appear may vary depending on the bank or payment provider.",
    ],
  },
  {
    title: "13. Offers and Promotional Codes",
    items: [
      "Promotional codes must be used in accordance with the conditions of each offer.",
      "They cannot be exchanged for cash.",
      "They may not be sold or transferred.",
      "They may not be combined with another offer.",
      "They may be subject to an expiry date and a minimum order value.",
      "They may be cancelled in cases of misuse or fraud.",
    ],
  },
  {
    title: "14. Reviews and User-Submitted Content",
    items: [
      "Content must be accurate and reflect the user's actual experience.",
      "Content must not infringe the rights of any person.",
      "Content must not include personal data that the user is not authorized to publish.",
      "Content must not include abuse, threats, discrimination, or unlawful material.",
      "Content must not be used for unauthorized advertising or rating manipulation.",
    ],
  },
  {
    title: "15. Service Provider Obligations",
    items: [
      "Holding all required licenses and permits.",
      "Providing accurate information about the establishment and its services.",
      "Complying with advertised prices and offers.",
      "Fulfilling orders to the agreed quality and timing.",
      "Respecting consumer rights.",
      "Issuing required invoices and statutory documents.",
      "Protecting customer data.",
      "Handling complaints and returns in accordance with applicable laws.",
    ],
  },
  {
    title: "16. Intellectual Property",
    content: [
      "All rights relating to the NourApp name, trademarks, logos, designs, software, databases, and content are owned by or licensed to the Company.",
      "No part of the Platform may be copied, modified, distributed, sold, or otherwise exploited without prior written approval.",
    ],
  },
  {
    title: "17. Third-Party Services and Links",
    content: [
      "The Platform may rely on services provided by third parties, such as payment gateways, maps, login services, and delivery services.",
      "Those services are subject to the terms and policies of their respective providers.",
    ],
  },
  {
    title: "18. Platform Availability and Updates",
    content: [
      "We aim to provide the Platform continuously and securely, but some services may be temporarily suspended due to maintenance, updates, technical failures, security risks, or circumstances outside our control.",
    ],
  },
  {
    title: "19. Disclaimer",
    content: [
      "The Platform and services are provided as described and subject to availability.",
      "No exclusion of liability applies to fraud, gross negligence, or violations of mandatory consumer rights.",
    ],
  },
  {
    title: "20. Limitation of Liability",
    content: [
      "To the extent permitted by applicable law, the Company's liability for proven direct damages arising from a particular transaction is limited to the amount paid by the user for that transaction.",
    ],
  },
  {
    title: "21. Indemnity",
    items: [
      "The user's breach of these Terms.",
      "Unlawful use of the Platform.",
      "Infringement of another party's rights.",
      "Providing inaccurate or non-compliant data or content.",
      "Using the account for fraudulent or prohibited activity.",
    ],
  },
  {
    title: "22. Account Suspension and Termination",
    items: [
      "Violation of these Terms or other policies.",
      "Suspected fraud or misuse.",
      "Submission of forged information.",
      "Existence of a security risk.",
      "Failure to pay amounts due.",
      "A request from a competent authority.",
      "Discontinuation of the service or business activity.",
    ],
  },
  {
    title: "23. Privacy and Data Protection",
    content: [
      "Personal data is processed in accordance with the NourApp Privacy Policy and applicable laws.",
      "The Privacy Policy forms an integral part of these Terms.",
    ],
  },
  {
    title: "24. Electronic Communications",
    items: [
      "Email.",
      "Text messages.",
      "Application notifications.",
      "Notifications within the account.",
      "Contact methods provided by the user.",
    ],
  },
  {
    title: "25. Force Majeure",
    content: [
      "The Company is not liable for delay or failure to perform caused by events reasonably outside its control, including natural disasters, pandemics, wars, communication outages, government decisions, or emergencies.",
    ],
  },
  {
    title: "26. Changes to the Terms",
    content: [
      "The Platform may amend these Terms to reflect legal changes, service development, and security and compliance requirements.",
      "The updated version will be published with the date of the latest update, and users will be notified of material amendments where necessary.",
    ],
  },
  {
    title: "27. Severability",
    content: [
      "If any provision of these Terms is found to be invalid or unenforceable, the validity of the remaining provisions will not be affected.",
    ],
  },
  {
    title: "28. No Waiver",
    content: [
      "The Company's failure or delay in exercising any right does not constitute a waiver of that right, and no waiver is effective unless it is in writing and issued by an authorized representative.",
    ],
  },
  {
    title: "29. Entire Agreement",
    content: [
      "These Terms, the Privacy Policy, and the policies referred to in them constitute the entire agreement relating to use of the Platform.",
    ],
  },
  {
    title: "30. Governing Law",
    content: [
      "These Terms are governed by and interpreted in accordance with the laws of the Kingdom of Saudi Arabia.",
      "The parties will attempt to resolve any complaint or dispute amicably through customer service before referring the matter to the competent authorities.",
      "If an amicable resolution cannot be reached, jurisdiction lies with the competent courts or committees in the Kingdom of Saudi Arabia.",
    ],
  },
];

export default function TermsPage() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const termsSections = isArabic ? termsSectionsAr : termsSectionsEn;

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

          <h1>{isArabic ? "الشروط والأحكام" : "Terms & Conditions"}</h1>

          <p>
            {isArabic
              ? "تنظم هذه الشروط استخدام موقع وتطبيق وخدمات منصة نور آب، وحقوق والتزامات المستخدمين ومقدمي الخدمات."
              : "These Terms govern the use of the NourApp website, application, and services, and the rights and obligations of users and service providers."}
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
              {termsSections.map((section, index) => (
                <a href={`#term-${index + 1}`} key={section.title}>
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <article
            className="legal-document"
            aria-label={isArabic ? "الشروط والأحكام" : "Terms & Conditions"}
          >
            <div className="legal-notice">
              {isArabic
                ? "يرجى قراءة هذه الشروط بعناية قبل إنشاء حساب أو استخدام منصة نور آب."
                : "Please read these Terms carefully before creating an account or using NourApp."}
            </div>

            {termsSections.map((section, index) => (
              <section
                className="legal-section"
                id={`term-${index + 1}`}
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