"use client";

import { motion } from "framer-motion";
import { 
  CreditCard, 
  QrCode, 
  Copy, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Heart
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function OfferingPage() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const accountDetails = [
    {
      type: "Tithe & Offering",
      bank: "YOUR BANK NAME",
      name: "Suresh Randhari",
      accNo: "XXXXXXXXXXXX",
      ifsc: "XXXXXXXXXXX",
      branch: "YOUR BRANCH NAME",
      color: "from-orange-500 to-amber-600",
      qrPlaceholder: "Tithe & Offering QR"
    },
    {
      type: "Land & Building",
      bank: "YOUR BANK NAME",
      name: "Suresh Randhari",
      accNo: "XXXXXXXXXXXX",
      ifsc: "XXXXXXXXXXX",
      branch: "YOUR BRANCH NAME",
      color: "from-blue-600 to-indigo-700",
      qrPlaceholder: "Land & Building QR"
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50/50 pt-32 pb-20">
      {/* Hero Section */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto mb-20 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-6 border border-neutral-200/50">
            <Heart className="h-3 w-3 text-red-500" />
            Support Our Ministry
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-semibold tracking-tight text-neutral-900 mb-8">
            Offering & Gifts
          </h1>
          <p className="text-xl text-neutral-500 font-light max-w-2xl mx-auto leading-relaxed">
            Your generosity helps us reach more lives with the message of hope. 
            "Each of you should give what you have decided in your heart to give."
          </p>
        </motion.div>
      </section>

      {/* Payment Options Grid */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {accountDetails.map((item, idx) => (
            <motion.div 
              key={idx}
              variants={fadeInUp}
              className="group relative bg-white rounded-[3rem] border border-neutral-100 shadow-xl shadow-neutral-200/40 p-10 lg:p-12 overflow-hidden hover:-translate-y-2 transition-transform duration-500"
            >
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${item.color} opacity-[0.03] rounded-full -mr-20 -mt-20 group-hover:opacity-[0.06] transition-opacity`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}>
                    <CreditCard className="h-8 w-8" />
                  </div>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-4 py-1.5 rounded-full bg-neutral-50 border border-neutral-100">
                    Direct Bank Transfer
                  </span>
                </div>

                <h2 className="text-3xl font-serif font-semibold text-neutral-900 mb-8">
                  {item.type}
                </h2>

                <div className="space-y-6 mb-12">
                  <DetailItem label="Bank Name" value={item.bank} />
                  <DetailItem 
                    label="Account Name" 
                    value={item.name} 
                    onCopy={() => copyToClipboard(item.name, "Account Name")}
                    isCopied={copiedField === "Account Name"}
                  />
                  <DetailItem 
                    label="Account Number" 
                    value={item.accNo} 
                    onCopy={() => copyToClipboard(item.accNo, "Account Number")}
                    isCopied={copiedField === "Account Number"}
                  />
                  <DetailItem 
                    label="IFSC Code" 
                    value={item.ifsc} 
                    onCopy={() => copyToClipboard(item.ifsc, "IFSC Code")}
                    isCopied={copiedField === "IFSC Code"}
                  />
                  <DetailItem label="Branch" value={item.branch} />
                </div>

                <div className="pt-10 border-t border-neutral-50 flex flex-col sm:flex-row items-center gap-8">
                   <div className="relative shrink-0 p-4 bg-white rounded-3xl border border-neutral-100 shadow-inner group-hover:scale-110 transition-transform duration-500">
                      <div className="h-40 w-40 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-300 font-bold text-[10px] text-center px-4 uppercase tracking-widest border border-dashed border-neutral-200">
                        <div className="flex flex-col items-center gap-3">
                          <QrCode className="h-8 w-8 mb-1" />
                          <span>Official QR Code</span>
                        </div>
                      </div>
                   </div>
                   <div className="text-center sm:text-left">
                     <p className="text-sm font-semibold text-neutral-900 mb-2">Give with UPI</p>
                     <p className="text-xs text-neutral-400 leading-relaxed font-light">
                       Scan the official QR code to make a direct transfer using any UPI app like GPay, PhonePe, or Paytm.
                     </p>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Security Footer */}
      <section className="mt-20 px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="p-8 rounded-[2rem] bg-neutral-900 text-white shadow-2xl shadow-neutral-900/20"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-widest">Secure Giving</h3>
          </div>
          <p className="text-sm text-neutral-400 font-light leading-relaxed">
            All donations are processed securely. For any queries regarding your contribution or to request a receipt, please contact our administrative office at info@calvarycogindia.com
          </p>
        </motion.div>
      </section>
    </div>
  );
}

function DetailItem({ label, value, onCopy, isCopied }: { label: string, value: string, onCopy?: () => void, isCopied?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{label}</span>
      <div className="flex items-center justify-between group/field">
        <span className="text-lg text-neutral-900 font-medium">{value}</span>
        {onCopy && (
          <button 
            onClick={onCopy}
            className="p-2 mr-2 rounded-lg bg-neutral-50 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all opacity-0 group-hover/field:opacity-100"
          >
            {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
