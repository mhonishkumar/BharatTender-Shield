"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { SIHDemoBar } from "@/components/SIHDemoBar";
import {
  DocumentTextIcon as FileText,
  ArrowUpTrayIcon as Upload,
  CheckCircleIcon as CheckCircle2,
  ArrowRightIcon as ArrowRight,
  ArrowLeftIcon as ArrowLeft,
  BuildingOffice2Icon as Building,
  ShieldCheckIcon as ShieldCheck,
  CheckIcon as Check,
  PaperClipIcon as Paperclip,
} from "@heroicons/react/24/outline";

function BidderApplyPageContent() {
  const { user, role } = useAuth();
  const router = useRouter();

  const [tenders, setTenders] = useState<any[]>([]);
  const [selectedTenderId, setSelectedTenderId] = useState<number>(1);
  const [step, setStep] = useState<number>(1);

  // Step 1: Company Info
  const [companyName, setCompanyName] = useState(user?.organization || "Apex Engineering Solutions Ltd");
  const [regNumber, setRegNumber] = useState("U29300TN2021PTC142850");
  const [gstin, setGstin] = useState("33ABCDE1234F1Z5");
  const [pan, setPan] = useState("ABCDE1234F");
  const [udyam, setUdyam] = useState("UDYAM-TN-02-0012345");
  const [turnover, setTurnover] = useState(85.0);

  // Step 2: Upload Files
  const [gstFile, setGstFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [udyamFile, setUdyamFile] = useState<File | null>(null);
  const [turnoverFile, setTurnoverFile] = useState<File | null>(null);

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<any | null>(null);

  useEffect(() => {
    api.getTenders().then((data) => {
      setTenders(data);
      if (data.length > 0) setSelectedTenderId(data[0].id);
    });
  }, []);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const app = await api.submitApplication({
        tender_id: selectedTenderId,
        submitted_company_name: companyName,
        submitted_reg_number: regNumber,
        submitted_gstin: gstin,
        submitted_pan: pan,
        submitted_udyam: udyam,
        submitted_turnover: turnover,
      });

      // Upload selected files if any
      if (gstFile) await api.uploadDocument(app.id, "GST_CERTIFICATE", gstFile);
      if (panFile) await api.uploadDocument(app.id, "PAN_CARD", panFile);
      if (udyamFile) await api.uploadDocument(app.id, "UDYAM_CERTIFICATE", udyamFile);
      if (turnoverFile) await api.uploadDocument(app.id, "TURNOVER_CERTIFICATE", turnoverFile);

      setSubmittedApp(app);
      setStep(4);
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <SIHDemoBar />
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0F294A]">
              Tender Application Wizard
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit your statutory credentials and verification documents for public procurement tender.
            </p>
          </div>

          {/* Stepper Header */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between text-xs font-semibold">
            <div className={`flex items-center space-x-2 ${step >= 1 ? "text-[#0F294A]" : "text-slate-400"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? "bg-[#0F294A] text-white" : "bg-slate-200"}`}>1</div>
              <span>Company Info</span>
            </div>
            <div className="h-0.5 w-12 bg-slate-200" />
            <div className={`flex items-center space-x-2 ${step >= 2 ? "text-[#0F294A]" : "text-slate-400"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? "bg-[#0F294A] text-white" : "bg-slate-200"}`}>2</div>
              <span>Upload Documents</span>
            </div>
            <div className="h-0.5 w-12 bg-slate-200" />
            <div className={`flex items-center space-x-2 ${step >= 3 ? "text-[#0F294A]" : "text-slate-400"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? "bg-[#0F294A] text-white" : "bg-slate-200"}`}>3</div>
              <span>Review</span>
            </div>
            <div className="h-0.5 w-12 bg-slate-200" />
            <div className={`flex items-center space-x-2 ${step >= 4 ? "text-emerald-700" : "text-slate-400"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 4 ? "bg-emerald-600 text-white" : "bg-slate-200"}`}>4</div>
              <span>Submit</span>
            </div>
          </div>

          {/* STEP 1: Company Information */}
          {step === 1 && (
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-[#0F294A]">
                Step 1: Select Tender & Enter Company Details
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Target Procurement Tender:</label>
                  <select
                    value={selectedTenderId}
                    onChange={(e) => setSelectedTenderId(Number(e.target.value))}
                    className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  >
                    {tenders.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.tender_ref} — {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Company Legal Name:</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Company Registration (CIN/LLPIN):</label>
                    <input
                      type="text"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">GSTIN (15 Chars):</label>
                    <input
                      type="text"
                      required
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      className="w-full text-xs font-mono uppercase border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">PAN (10 Chars):</label>
                    <input
                      type="text"
                      required
                      value={pan}
                      onChange={(e) => setPan(e.target.value.toUpperCase())}
                      className="w-full text-xs font-mono uppercase border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Udyam Registration Number:</label>
                    <input
                      type="text"
                      value={udyam}
                      onChange={(e) => setUdyam(e.target.value.toUpperCase())}
                      placeholder="UDYAM-XX-00-0000000"
                      className="w-full text-xs font-mono uppercase border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Average Annual Turnover (₹ in Lakhs):</label>
                  <input
                    type="number"
                    value={turnover}
                    onChange={(e) => setTurnover(parseFloat(e.target.value))}
                    className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-1 focus:ring-[#0F294A]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-[#0F294A] hover:bg-blue-900 text-white rounded text-xs font-medium flex items-center space-x-1.5"
                >
                  <span>Proceed to Upload Documents</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Upload Documents */}
          {step === 2 && (
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-[#0F294A]">
                Step 2: Upload Required Compliance Documents
              </h3>
              <p className="text-xs text-slate-500">
                Allowed formats: PDF, PNG, JPG. PyMuPDF and AI extractors will parse these documents against tender clauses.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* GST Card */}
                <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-[#0F294A] transition-colors space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>GST Registration Certificate</span>
                    <span className="text-red-600">* Mandatory</span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setGstFile(e.target.files?.[0] || null)}
                    className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-[#0F294A] file:text-white hover:file:bg-blue-900"
                  />
                  {gstFile && <p className="text-[11px] text-emerald-700 font-medium">✓ Selected: {gstFile.name}</p>}
                </div>

                {/* PAN Card */}
                <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-[#0F294A] transition-colors space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>Permanent Account Number (PAN)</span>
                    <span className="text-red-600">* Mandatory</span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setPanFile(e.target.files?.[0] || null)}
                    className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-[#0F294A] file:text-white hover:file:bg-blue-900"
                  />
                  {panFile && <p className="text-[11px] text-emerald-700 font-medium">✓ Selected: {panFile.name}</p>}
                </div>

                {/* Udyam Card */}
                <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-[#0F294A] transition-colors space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>Udyam MSME Registration</span>
                    <span className="text-slate-500">For MSME benefits</span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setUdyamFile(e.target.files?.[0] || null)}
                    className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-[#0F294A] file:text-white hover:file:bg-blue-900"
                  />
                  {udyamFile && <p className="text-[11px] text-emerald-700 font-medium">✓ Selected: {udyamFile.name}</p>}
                </div>

                {/* Turnover Statement */}
                <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-[#0F294A] transition-colors space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>CA Certified Turnover Certificate</span>
                    <span className="text-red-600">* Mandatory</span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setTurnoverFile(e.target.files?.[0] || null)}
                    className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-[#0F294A] file:text-white hover:file:bg-blue-900"
                  />
                  {turnoverFile && <p className="text-[11px] text-emerald-700 font-medium">✓ Selected: {turnoverFile.name}</p>}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 flex items-center space-x-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 bg-[#0F294A] hover:bg-blue-900 text-white rounded text-xs font-medium flex items-center space-x-1.5"
                >
                  <span>Review Application</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review */}
          {step === 3 && (
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-[#0F294A]">
                Step 3: Review Application Information Before Final Submission
              </h3>

              <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 font-medium">Enterprise Name:</span>
                    <p className="font-semibold text-slate-900">{companyName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Registration CIN:</span>
                    <p className="font-semibold text-slate-900">{regNumber || "N/A"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-slate-500 font-medium">GSTIN:</span>
                    <p className="font-mono font-bold text-[#0F294A]">{gstin}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">PAN:</span>
                    <p className="font-mono font-bold text-slate-800">{pan}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Udyam Number:</span>
                    <p className="font-mono font-bold text-slate-800">{udyam || "N/A"}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-medium">Declared Annual Turnover:</span>
                  <p className="font-semibold text-slate-900">₹{turnover} Lakhs</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 flex items-center space-x-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? "Submitting Application..." : "Submit Application"}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Submit Success */}
          {step === 4 && submittedApp && (
            <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-xs text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h2 className="text-xl font-bold text-[#0F294A]">
                Application Submitted Successfully!
              </h2>

              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Your tender bid submission has been registered in BharatTender Shield. An immutable SHA-256 hash log entry was recorded in the audit trail.
              </p>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded max-w-sm mx-auto text-xs">
                <span className="text-slate-400 font-medium block">Assigned Application ID:</span>
                <span className="font-mono text-base font-bold text-[#0F294A] mt-0.5 block">
                  {submittedApp.application_ref}
                </span>
              </div>

              <div className="pt-2 flex justify-center space-x-3">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-[#0F294A] hover:bg-blue-900 text-white rounded text-xs font-semibold shadow-xs"
                >
                  Return to Dashboard
                </Link>
                <Link
                  href="/bidder/verification"
                  className="px-4 py-2 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded text-xs font-medium border border-slate-200"
                >
                  Track Verification Status
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function BidderApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-sm text-slate-500">Loading...</div>}>
      <BidderApplyPageContent />
    </Suspense>
  );
}
