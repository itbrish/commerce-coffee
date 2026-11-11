import React from 'react';
import Link from 'next/link';
import { Wrench, PhoneCall, MapPin, CheckCircle2, Clock, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';
import { WhatsAppIcon } from '../../components/WhatsAppIcon';

export const metadata = {
  title: 'Konsultasi Teknis Mesin Kopi & Spare Parts | Brewparts',
  description: 'Layanan konsultasi resmi PT SATU SAUDARA SEDARAH untuk pemilihan mesin espresso komersial, pengadaan suku cadang OEM, dan perawatan teknis workshop.',
};

export default function ConsultationPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';

  const defaultWaUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Halo Tim Teknis Brewparts, saya ingin berkonsultasi mengenai mesin kopi / suku cadang presisi.'
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12 sm:space-y-16">
      {/* 1. Header Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#FAF6F0] border border-[#DDD7CD] px-3.5 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#8C827A] font-semibold">
            Official Technical Concierge
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 font-normal leading-tight">
          Konsultasi Mesin Kopi & Suku Cadang Presisi
        </h1>
        <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
          Tim teknisi ahli <strong className="font-semibold text-stone-900">Brewparts (PT SATU SAUDARA SEDARAH)</strong> siap membantu Anda memilih mesin espresso komersial yang tepat, identifikasi suku cadang OEM yang kompatibel, hingga panduan perawatan rutin.
        </p>
      </div>

      {/* 2. Quick Action Consultation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Card 1: WhatsApp VIP Chat */}
        <div className="bg-[#FAF7F2] border border-[#EAE6DF] hover:border-[#B58A63]/70 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 rounded-xl shadow-sm">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
              <WhatsAppIcon className="w-7 h-7" color="#25D366" />
            </div>
            <h3 className="font-serif text-xl text-stone-900">WhatsApp VIP Concierge</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Diskusi langsung via chat WhatsApp dengan spesialis mesin kopi kami untuk respon cepat, rekomendasi katalog, dan foto fisik part.
            </p>
          </div>
          <div className="pt-6">
            <a
              href={defaultWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 w-full bg-[#25D366] hover:bg-emerald-600 text-white py-3 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" color="#ffffff" />
              <span>Chat WhatsApp Sekarang</span>
            </a>
          </div>
        </div>

        {/* Card 2: Technical Spare Part Sourcing */}
        <div className="bg-[#FAF7F2] border border-[#EAE6DF] hover:border-[#B58A63]/70 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 rounded-xl shadow-sm">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#B58A63]/10 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-[#B58A63]" />
            </div>
            <h3 className="font-serif text-xl text-stone-900">Identifikasi Suku Cadang</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Kirimkan foto gasket, valve, pompa, atau komponen mesin Anda yang bermasalah. Teknisi kami akan membantu mencocokkan kode part & spesifikasinya.
            </p>
          </div>
          <div className="pt-6">
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                'Halo Brewparts, saya mau tanya kecocokan suku cadang/part mesin kopi saya (kirim foto/tipe mesin).'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 w-full bg-stone-900 hover:bg-[#B58A63] text-white py-3 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <span>Konsultasi Part Mesin</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Card 3: Workshop Inspection & Service */}
        <div className="bg-[#FAF7F2] border border-[#EAE6DF] hover:border-[#B58A63]/70 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 rounded-xl shadow-sm">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-stone-900/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-stone-900" />
            </div>
            <h3 className="font-serif text-xl text-stone-900">Kunjungan Workshop</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Bawa mesin kopi Anda ke Brewparts Technical Hub di Kelapa Dua Tangerang untuk general maintenance, descaling, dan kalibrasi tekanan bar.
            </p>
          </div>
          <div className="pt-6">
            <a
              href="https://maps.google.com/?q=Jl.+Mawaddah+XI+No.14,+Kelapa+Dua,+Tangerang"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 w-full bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 py-3 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <MapPin className="w-4 h-4 text-stone-700" />
              <span>Buka Google Maps</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. Official Locations & Hours */}
      <div className="bg-white border border-[#EAE6DF] rounded-2xl p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm">
        {/* Head Office */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-[#B58A63]">
            <MapPin className="w-5 h-5 shrink-0" />
            <h4 className="font-serif text-lg font-semibold text-stone-900">Kantor Pusat (Head Office)</h4>
          </div>
          <p className="text-xs font-medium text-stone-800 uppercase tracking-wider">
            PT SATU SAUDARA SEDARAH
          </p>
          <p className="text-xs text-stone-600 leading-relaxed font-light">
            Gedung Menara 165 Lantai 4<br />
            Jalan TB Simatupang Kav. 1, Cilandak Timur, Kec. Pasar Minggu<br />
            Kota Administrasi Jakarta Selatan, DKI Jakarta
          </p>
          <div className="pt-1 flex items-center space-x-2 text-[11px] text-stone-500 font-mono">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>Senin - Jumat: 09:00 - 17:00 WIB</span>
          </div>
        </div>

        {/* Workshop */}
        <div className="space-y-3 border-t md:border-t-0 md:border-l border-stone-200 pt-6 md:pt-0 md:pl-8">
          <div className="flex items-center space-x-2 text-[#B58A63]">
            <Wrench className="w-5 h-5 shrink-0" />
            <h4 className="font-serif text-lg font-semibold text-stone-900">Technical Hub & Workshop</h4>
          </div>
          <p className="text-xs font-medium text-stone-800 uppercase tracking-wider">
            Brewparts Technical Workshop
          </p>
          <p className="text-xs text-stone-600 leading-relaxed font-light">
            Jl. Mawaddah XI No.14, Kelurahan Kelapa Dua<br />
            Kecamatan Kelapa Dua, Kabupaten Tangerang<br />
            Banten 15810
          </p>
          <div className="pt-1 flex items-center space-x-2 text-[11px] text-stone-500 font-mono">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>Senin - Sabtu: 08:30 - 18:00 WIB</span>
          </div>
        </div>
      </div>

      {/* 4. Machinery & Parts Expertise List */}
      <div className="bg-[#FAF7F2] border border-[#DDD7CD] rounded-2xl p-6 sm:p-10 space-y-6">
        <h3 className="font-serif text-xl sm:text-2xl text-stone-900 text-center">
          Spesialisasi Brand & Penanganan Teknis
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          {[
            { name: 'La Marzocco', type: 'Dual Boiler Specialist' },
            { name: 'Victoria Arduino', type: 'NEO & Gravitech' },
            { name: 'Nuova Simonelli', type: 'Appia & Aurelia SIS' },
            { name: 'Rocket Espresso', type: 'E61 & Heat Exchanger' },
            { name: 'ECM Germany', type: 'Rotary & PID System' },
            { name: 'Rancilio', type: 'Commercial & Home Pro' },
          ].map((item) => (
            <div key={item.name} className="bg-white border border-stone-200/80 p-3 rounded-lg shadow-2xs">
              <span className="block text-xs font-semibold text-stone-900">{item.name}</span>
              <span className="block text-[10px] text-stone-500 font-light mt-0.5">{item.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
