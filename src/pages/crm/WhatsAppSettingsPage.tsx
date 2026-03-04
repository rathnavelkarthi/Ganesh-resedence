import React from 'react';
import WhatsAppSettings from '../../components/crm/WhatsAppSettings';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppSettingsPage() {
    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div className="border-b border-gray-200 pb-5">
                <h1 className="text-3xl font-serif font-bold text-[#0E2A38] flex items-center gap-3">
                    <MessageSquare className="text-[#C9A646]" size={32} />
                    WhatsApp Automations
                </h1>
                <p className="text-gray-500 mt-2">
                    Configure automated messages for bookings, check-ins, and reviews using the connected Evolution API.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <WhatsAppSettings />
            </div>
        </div>
    );
}
