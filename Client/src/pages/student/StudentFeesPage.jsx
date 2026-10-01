import { CircleDollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Loader } from '../../components/ui/Loader.jsx';
import feeService from '../../services/feeService.js';
import { getApiErrorMessage } from '../../services/api.js';

const statusClasses = {
  Pending: 'bg-amber-100 text-amber-800',
  Partial: 'bg-sky-100 text-sky-800',
  Paid: 'bg-emerald-100 text-emerald-800',
  Overdue: 'bg-rose-100 text-rose-800',
};

const formatAmount = (amount) => Number(amount || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

const StudentFeesPage = () => {
  const [feeData, setFeeData] = useState({ records: [], count: 0 });
  const [state, setState] = useState({ loading: true, error: '' });

  useEffect(() => {
    feeService.getMyFees()
      .then((data) => setFeeData({ records: data.records || [], count: data.count || 0 }))
      .catch((error) => setState({ loading: false, error: getApiErrorMessage(error) }))
      .finally(() => setState((current) => ({ ...current, loading: false })));
  }, []);

  if (state.loading) return <Loader text="Loading your fees..." fullHeight />;
  if (state.error) return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{state.error}</div>;

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-sky-600">Personal record</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">My fees</h1>
        <p className="mt-2 text-slate-600">View your fee records and payment status. Financial actions are read-only for students.</p>
      </div>

      {!feeData.records.length ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <CircleDollarSign className="mx-auto text-slate-400" size={28} />
          <h2 className="mt-3 font-semibold text-slate-900">No fee records yet</h2>
          <p className="mt-1 text-sm text-slate-600">Your fee information will appear here when it is added by the administration.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <caption className="sr-only">{feeData.count} fee records</caption>
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Due date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Outstanding</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {feeData.records.map((fee) => (
                <tr key={fee._id}>
                  <td className="px-4 py-3 text-slate-700">{new Date(fee.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{formatAmount(fee.amount)}</td>
                  <td className="px-4 py-3 text-slate-700">{formatAmount(fee.paidAmount)}</td>
                  <td className="px-4 py-3 text-slate-700">{formatAmount(fee.dueAmount)}</td>
                  <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[fee.status] || 'bg-slate-100 text-slate-700'}`}>{fee.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default StudentFeesPage;
