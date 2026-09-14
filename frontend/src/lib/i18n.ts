export type Language = "en" | "hi" | "ta" | "te" | "kn" | "ml";

export interface TranslationStrings {
  govtOfIndia: string;
  ministryName: string;
  cpclFullName: string;
  cpclGroupTag: string;
  platformSubtitle: string;
  searchPlaceholder: string;
  signInButton: string;
  navHome: string;
  navTenders: string;
  navVerification: string;
  navQuickLinks: string;
  navAuditVault: string;
  navVendorReg: string;
  portalStatus: string;
  slides: {
    badge: string;
    subtitle: string;
    headline: string;
    description: string;
    actionText: string;
  }[];
  noticeTicker: string;
  activeTendersTitle: string;
  activeTendersSubtitle: string;
  filterAll: string;
  filterEquipment: string;
  filterServices: string;
  filterSafety: string;
  filterChemicals: string;
  estimatedValue: string;
  submissionDeadline: string;
  applyAndVerify: string;
  ruleEngineNotice: string;
  viewManual: string;
  instantAccessTitle: string;
  instantAccessSubtitle: string;
  instantAccessDesc: string;
  officerSignIn: string;
  bidderASignIn: string;
  bidderBSignIn: string;
  quickServicesTitle: string;
  cryptographicAudit: string;
  complianceCompiler: string;
  newVendorReg: string;
  vendorHelpdesk: string;
  architectureTitle: string;
  architectureSubtitle: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  footerAbout: string;
  footerQuickNav: string;
  footerGovtPortals: string;
  footerCopyright: string;
  footerGIGW: string;
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    govtOfIndia: "भारत सरकार | Government of India",
    ministryName: "पेट्रोलियम और प्राकृतिक गैस मंत्रालय | Ministry of Petroleum & Natural Gas",
    cpclFullName: "Chennai Petroleum Corporation Limited",
    cpclGroupTag: "A Govt. of India Enterprise • IndianOil Group",
    platformSubtitle: "BharatTender Shield — Central E-Procurement Bid Verification System",
    searchPlaceholder: "Search Tenders, Criteria, Rulebook, GSTIN...",
    signInButton: "Portal Sign In",
    navHome: "Home",
    navTenders: "Active Tenders",
    navVerification: "AI Rule Verification",
    navQuickLinks: "Quick Services",
    navAuditVault: "SHA-256 Audit Vault",
    navVendorReg: "Vendor Registration",
    portalStatus: "System Status: Online • 24x7 E-Procurement Portal",
    slides: [
      {
        badge: "OFFICIAL E-PROCUREMENT TENDER",
        subtitle: "Ministry of Petroleum & Natural Gas • Government of India",
        headline: "Invitation for Expression of Interest (EoI)",
        description:
          "High-capacity industrial equipment and refinery turnaround operations at Manali & Nagapattinam facilities with automated compliance verification.",
        actionText: "View Tender Details",
      },
      {
        badge: "DETERMINISTIC COMPLIANCE ENGINE",
        subtitle: "Government e-Marketplace (GeM) Integrated Engine",
        headline: "Automated GSTIN, Udyam MSME & Turnover Verification",
        description:
          "Instant cross-validation against GST Portal and MSME Udyam databases with zero human latency and tamper-proof verification logs.",
        actionText: "Open Verification Portal",
      },
      {
        badge: "TRANSPARENCY & INTEGRITY",
        subtitle: "Chennai Petroleum Corporation Limited (CPCL)",
        headline: "Tamper-Evident SHA-256 Cryptographic Audit Trails",
        description:
          "Every decision, AI confidence score, and verification event is locked into an immutable SHA-256 hash chain for audit defensibility.",
        actionText: "Inspect Audit Vault",
      },
    ],
    noticeTicker:
      "CPCL Tender Notice CPCL/PROC/2026/089 Active • Mandatory AI Bid Compliance Evaluation in progress • E-Bidding Open for Registered Vendors •",
    activeTendersTitle: "Active E-Procurement Tenders",
    activeTendersSubtitle: "Chennai Petroleum Corporation Limited — Live Public Procurement Notices",
    filterAll: "All Tenders",
    filterEquipment: "Equipment",
    filterServices: "Services",
    filterSafety: "Safety",
    filterChemicals: "Chemicals",
    estimatedValue: "Estimated Value",
    submissionDeadline: "Deadline",
    applyAndVerify: "Apply & Verify",
    ruleEngineNotice: "All procurement submissions are cross-verified via the BharatTender Shield deterministic rule pipeline.",
    viewManual: "View Verification Manual →",
    instantAccessTitle: "Enterprise Portal Access",
    instantAccessSubtitle: "Secure Role-Based Sign In",
    instantAccessDesc: "Access dedicated portals for Procurement Officers, Vendors, and Compliance Auditors:",
    officerSignIn: "Procurement Officer Console",
    bidderASignIn: "Bidder Enterprise Portal (Compliant)",
    bidderBSignIn: "Bidder Enterprise Portal (Discrepant)",
    quickServicesTitle: "Quick Links & Services",
    cryptographicAudit: "Cryptographic Audit Vault",
    complianceCompiler: "Tender Rule Compiler",
    newVendorReg: "New Vendor Registration",
    vendorHelpdesk: "Vendor Helpdesk & Guidelines",
    architectureTitle: "Platform Compliance Architecture",
    architectureSubtitle: "Ensuring 100% transparent, evidence-backed government procurement verification with human-in-the-loop governance.",
    pillar1Title: "Deterministic Rule Extraction",
    pillar1Desc: "Tender documents are automatically compiled into strict mathematical validation rules for GSTIN, financial capacity, and MSME validity.",
    pillar2Title: "Evidence Split-Viewer",
    pillar2Desc: "Officers view original PDF documents side-by-side with extracted metrics, verification results, and high-precision confidence scores.",
    pillar3Title: "SHA-256 Hash Chaining",
    pillar3Desc: "Every verification decision and officer confirmation is sealed in a continuous SHA-256 hash chain to guarantee zero tampering.",
    footerAbout: "Chennai Petroleum Corporation Limited (CPCL) is a premier refinery enterprise under the Ministry of Petroleum & Natural Gas, Government of India.",
    footerQuickNav: "Quick Navigation",
    footerGovtPortals: "Official Portals",
    footerCopyright: "© 2026 Chennai Petroleum Corporation Limited (CPCL) & BharatTender Shield. All Rights Reserved.",
    footerGIGW: "Compliant with Guidelines for Indian Government Websites (GIGW) & GeM Standards.",
  },

  hi: {
    govtOfIndia: "भारत सरकार | Government of India",
    ministryName: "पेट्रोलियम और प्राकृतिक गैस मंत्रालय | Ministry of Petroleum & Natural Gas",
    cpclFullName: "चेन्नई पेट्रोलियम कॉर्पोरेशन लिमिटेड",
    cpclGroupTag: "भारत सरकार का उपक्रम • इंडियन ऑयल समूह",
    platformSubtitle: "भारत टेंडर शील्ड — केंद्रीय ई-खरीद निविदा अनुपालन प्रणाली",
    searchPlaceholder: "निविदाएं, नियम पुस्तिका, GSTIN खोजें...",
    signInButton: "पोर्टल लॉगिन",
    navHome: "मुख्य पृष्ठ",
    navTenders: "सक्रिय निविदाएं",
    navVerification: "एआई सत्यापन प्रणाली",
    navQuickLinks: "त्वरित सेवाएं",
    navAuditVault: "SHA-256 ऑडिट वॉल्ट",
    navVendorReg: "विक्रेता पंजीकरण",
    portalStatus: "पोर्टल स्थिति: सक्रिय • 24x7 ई-प्रोक्योरमेंट",
    slides: [
      {
        badge: "आधिकारिक ई-प्रोक्योरमेंट निविदा",
        subtitle: "पेट्रोलियम और प्राकृतिक गैस मंत्रालय • भारत सरकार",
        headline: "रुचि की अभिव्यक्ति (EoI) हेतु आमंत्रण",
        description:
          "मनाली और नागपट्टिनम रिफाइनरियों के लिए उच्च स्तरीय औद्योगिक उपकरण और वार्षिक रखरखाव सेवाएं।",
        actionText: "निविदा विवरण देखें",
      },
      {
        badge: "स्वचालित अनुपालन इंजन",
        subtitle: "GeM पोर्टल एकीकृत सत्यापन",
        headline: "स्वचालित GSTIN, उद्यम MSME एवं टर्नओवर सत्यापन",
        description:
          "जीएसटी पोर्टल और उद्यम एमएसएमई डेटाबेस से तत्काल मिलान बिना किसी मानवीय देरी के।",
        actionText: "सत्यापन पोर्टल खोलें",
      },
      {
        badge: "पारदर्शिता एवं सुरक्षा",
        subtitle: "चेन्नई पेट्रोलियम कॉर्पोरेशन लिमिटेड (CPCL)",
        headline: "अपरिवर्तनीय SHA-256 क्रिप्टोग्राफिक ऑडिट ट्रेल",
        description:
          "प्रत्येक अधिकारी निर्णय और दस्तावेज़ सत्यापन को SHA-256 हैश श्रृंखला में सुरक्षित किया जाता है।",
        actionText: "ऑडिट वॉल्ट देखें",
      },
    ],
    noticeTicker:
      "CPCL निविदा सूचना CPCL/PROC/2026/089 सक्रिय • स्वचालित एआई बोली अनुपालन सत्यापन जारी • पंजीकृत विक्रेताओं के लिए ई-बिडिंग खुली है •",
    activeTendersTitle: "सक्रिय ई-प्रोक्योरमेंट निविदाएं",
    activeTendersSubtitle: "चेन्नई पेट्रोलियम कॉर्पोरेशन लिमिटेड — सार्वजनिक खरीद सूचनाएं",
    filterAll: "सभी निविदाएं",
    filterEquipment: "उपकरण",
    filterServices: "सेवाएं",
    filterSafety: "सुरक्षा",
    filterChemicals: "रसायन",
    estimatedValue: "अनुमानित मूल्य",
    submissionDeadline: "अंतिम तिथि",
    applyAndVerify: "आवेदन एवं सत्यापन",
    ruleEngineNotice: "सभी बोलियों का सत्यापन भारत टेंडर शील्ड नियमों के तहत किया जाता है।",
    viewManual: "सत्यापन नियमावली देखें →",
    instantAccessTitle: "एंटरप्राइज पोर्टल प्रवेश",
    instantAccessSubtitle: "सुरक्षित भूमिका-आधारित लॉगिन",
    instantAccessDesc: "अधिकारियों, बोलीदाताओं और ऑडिटरों के लिए समर्पित पोर्टल:",
    officerSignIn: "खरीद अधिकारी कंसोल",
    bidderASignIn: "बोलीदाता उद्यम पोर्टल (अनुपालन योग्य)",
    bidderBSignIn: "बोलीदाता उद्यम पोर्टल (विसंगति जांच)",
    quickServicesTitle: "त्वरित लिंक एवं सेवाएं",
    cryptographicAudit: "क्रिप्टोग्राफिक ऑडिट वॉल्ट",
    complianceCompiler: "निविदा नियम संकलक",
    newVendorReg: "नया विक्रेता पंजीकरण",
    vendorHelpdesk: "विक्रेता सहायता केंद्र",
    architectureTitle: "प्लेटफॉर्म अनुपालन संरचना",
    architectureSubtitle: "पारदर्शी और साक्ष्य-आधारित खरीद सत्यापन प्रणाली।",
    pillar1Title: "सटीक नियम निष्कर्षण",
    pillar1Desc: "निविदा दस्तावेजों से योग्यता शर्तों का स्वचालित निष्कर्षण।",
    pillar2Title: "साक्ष्य स्प्लिट-व्यूअर",
    pillar2Desc: "मूल दस्तावेजों के साथ डेटा सत्यापन का सीधा तुलनात्मक दृश्य।",
    pillar3Title: "SHA-256 हैश शृंखला",
    pillar3Desc: "छेड़छाड़-मुक्त अपरिवर्तनीय ऑडिट ट्रेल।",
    footerAbout: "चेन्नई पेट्रोलियम कॉर्पोरेशन लिमिटेड (CPCL) पेट्रोलियम एवं प्राकृतिक गैस मंत्रालय के अधीन एक अग्रणी उद्यम है।",
    footerQuickNav: "त्वरित नेविगेशन",
    footerGovtPortals: "सरकारी पोर्टल",
    footerCopyright: "© 2026 चेन्नई पेट्रोलियम कॉर्पोरेशन लिमिटेड (CPCL) एवं भारत टेंडर शील्ड। सर्वाधिकार सुरक्षित।",
    footerGIGW: "भारत सरकार की वेबसाइटों के लिए दिशानिर्देश (GIGW) के अनुरूप।",
  },

  ta: {
    govtOfIndia: "இந்திய அரசு | Government of India",
    ministryName: "பெட்ரோலியம் மற்றும் இயற்கை எரிவாயு அமைச்சகம் | MoP&NG",
    cpclFullName: "சென்னை பெட்ரோலியம் கார்ப்பரேஷன் லிமிடெட்",
    cpclGroupTag: "இந்திய அரசு நிறுவனம் • இந்தியன் ஆயில் குழுமம்",
    platformSubtitle: "பாரத் டெண்டர் ஷீல்ட் — மத்திய மின்-கொள்முதல் ஏல சரிபார்ப்பு தளம்",
    searchPlaceholder: "டெண்டர்கள், விதிமுறைகள், GSTIN தேடுக...",
    signInButton: "போர்ட்டல் உள்நுழைவு",
    navHome: "முகப்பு",
    navTenders: "நடப்பு டெண்டர்கள்",
    navVerification: "AI சரிபார்ப்பு அமைப்பு",
    navQuickLinks: "விரைவு சேவைகள்",
    navAuditVault: "SHA-256 தணிக்கை பெட்டகம்",
    navVendorReg: "விற்பனையாளர் பதிவு",
    portalStatus: "நிலை: இயங்குகிறது • 24x7 மின்-கொள்முதல் தளம்",
    slides: [
      {
        badge: "அதிகாரப்பூர்வ மின்-கொள்முதல் டெண்டர்",
        subtitle: "பெட்ரோலியம் மற்றும் இயற்கை எரிவாயு அமைச்சகம்",
        headline: "விருப்பக் கோரிக்கைக்கான அழைப்பு (EoI)",
        description:
          "மணலி மற்றும் நாகப்பட்டினம் சுத்திகரிப்பு ஆலைகளுக்கான நவீன உபகரணங்கள் மற்றும் பராமரிப்பு டெண்டர்கள்.",
        actionText: "டெண்டர் விவரங்களை காண்க",
      },
      {
        badge: "தானியங்கி விதிமுறை சரிபார்ப்பு",
        subtitle: "GeM போர்ட்டல் ஒருங்கிணைந்த அமைப்பு",
        headline: "தானியங்கி GSTIN, உத்யம் MSME & விற்றுமுதல் சரிபார்ப்பு",
        description:
          "ஜிஎஸ்டி மற்றும் உத்யம் தரவுகளுடன் உடனடி நேரடி சரிபார்ப்பு.",
        actionText: "சரிபார்ப்பு போர்ட்டல் திற",
      },
      {
        badge: "வெளிப்படைத்தன்மை மற்றும் பாதுகாப்பு",
        subtitle: "சென்னை பெட்ரோலியம் கார்ப்பரேஷன் லிமிடெட் (CPCL)",
        headline: "மாற்ற முடியாத SHA-256 கிரிப்டோகிராஃபிக் தணிக்கை",
        description:
          "ஒவ்வொரு அதிகாரி முடிவும் SHA-256 ஹாஷ் சங்கிலி மூலம் பாதுகாக்கப்பட்டு சட்டப்பூர்வமாக உறுதிப்படுத்தப்படுகிறது.",
        actionText: "தணிக்கை பெட்டகம் காண்க",
      },
    ],
    noticeTicker:
      "CPCL டெண்டர் அறிவிப்பு CPCL/PROC/2026/089 இயங்குகிறது • AI ஏல சரிபார்ப்பு நடைமுறையில் உள்ளது • பதிவுசெய்த விற்பனையாளர்களுக்கு மின்-ஏலம் திறக்கப்பட்டுள்ளது •",
    activeTendersTitle: "நடப்பு மின்-கொள்முதல் டெண்டர்கள்",
    activeTendersSubtitle: "சென்னை பெட்ரோலியம் கார்ப்பரேஷன் லிமிடெட் — நேரடி பொதுக் கொள்முதல் அறிவிப்புகள்",
    filterAll: "அனைத்து டெண்டர்கள்",
    filterEquipment: "உபகரணங்கள்",
    filterServices: "சேவைகள்",
    filterSafety: "பாதுகாப்பு",
    filterChemicals: "இரசாயனங்கள்",
    estimatedValue: "மதிப்பிடப்பட்ட மதிப்பு",
    submissionDeadline: "கடைசி தேதி",
    applyAndVerify: "விண்ணப்பித்து சரிபார்",
    ruleEngineNotice: "அனைத்து ஏலங்களும் பாரத் டெண்டர் ஷீல்ட் விதிகளின் கீழ் சரிபார்க்கப்படுகின்றன.",
    viewManual: "சரிபார்ப்பு கையேடு →",
    instantAccessTitle: "நிறுவன போர்ட்டல் அணுகல்",
    instantAccessSubtitle: "பாதுகாப்பான உள்நுழைவு",
    instantAccessDesc: "கொள்முதல் அதிகாரிகள், ஏலதாரர்கள் மற்றும் தணிக்கையாளர்களுக்கான பிரத்யேக தளம்:",
    officerSignIn: "கொள்முதல் அதிகாரி பலகை",
    bidderASignIn: "ஏலதாரர் தளம் (தகுதி பெற்றது)",
    bidderBSignIn: "ஏலதாரர் தளம் (விதிமீறல் சரிபார்ப்பு)",
    quickServicesTitle: "விரைவு இணைப்புகள் & சேவைகள்",
    cryptographicAudit: "கிரிப்டோகிராஃபிக் தணிக்கை பெட்டகம்",
    complianceCompiler: "டெண்டர் விதிமுறைகள் தொகுப்பி",
    newVendorReg: "புதிய விற்பனையாளர் பதிவு",
    vendorHelpdesk: "விற்பனையாளர் உதவி மையம்",
    architectureTitle: "தளத்தின் பாதுகாப்பு கட்டமைப்பு",
    architectureSubtitle: "வெளிப்படையான மற்றும் ஆதார அடிப்படையிலான அரசு கொள்முதல் சரிபார்ப்பு.",
    pillar1Title: "துல்லிய விதிமுறை பிரித்தெடுத்தல்",
    pillar1Desc: "டெண்டர் ஆவணங்களிலிருந்து தகுதி விதிமுறைகளை தானாக தொகுத்தல்.",
    pillar2Title: "ஆதார பிளவு பார்வையாளர்",
    pillar2Desc: "அசல் ஆவணங்களுடன் நேரடி ஒப்பீட்டு சரிபார்ப்பு காட்சி.",
    pillar3Title: "SHA-256 ஹாஷ் சங்கிலி",
    pillar3Desc: "மாற்ற முடியாத பாதுகாப்பான தணிக்கை பதிவு.",
    footerAbout: "சென்னை பெட்ரோலியம் கார்ப்பரேஷன் லிமிடெட் (CPCL) மத்திய பெட்ரோலிய அமைச்சகத்தின் கீழ் இயங்கும் முதன்மை நிறுவனம்.",
    footerQuickNav: "விரைவு வழிகாட்டல்",
    footerGovtPortals: "அரசு இணையதளங்கள்",
    footerCopyright: "© 2026 சென்னை பெட்ரோலியம் கார்ப்பரேஷன் லிமிடெட் (CPCL). அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    footerGIGW: "இந்திய அரசு வலைத்தள வழிகாட்டுதல்களுக்கு (GIGW) உட்பட்டது.",
  },

  te: {
    govtOfIndia: "భారత ప్రభుత్వం | Government of India",
    ministryName: "పెట్రోలియం & సహజ వాయువు మంత్రిత్వ శాఖ | MoP&NG",
    cpclFullName: "చెన్నై పెట్రోలియం కార్పొరేషన్ లిమిటెడ్",
    cpclGroupTag: "భారత ప్రభుత్వ సంస్థ • ఇండియన్ ఆయిల్ గ్రూప్",
    platformSubtitle: "భారత్ టెండర్ షీల్డ్ — కేంద్రీకృత ఈ-ప్రొక్యూర్మెంట్ బిడ్ ధృవీకరణ వ్యవస్థ",
    searchPlaceholder: "టెండర్లు, నిబంధనలు, GSTIN శోధించండి...",
    signInButton: "పోర్టల్ లాగిన్",
    navHome: "హోమ్",
    navTenders: "యాక్టివ్ టెండర్లు",
    navVerification: "AI ధృవీకరణ వ్యవస్థ",
    navQuickLinks: "త్వరిత సేవలు",
    navAuditVault: "SHA-256 ఆడిట్ వాల్ట్",
    navVendorReg: "వెండర్ రిజిస్ట్రేషన్",
    portalStatus: "స్థితి: ఆన్‌లైన్ • 24x7 ఈ-ప్రొక్యూర్మెంట్",
    slides: [
      {
        badge: "అధికారిక ఈ-ప్రొక్యూర్మెంట్ టెండర్",
        subtitle: "పెట్రోలియం & సహజ వాయువు మంత్రిత్వ శాఖ",
        headline: "ఆసక్తి వ్యక్తీకరణకు ఆహ్వానం (EoI)",
        description:
          "మనాలి & నాగపట్నం రిఫైనరీల కోసం పారిశ్రామిక పరికరాలు మరియు నిర్వహణ టెండర్లు.",
        actionText: "టెండర్ వివరాలు చూడండి",
      },
      {
        badge: "నియమ ఆధారిత ధృవీకరణ",
        subtitle: "GeM పోర్టల్ అనుసంధానం",
        headline: "స్వయంచాలక GSTIN, ఉద్యమ్ MSME ధృవీకరణ",
        description:
          "జీఎస్టీ మరియు ఉద్యమ్ డేటాబేస్‌లతో తక్షణ ఖచ్చితమైన ధృవీకరణ.",
        actionText: "ధృవీకరణ పోర్టల్ తెరవండి",
      },
      {
        badge: "పారదర్శకత & భద్రత",
        subtitle: "చెన్నై పెట్రోలియం కార్పొరేషన్ లిమిటెడ్ (CPCL)",
        headline: "మార్చలేని SHA-256 క్రిప్టోగ్రాఫిక్ ఆడిట్ ట్రయల్",
        description:
          "ప్రతి నిర్ణయం మరియు ధృవీకరణ SHA-256 హాష్ చైన్‌తో సురక్షితం చేయబడుతుంది.",
        actionText: "ఆడిట్ వాల్ట్ చూడండి",
      },
    ],
    noticeTicker:
      "CPCL టెండర్ నోటీసు CPCL/PROC/2026/089 యాక్టివ్ • ఆటోమేటెడ్ AI బిడ్ ధృవీకరణ కొనసాగుతోంది • నమోదిత విక్రేతలకు ఈ-బిడ్డింగ్ అందుబాటులో ఉంది •",
    activeTendersTitle: "యాక్టివ్ ఈ-ప్రొక్యూర్మెంట్ టెండర్లు",
    activeTendersSubtitle: "చెన్నై పెట్రోలియం కార్పొరేషన్ లిమిటెడ్ — అధికారిక టెండర్ నోటీసులు",
    filterAll: "అన్ని టెండర్లు",
    filterEquipment: "పరికరాలు",
    filterServices: "సేవలు",
    filterSafety: "భద్రత",
    filterChemicals: "రసాయనాలు",
    estimatedValue: "అంచనా విలువ",
    submissionDeadline: "చివరి తేదీ",
    applyAndVerify: "దరఖాస్తు & ధృవీకరించు",
    ruleEngineNotice: "అన్ని బిడ్లు భారత్ టెండర్ షీల్డ్ నిబంధనల ప్రకారం ధృవీకరించబడతాయి.",
    viewManual: "ధృవీకరణ మాన్యువల్ →",
    instantAccessTitle: "ఎంటర్‌ప్రైజ్ పోర్టల్ లాగిన్",
    instantAccessSubtitle: "సురక్షిత లాగిన్",
    instantAccessDesc: "అధికారులు మరియు బిడ్డర్ల కోసం అధికారిక పోర్టల్:",
    officerSignIn: "ప్రొక్యూర్మెంట్ ఆఫీసర్ కన్సోల్",
    bidderASignIn: "బిడ్డర్ పోర్టల్ (అర్హత కలిగిన)",
    bidderBSignIn: "బిడ్డర్ పోర్టల్ (లోపాల తనిఖీ)",
    quickServicesTitle: "త్వరిత లింకులు & సేవలు",
    cryptographicAudit: "క్రిప్టోగ్రాఫిక్ ఆడిట్ వాల్ట్",
    complianceCompiler: "టెండర్ రూల్స్ కంపైలర్",
    newVendorReg: "కొత్త వెండర్ నమోదు",
    vendorHelpdesk: "వెండర్ హెల్ప్‌డెస్క్",
    architectureTitle: "ప్లాట్‌ఫారమ్ భద్రతా నిర్మాణం",
    architectureSubtitle: "పారదర్శక మరియు ఆధార ఆధారిత ప్రభుత్వ ప్రొక్యూర్మెంట్ ధృవీకరణ.",
    pillar1Title: "ఖచ్చితమైన నియమ సంగ్రహణ",
    pillar1Desc: "టెండర్ పత్రాల నుండి ఆటోమేటెడ్ నియమ నిర్మాణం.",
    pillar2Title: "ఎవిడెన్స్ స్ప్లిట్-వ్యూయర్",
    pillar2Desc: "ఒరిజినల్ పత్రాలతో ప్రత్యక్ష పోలిక ధృవీకరణ.",
    pillar3Title: "SHA-256 హాష్ చైన్",
    pillar3Desc: "మార్చలేని విశ్వసనీయ ఆడిట్ రికార్డ్.",
    footerAbout: "చెన్నై పెట్రోలియం కార్పొరేషన్ లిమిటెడ్ (CPCL) కేంద్ర పెట్రోలియం మంత్రిత్వ శాఖ పరిధిలోని ప్రముఖ సంస్థ.",
    footerQuickNav: "త్వరిత నావిగేషన్",
    footerGovtPortals: "ప్రభుత్వ పోర్టల్స్",
    footerCopyright: "© 2026 చెన్నై పెట్రోలియం కార్పొరేషన్ లిమిటెడ్ (CPCL). సర్వహక్కులు రక్షించబడ్డాయి.",
    footerGIGW: "భారత ప్రభుత్వ వెబ్‌సైట్ మార్గదర్శకాలకు (GIGW) అనుగుణంగా రూపొందించబడింది.",
  },

  kn: {
    govtOfIndia: "ಭಾರತ ಸರ್ಕಾರ | Government of India",
    ministryName: "ಪೆಟ್ರೋಲಿಯಂ ಮತ್ತು ನೈಸರ್ಗಿಕ ಅನಿಲ ಸಚಿವಾಲಯ | MoP&NG",
    cpclFullName: "ಚೆನ್ನೈ ಪೆಟ್ರೋಲಿಯಂ ಕಾರ್ಪೊರೇಷನ್ ಲಿಮಿಟೆಡ್",
    cpclGroupTag: "ಭಾರತ ಸರ್ಕಾರದ ಉದ್ಯಮ • ಇಂಡಿಯನ್ ಆಯಿಲ್ ಗ್ರೂಪ್",
    platformSubtitle: "ಭಾರತ್ ಟೆಂಡರ್ ಶೀಲ್ಡ್ — ಕೇಂದ್ರ ಇ-ಖರೀದಿ ಬಿಡ್ ಪರಿಶೀಲನಾ ವ್ಯವಸ್ಥೆ",
    searchPlaceholder: "ಟೆಂಡರ್‌ಗಳು, ನಿಯಮಗಳು, GSTIN ಹುಡುಕಿ...",
    signInButton: "ಪೋರ್ಟಲ್ ಲಾಗಿನ್",
    navHome: "ಮುಖಪುಟ",
    navTenders: "ಸಕ್ರಿಯ ಟೆಂಡರ್‌ಗಳು",
    navVerification: "AI ಪರಿಶೀಲನಾ ವ್ಯವಸ್ಥೆ",
    navQuickLinks: "ತ್ವರಿತ ಸೇವೆಗಳು",
    navAuditVault: "SHA-256 ಆಡಿಟ್ ವಾಲ್ಟ್",
    navVendorReg: "ಮಾರಾಟಗಾರರ ನೋಂದಣಿ",
    portalStatus: "ಸ್ಥಿತಿ: ಆನ್‌ಲೈನ್ • 24x7 ಇ-ಪ್ರೊಕ್ಯೂರ್‌ಮೆಂಟ್",
    slides: [
      {
        badge: "ಅಧಿಕೃತ ಇ-ಪ್ರೊಕ್ಯೂರ್‌ಮೆಂಟ್ ಟೆಂಡರ್",
        subtitle: "ಪೆಟ್ರೋಲಿಯಂ ಮತ್ತು ನೈಸರ್ಗಿಕ ಅನಿಲ ಸಚಿವಾಲಯ",
        headline: "ಆಸಕ್ತಿ ಅಭಿವ್ಯಕ್ತಿಗೆ ಆಹ್ವಾನ (EoI)",
        description:
          "ಮನಾಲಿಯ ಮತ್ತು ನಾಗಪಟ್ಟಿಣಂ ಸಂಸ್ಕರಣಾಗಾರಗಳಿಗೆ ಕೈಗಾರಿಕಾ ಉಪಕರಣಗಳು ಮತ್ತು ನಿರ್ವಹಣಾ ಟೆಂಡರ್‌ಗಳು.",
        actionText: "ಟೆಂಡರ್ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
      },
      {
        badge: "ಸ್ವಯಂಚಾಲಿತ ನಿಯಮ ಪರಿಶೀಲನೆ",
        subtitle: "GeM ಪೋರ್ಟಲ್ ಏಕೀಕರಣ",
        headline: "ಸ್ವಯಂಚಾಲಿತ GSTIN, ಉದ್ಯಮ್ MSME ಪರಿಶೀಲನೆ",
        description:
          "ಜಿಎಸ್‌ಟಿ ಮತ್ತು ಉದ್ಯಮ್ ಡೇಟಾಬೇಸ್‌ಗಳೊಂದಿಗೆ ತಕ್ಷಣದ ಪರಿಶೀಲನೆ.",
        actionText: "ಪರಿಶೀಲನಾ ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ",
      },
      {
        badge: "ಪಾರದರ್ಶಕತೆ ಮತ್ತು ಭದ್ರತೆ",
        subtitle: "ಚೆನ್ನೈ ಪೆಟ್ರೋಲಿಯಂ ಕಾರ್ಪೊರೇಷನ್ ಲಿಮಿಟೆಡ್ (CPCL)",
        headline: "ಬದಲಾಯಿಸಲಾಗದ SHA-256 ಕ್ರಿಪ್ಟೋಗ್ರಾಫಿಕ್ ಆಡಿಟ್ ಟ್ರಯಲ್",
        description:
          "ಪ್ರತಿಯೊಂದು ಅಧಿಕೃತ ನಿರ್ಧಾರವನ್ನು SHA-256 ಹ್ಯಾಶ್ ಚೈನ್ ಮೂಲಕ ಸುರಕ್ಷಿತಗೊಳಿಸಲಾಗಿದೆ.",
        actionText: "ಆಡಿಟ್ ವಾಲ್ಟ್ ವೀಕ್ಷಿಸಿ",
      },
    ],
    noticeTicker:
      "CPCL ಟೆಂಡರ್ ಪ್ರಕಟಣೆ CPCL/PROC/2026/089 ಸಕ್ರಿಯವಾಗಿದೆ • ಸ್ವಯಂಚಾಲಿತ AI ಬಿಡ್ ಪರಿಶೀಲನೆ ಚಾಲನೆಯಲ್ಲಿದೆ • ನೋಂದಾಯಿತ ಮಾರಾಟಗಾರರಿಗೆ ಇ-ಬಿಡ್ಡಿಂಗ್ ಲಭ್ಯವಿದೆ •",
    activeTendersTitle: "ಸಕ್ರಿಯ ಇ-ಪ್ರೊಕ್ಯೂರ್‌ಮೆಂಟ್ ಟೆಂಡರ್‌ಗಳು",
    activeTendersSubtitle: "ಚೆನ್ನೈ ಪೆಟ್ರೋಲಿಯಂ ಕಾರ್ಪೊರೇಷನ್ ಲಿಮಿಟೆಡ್ — ಅಧಿಕೃತ ಟೆಂಡರ್ ಪ್ರಕಟಣೆಗಳು",
    filterAll: "ಎಲ್ಲಾ ಟೆಂಡರ್‌ಗಳು",
    filterEquipment: "ಉಪಕರಣಗಳು",
    filterServices: "ಸೇವೆಗಳು",
    filterSafety: "ಸುರಕ್ಷತೆ",
    filterChemicals: "ರಾಸಾಯನಿಕಗಳು",
    estimatedValue: "ಅಂದಾಜು ಮೌಲ್ಯ",
    submissionDeadline: "ಕೊನೆಯ ದಿನಾಂಕ",
    applyAndVerify: "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ & ಪರಿಶೀಲಿಸಿ",
    ruleEngineNotice: "ಎಲ್ಲಾ ಬಿಡ್‌ಗಳನ್ನು ಭಾರತ್ ಟೆಂಡರ್ ಶೀಲ್ಡ್ ನಿಯಮಗಳ ಅಡಿಯಲ್ಲಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ.",
    viewManual: "ಪರಿಶೀಲನಾ ಕೈಪಿಡಿ ವೀಕ್ಷಿಸಿ →",
    instantAccessTitle: "ಎಂಟರ್‌ಪ್ರೈಸ್ ಪೋರ್ಟಲ್ ಲಾಗಿನ್",
    instantAccessSubtitle: "ಸುರಕ್ಷಿತ ಪಾತ್ರ-ಆಧಾರಿತ ಲಾಗಿನ್",
    instantAccessDesc: "ಅಧಿಕಾರಿಗಳು ಮತ್ತು ಬಿಡ್ಡರ್‌ಗಳಿಗಾಗಿ ಮೀಸಲಾದ ಪೋರ್ಟಲ್:",
    officerSignIn: "ಖರೀದಿ ಅಧಿಕಾರಿ ಕನ್ಸೋಲ್",
    bidderASignIn: "ಬಿಡ್ಡರ್ ಪೋರ್ಟಲ್ (ಅರ್ಹತೆ ಪಡೆದ)",
    bidderBSignIn: "ಬಿಡ್ಡರ್ ಪೋರ್ಟಲ್ (ದೋಷ ಪರಿಶೀಲನೆ)",
    quickServicesTitle: "ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು & ಸೇವೆಗಳು",
    cryptographicAudit: "ಕ್ರಿಪ್ಟೋಗ್ರಾಫಿಕ್ ಆಡಿಟ್ ವಾಲ್ಟ್",
    complianceCompiler: "ಟೆಂಡರ್ ನಿಯಮಗಳ ಕಂಪೈಲರ್",
    newVendorReg: "ಹೊಸ ಮಾರಾಟಗಾರರ ನೋಂದಣಿ",
    vendorHelpdesk: "ಮಾರಾಟಗಾರರ ಸಹಾಯವಾಣಿ",
    architectureTitle: "ವೇದಿಕೆಯ ಭದ್ರತಾ ವಾಸ್ತುಶಿಲ್ಪ",
    architectureSubtitle: "ಪಾರದರ್ಶಕ ಮತ್ತು ಸಾಕ್ಷ್ಯ-ಆಧಾರಿತ ಸರ್ಕಾರಿ ಖರೀದಿ ಪರಿಶೀಲನೆ.",
    pillar1Title: "ನಿಖರ ನಿಯಮ ಹೊರತೆಗೆಯುವಿಕೆ",
    pillar1Desc: "ಟೆಂಡರ್ ದಾಖಲೆಗಳಿಂದ ಸ್ವಯಂಚಾಲಿತ ನಿಯಮ ರಚನೆ.",
    pillar2Title: "ಸಾಕ್ಷ್ಯ ವಿಭಜಿತ ವೀಕ್ಷಕ",
    pillar2Desc: "ಮೂಲ ದಾಖಲೆಗಳೊಂದಿಗೆ ನೇರ ಹೋಲಿಕೆ ಪರಿಶೀಲನೆ.",
    pillar3Title: "SHA-256 ಹ್ಯಾಶ್ ಚೈನ್",
    pillar3Desc: "ಬದಲಾಯಿಸಲಾಗದ ವಿಶ್ವಾಸಾರ್ಹ ಆಡಿಟ್ ದಾಖಲೆ.",
    footerAbout: "ಚೆನ್ನೈ ಪೆಟ್ರೋಲಿಯಂ ಕಾರ್ಪೊರೇಷನ್ ಲಿಮಿಟೆಡ್ (CPCL) ಕೇಂದ್ರ ಪೆಟ್ರೋಲಿಯಂ ಸಚಿವಾಲಯದ ಅಡಿಯಲ್ಲಿರುವ ಪ್ರಮುಖ ಸಂಸ್ಥೆಯಾಗಿದೆ.",
    footerQuickNav: "ತ್ವರಿತ ನ್ಯಾವಿಗೇಷನ್",
    footerGovtPortals: "ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ಗಳು",
    footerCopyright: "© 2026 ಚೆನ್ನೈ ಪೆಟ್ರೋಲಿಯಂ ಕಾರ್ಪೊರೇಷನ್ ಲಿಮಿಟೆಡ್ (CPCL). ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
    footerGIGW: "ಭಾರತ ಸರ್ಕಾರ ವೆಬ್‌ಸೈಟ್ ಮಾರ್ಗಸೂಚಿಗಳಿಗೆ (GIGW) ಅನುಗುಣವಾಗಿದೆ.",
  },

  ml: {
    govtOfIndia: "ഭാരത സർക്കാർ | Government of India",
    ministryName: "പെട്രോളിയം പ്രകൃതിവാതക മന്ത്രാലയം | MoP&NG",
    cpclFullName: "ചെന്നൈ പെട്രോളിയം കോർപ്പറേഷൻ ലിമിറ്റഡ്",
    cpclGroupTag: "ഭാരത സർക്കാർ സംരംഭം • ഇന്ത്യൻ ഓയിൽ ഗ്രൂപ്പ്",
    platformSubtitle: "ഭാരത് ടെൻഡർ ഷീൽഡ് — കേന്ദ്ര ഇ-സംഭരണ ബിഡ് പരിശോധനാ പ്ലാറ്റ്‌ഫോം",
    searchPlaceholder: "ടെൻഡറുകൾ, നിയമങ്ങൾ, GSTIN തിരയുക...",
    signInButton: "പോർട്ടൽ ലോഗിൻ",
    navHome: "ഹോം",
    navTenders: "സജീവ ടെൻഡറുകൾ",
    navVerification: "AI പരിശോധനാ സംവിധാനം",
    navQuickLinks: "ദ്രുത സേവനങ്ങൾ",
    navAuditVault: "SHA-256 ഓഡിറ്റ് വോൾട്ട്",
    navVendorReg: "വെണ്ടർ രജിസ്ട്രേഷൻ",
    portalStatus: "നില: ഓൺലൈൻ • 24x7 ഇ-സംഭരണം",
    slides: [
      {
        badge: "ഔദ്യോഗിക ഇ-സംഭരണ ടെൻഡർ",
        subtitle: "പെട്രോളിയം പ്രകൃതിവാതക മന്ത്രാലയം",
        headline: "താൽപ്പര്യ പ്രകടനത്തിനുള്ള ക്ഷണം (EoI)",
        description:
          "മണാലി, നാഗപട്ടണം റിഫൈനറികൾക്കായുള്ള വ്യവസായ ഉപകരണങ്ങളും അറ്റകുറ്റപ്പണി ടെൻഡറുകളും.",
        actionText: "ടെൻഡർ വിവരങ്ങൾ കാണുക",
      },
      {
        badge: "നിയമാധിഷ്ഠിത പരിശോധന",
        subtitle: "GeM പോർട്ടൽ സംയോജനം",
        headline: "ഓട്ടോമേറ്റഡ് GSTIN, ഉദ്യം MSME പരിശോധന",
        description:
          "ജിഎസ്ടി, ഉദ്യം ഡാറ്റാബേസുകളുമായി തത്സമയ കൃത്യമായ പരിശോധന.",
        actionText: "പരിശോധനാ പോർട്ടൽ തുറക്കുക",
      },
      {
        badge: "സുതാര്യതയും സുരക്ഷയും",
        subtitle: "ചെന്നൈ പെട്രോളിയം കോർപ്പറേഷൻ ലിമിറ്റഡ് (CPCL)",
        headline: "മാറ്റമില്ലാത്ത SHA-256 ക്രിപ്റ്റോഗ്രാഫിക് ഓഡിറ്റ് ട്രയൽ",
        description:
          "ഓരോ തീരുമാനവും പരിശോധനയും SHA-256 ഹാഷ് ചെയിൻ വഴി പൂർണ്ണമായി സുരക്ഷിതമാക്കുന്നു.",
        actionText: "ഓഡിറ്റ് വോൾട്ട് കാണുക",
      },
    ],
    noticeTicker:
      "CPCL ടെൻഡർ അറിയിപ്പ് CPCL/PROC/2026/089 സജീവമാണ് • ഓട്ടോമേറ്റഡ് AI ബിഡ് പരിശോധന പുരോഗമിക്കുന്നു • രജിസ്റ്റർ ചെയ്ത വെണ്ടർമാർക്ക് ഇ-ബിഡ്ഡിംഗ് ലഭ്യമാണ് •",
    activeTendersTitle: "സജീവ ഇ-സംഭരണ ടെൻഡറുകൾ",
    activeTendersSubtitle: "ചെന്നൈ പെട്രോളിയം കോർപ്പറേഷൻ ലിമിറ്റഡ് — പൊതു സംഭരണ അറിയിപ്പുകൾ",
    filterAll: "എല്ലാ ടെൻഡറുകളും",
    filterEquipment: "ഉപകരണങ്ങൾ",
    filterServices: "സേവനങ്ങൾ",
    filterSafety: "സുരക്ഷ",
    filterChemicals: "രാസവസ്തുക്കൾ",
    estimatedValue: "കണക്കാക്കിയ മൂല്യം",
    submissionDeadline: "അവസാന തീയതി",
    applyAndVerify: "അപേക്ഷിക്കുക & പരിശോധിക്കുക",
    ruleEngineNotice: "എല്ലാ ബിഡുകളും ഭാരത് ടെൻഡർ ഷീൽഡ് നിയമങ്ങൾ പ്രകാരം പരിശോധിക്കുന്നു.",
    viewManual: "പരിശോധനാ മാനുവൽ കാണുക →",
    instantAccessTitle: "എന്റർപ്രൈസ് പോർട്ടൽ ലോഗിൻ",
    instantAccessSubtitle: "സുരക്ഷിത റൂൾ അടിസ്ഥാന ലോഗിൻ",
    instantAccessDesc: "ഉദ്യോഗസ്ഥർക്കും ബിഡ്ഡർമാർക്കുമുള്ള ഔദ്യോഗിക പോർട്ടൽ:",
    officerSignIn: "പ്രൊക്യുർമെന്റ് ഓഫീസർ കൺസോൾ",
    bidderASignIn: "ബിഡ്ഡർ പോർട്ടൽ (അർഹത നേടിയ)",
    bidderBSignIn: "ബിഡ്ഡർ പോർട്ടൽ (പിശക് പരിശോധന)",
    quickServicesTitle: "ദ്രുത ലിങ്കുകളും സേവനങ്ങളും",
    cryptographicAudit: "ക്രിപ്റ്റോഗ്രാഫിക് ഓഡിറ്റ് വോൾട്ട്",
    complianceCompiler: "ടെൻഡർ നിയമ കംപൈലർ",
    newVendorReg: "പുതിയ വെണ്ടർ രജിസ്ട്രേഷൻ",
    vendorHelpdesk: "വെണ്ടർ ഹെൽപ്പ്‌ഡെസ്ക്",
    architectureTitle: "പ്ലാറ്റ്‌ഫോം സുരക്ഷാ ഘടന",
    architectureSubtitle: "സുതാര്യവും തെളിവ് അടിസ്ഥാനമാക്കിയുള്ളതുമായ സർക്കാർ സംഭരണ പരിശോധന.",
    pillar1Title: "കൃത്യമായ നിയമ വേർതിരിച്ചെടുക്കൽ",
    pillar1Desc: "ടെൻഡർ രേഖകളിൽ നിന്നുള്ള ഓട്ടോമേറ്റഡ് നിയമ നിർമ്മാണം.",
    pillar2Title: "തെളിവ് സ്പ്ലിറ്റ്-വ്യൂവർ",
    pillar2Desc: "യഥാർത്ഥ രേഖകളുമായി നേരിട്ടുള്ള താരതമ്യ പരിശോധന ദൃശ്യം.",
    pillar3Title: "SHA-256 ഹാഷ് ചെയിൻ",
    pillar3Desc: "മാറ്റമില്ലാത്ത വിശ്വസനീയമായ ഓഡിറ്റ് രേഖ.",
    footerAbout: "ചെന്നൈ പെട്രോളിയം കോർപ്പറേഷൻ ലിമിറ്റഡ് (CPCL) കേന്ദ്ര പെട്രോളിയം മന്ത്രാലയത്തിന് കീഴിലുള്ള പ്രമുഖ സംരംഭമാണ്.",
    footerQuickNav: "ദ്രുത നാവിഗേഷൻ",
    footerGovtPortals: "സർക്കാർ പോർട്ടലുകൾ",
    footerCopyright: "© 2026 ചെന്നൈ പെട്രോളിയം കോർപ്പറേഷൻ ലിമിറ്റഡ് (CPCL). എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.",
    footerGIGW: "ഇന്ത്യൻ ഗവൺമെന്റ് വെബ്‌സൈറ്റ് മാർഗ്ഗനിർദ്ദേശങ്ങൾ (GIGW) അനുസരിച്ച് രൂപകൽപ്പന ചെയ്തത്.",
  },
};
