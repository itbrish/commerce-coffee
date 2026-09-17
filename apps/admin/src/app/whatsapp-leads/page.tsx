"use client";
import React, { useEffect, useState } from 'react';
import { MessageSquare, ExternalLink, Filter, Search } from 'lucide-react';
import { getApiUrl } from '../../lib/api';

export default function AdminWhatsAppLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    const apiUrl = getApiUrl();
    fetch(`${apiUrl}/whatsapp/leads`)
      .then((res) => res.json())
      .then((j) => { if (j?.data) setLeads(j.data); })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">WhatsApp Assisted Sales & Inquiries</h1>
        <p className="text-xs text-slate-400 mt-0.5">Track prospective buyer clicks, consultation requests, and cart checkout inquiries initiated via WhatsApp.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Customer Name / Contact</th>
                <th className="p-4">Inquiry Origin</th>
                <th className="p-4">Associated Product / SKU</th>
                <th className="p-4">Generated Message Content</th>
                <th className="p-4 text-right">Direct Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {(leads.length > 0 ? leads : [
                { id: '1', customerName: 'Dharmawan Cafe Bali', phone: '+6281298765432', source: 'COMMERCIAL_INQUIRY', product: { name: 'Victoria Arduino Black Eagle 2GR', sku: 'VA-BEM-006' }, message: 'Halo Atelier du Cafe, kami ingin konsultasi pengadaan mesin untuk cafe baru...', createdAt: new Date().toISOString() },
                { id: '2', customerName: 'Adrian Gunawan', phone: '+6281122334455', source: 'PRODUCT_PAGE', product: { name: 'La Marzocco Linea Mini', sku: 'LM-LM-001' }, message: 'Halo Atelier du Cafe, saya tertarik dengan produk La Marzocco Linea Mini...', createdAt: new Date().toISOString() },
              ]).map((l: any) => (
                <tr key={l.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 text-slate-400 font-mono">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="p-4">
                    <div className="font-semibold text-white">{l.customerName || 'Prospective Client'}</div>
                    <div className="text-[10px] text-slate-400">{l.phone || 'Initiated via Web Click'}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {l.source}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">
                    <div className="font-medium">{l.product?.name || 'General Equipment Consultation'}</div>
                    {l.product?.sku && <div className="text-[10px] text-slate-400 font-mono">{l.product.sku}</div>}
                  </td>
                  <td className="p-4 text-slate-400 max-w-xs truncate">{l.message}</td>
                  <td className="p-4 text-right">
                    <a
                      href={l.phone ? `https://wa.me/${l.phone.replace(/[^0-9]/g, '')}` : 'https://wa.me/6281234567890'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 rounded font-semibold text-[11px]"
                    >
                      <MessageSquare size={13} />
                      <span>Open Chat</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
