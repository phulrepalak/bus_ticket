import React from "react";
import { useNavigate } from "react-router-dom";

export default function TermsConditions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-left text-slate-800">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate("/")} 
          className="mb-6 text-sm font-semibold text-sky-600 hover:underline flex items-center gap-1"
        >
          ← Back to Home
        </button>
        
        <h1 className="text-3xl font-black text-slate-950 mb-2">Terms & Conditions</h1>
        <p className="text-slate-500 mb-8">Last updated: May 2026</p>

        {/* Terms Content Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 text-sm leading-relaxed text-slate-600">
          <section>
            <h2 className="text-md font-black text-slate-900 uppercase tracking-tight mb-2">1. Agreement to Terms</h2>
            <p>
              By using the GoBus Application, you agree to comply with all system operational parameters. This platform functions as a direct seat management framework connecting commuters and state routing modules.
            </p>
          </section>

          <section>
            <h2 className="text-md font-black text-slate-900 uppercase tracking-tight mb-2">2. Guest vs Registered User State</h2>
            <p>
              Guest session records are captured using dynamic temporary storage matrices. To preserve transaction logs across multiple hardware setups, converting to a secure verified user profile via OTP authentication is highly recommended.
            </p>
          </section>

          <section>
            <h2 className="text-md font-black text-slate-900 uppercase tracking-tight mb-2">3. Cancellation & Refund Rules</h2>
            <p>
              Tickets listed under the 'Upcoming' category are eligible for system-processed cancellations depending on the target operator guidelines. Refund state computations are updated systematically upon approval flags.
            </p>
          </section>

          <section>
            <h2 className="text-md font-black text-slate-900 uppercase tracking-tight mb-2">4. Identity Verification</h2>
            <p>
              During the boarding procedure, commuters must present a valid physical ID documentation along with the generated digital verification confirmation PNR receipt.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}