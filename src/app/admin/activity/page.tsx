'use client';

import React, { useState, useEffect } from 'react';
import { History, Shield, Clock, Search, Filter } from 'lucide-react';
import { getActivityLogs } from '@/lib/data/store';
import { ActivityLog } from '@/types';

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivityLogs().then((res) => {
      setLogs(res);
      setLoading(false);
    });
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      searchTerm === '' ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-blue-600">
            Audit Trail & Accountability
          </span>
          <h1 className="text-2xl font-semibold text-[#0B192C] mt-0.5">
            Admin Activity & Change Log
          </h1>
          <p className="text-xs text-slate-500">
            Chronological record of product updates, price edits, repair status transitions, and setting changes.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <input
          type="text"
          placeholder="Filter audit log by action, user, or detail keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-slate-50"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-800">
                    {log.entity}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                    {log.user}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 leading-snug">
                    {log.details}
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
