import { Bell, CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Loader } from '../../components/ui/Loader.jsx';
import noticeService from '../../services/noticeService.js';
import { getApiErrorMessage } from '../../services/api.js';

const StudentNoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [state, setState] = useState({ loading: true, error: '' });

  useEffect(() => {
    noticeService.getStudentNotices()
      .then((data) => setNotices(data.records || []))
      .catch((error) => setState({ loading: false, error: getApiErrorMessage(error) }))
      .finally(() => setState((current) => ({ ...current, loading: false })));
  }, []);

  if (state.loading) return <Loader text="Loading notices..." fullHeight />;
  if (state.error) return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{state.error}</div>;

  return (
    <section className="max-w-4xl space-y-5">
      <div><p className="text-sm font-medium uppercase tracking-[0.16em] text-sky-600">School updates</p><h1 className="mt-1 text-3xl font-semibold text-slate-900">Notices</h1><p className="mt-2 text-slate-600">Published announcements available to students.</p></div>
      {!notices.length ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"><Bell className="mx-auto text-slate-400" size={28} /><h2 className="mt-3 font-semibold text-slate-900">No notices yet</h2><p className="mt-1 text-sm text-slate-600">Published school announcements will appear here.</p></div>
      ) : (
        <div className="space-y-4">{notices.map((notice) => <article key={notice._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><h2 className="text-lg font-semibold text-slate-900">{notice.title}</h2><span className="inline-flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays size={14} />{new Date(notice.publishedAt || notice.createdAt).toLocaleDateString()}</span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{notice.message}</p></article>)}</div>
      )}
    </section>
  );
};

export default StudentNoticesPage;
