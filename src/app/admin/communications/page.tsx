"use client";

import { useState, useEffect, useMemo } from "react";
import { useProject } from "../layout";
import { Mail, Search, Send, Users, Heart, UserPlus, CheckCircle, XCircle, UsersRound, X, Bold, Italic, List, ListOrdered, Link as LinkIcon, Heading2 } from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';

interface Contact {
  id: string;
  type: "volunteer" | "partner" | "donor";
  name: string;
  email: string;
  detail: string;
  status?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200 rounded-t-xl">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-[#2d5a3d] text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
        <Bold className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-[#2d5a3d] text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
        <Italic className="w-4 h-4" />
      </button>
      <div className="w-px h-5 bg-gray-300 mx-2 self-center" />
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-1.5 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-[#2d5a3d] text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
        <Heading2 className="w-4 h-4" />
      </button>
      <div className="w-px h-5 bg-gray-300 mx-2 self-center" />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-[#2d5a3d] text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
        <List className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-[#2d5a3d] text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
        <ListOrdered className="w-4 h-4" />
      </button>
      <div className="w-px h-5 bg-gray-300 mx-2 self-center" />
      <button type="button" onClick={() => {
        const url = window.prompt('URL');
        if (url) editor.chain().focus().setLink({ href: url }).run();
        else if (url === '') editor.chain().focus().unsetLink().run();
      }} className={`p-1.5 rounded-lg transition-colors ${editor.isActive('link') ? 'bg-[#2d5a3d] text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
        <LinkIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function CommunicationsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "volunteer" | "partner" | "donor">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [subject, setSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [activeTab, setActiveTab] = useState<"compose" | "history">("compose");
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedHistoryUser, setSelectedHistoryUser] = useState<{ email: string, name: string, emails: any[] } | null>(null);
  
  const { selectedProjectId } = useProject();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-600 underline' } }),
    ],
    content: '<p>Dear [Name],</p><p></p><p>Write your message here...</p>',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px] p-4 text-sm text-gray-700',
      },
    },
  });

  useEffect(() => {
    fetchContacts();
  }, [selectedProjectId]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const qs = selectedProjectId ? `?projectId=${selectedProjectId}` : "";
      const res = await fetch(`/api/admin/communications${qs}`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const qs = selectedProjectId ? `?projectId=${selectedProjectId}` : "";
      const res = await fetch(`/api/admin/communications/history${qs}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") fetchHistory();
  }, [activeTab]);

  const historyUsers = useMemo(() => {
    const userMap = new Map<string, { email: string, name: string, emails: any[] }>();
    
    history.forEach(item => {
      item.sentTo?.forEach((recipient: any) => {
        if (!userMap.has(recipient.email)) {
          userMap.set(recipient.email, { 
            email: recipient.email, 
            name: recipient.name || recipient.email, 
            emails: [] 
          });
        }
        userMap.get(recipient.email)!.emails.push(item);
      });
    });

    return Array.from(userMap.values());
  }, [history]);

  const flash = (text: string, type: "success" | "error" = "success") => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 5000);
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || c.type === typeFilter;
    const matchesStatus = statusFilter === "all" || (c.type === "volunteer" && c.status === statusFilter);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedIds.size === filteredContacts.length && filteredContacts.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredContacts.map(c => c.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const removeRecipient = (id: string) => {
    const next = new Set(selectedIds);
    next.delete(id);
    setSelectedIds(next);
  };

  const handleSend = async () => {
    if (selectedIds.size === 0) {
      flash("Please select at least one recipient.", "error");
      return;
    }
    const htmlMessage = editor?.getHTML();

    if (!subject.trim() || !htmlMessage || htmlMessage === '<p></p>') {
      flash("Subject and message are required.", "error");
      return;
    }

    setSending(true);
    const recipients = contacts.filter(c => selectedIds.has(c.id));

    try {
      const res = await fetch("/api/admin/communications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients, subject, message: htmlMessage }),
      });

      if (res.ok) {
        const data = await res.json();
        flash(data.message, "success");
        setSubject("");
        editor?.commands.setContent('<p>Dear [Name],</p><p></p><p>Write your message here...</p>');
        setSelectedIds(new Set());
      } else {
        const data = await res.json();
        flash(data.error || "Failed to send emails.", "error");
      }
    } catch (err) {
      console.error(err);
      flash("An error occurred while sending emails.", "error");
    } finally {
      setSending(false);
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === "volunteer") return <UserPlus className="w-4 h-4 text-blue-500" />;
    if (type === "partner") return <Users className="w-4 h-4 text-purple-500" />;
    if (type === "donor") return <Heart className="w-4 h-4 text-red-500" />;
    return <UsersRound className="w-4 h-4 text-gray-500" />;
  };

  const selectedContacts = contacts.filter(c => selectedIds.has(c.id));

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex border-b border-gray-200">
        <button onClick={() => { setActiveTab('compose'); setSelectedHistoryUser(null); }} className={`px-4 py-3 font-semibold text-sm transition-colors ${activeTab === 'compose' ? 'border-b-2 border-[#1a3d2e] text-[#1a3d2e]' : 'text-gray-500 hover:text-gray-800'}`}>Compose Email</button>
        <button onClick={() => { setActiveTab('history'); setSelectedHistoryUser(null); }} className={`px-4 py-3 font-semibold text-sm transition-colors ${activeTab === 'history' ? 'border-b-2 border-[#1a3d2e] text-[#1a3d2e]' : 'text-gray-500 hover:text-gray-800'}`}>Sent History (Inbox View)</button>
      </div>

      {feedback && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top ${feedback.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {feedback.type === "success" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {feedback.text}
        </div>
      )}

      {activeTab === 'compose' ? (
        <div className="flex flex-col lg:flex-row gap-6">
      {/* LEFT COLUMN: Contacts Selection */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-12rem)]">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <UsersRound className="w-5 h-5 text-[#2d5a3d]" /> Select Recipients
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:bg-white transition-all"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as any);
                if (e.target.value !== "volunteer") setStatusFilter("all");
              }}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:bg-white"
            >
              <option value="all">All Contacts</option>
              <option value="volunteer">Volunteers</option>
              <option value="partner">Partners</option>
              <option value="donor">Donors</option>
            </select>
            
            {(typeFilter === "all" || typeFilter === "volunteer") && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            )}
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
              <input 
                type="checkbox" 
                checked={filteredContacts.length > 0 && selectedIds.size === filteredContacts.length}
                onChange={handleSelectAll}
                className="w-4 h-4 text-[#2d5a3d] border-gray-300 rounded focus:ring-[#2d5a3d]" 
              />
              Select All Filtered ({filteredContacts.length})
            </label>
            <span className="text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full font-medium">
              {selectedIds.size} Selected
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-[#2d5a3d] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <UsersRound className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="font-medium text-gray-900">No contacts found</p>
              <p className="text-sm">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredContacts.map(c => (
                <label key={c.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.has(c.id)}
                    onChange={() => toggleSelect(c.id)}
                    className="w-4 h-4 text-[#2d5a3d] border-gray-300 rounded focus:ring-[#2d5a3d]" 
                  />
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {getTypeIcon(c.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate text-sm">{c.name}</p>
                    <p className="text-xs text-gray-500 truncate">{c.email}</p>
                    {c.detail && c.detail !== 'Donor' && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span> {c.detail}
                      </p>
                    )}
                  </div>
                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] uppercase font-semibold rounded-full tracking-wider whitespace-nowrap">
                      {c.type}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Composer */}
      <div className="flex-[1.2] bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-12rem)]">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#2d5a3d]" /> Compose Message
          </h2>
        </div>

        <div className="p-5 flex-1 flex flex-col overflow-y-auto">
          {/* Selected Recipients Tag Container */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              To: <span className="text-gray-400 font-normal">({selectedIds.size} recipient{selectedIds.size !== 1 && 's'})</span>
            </label>
            <div className="min-h-[42px] max-h-32 overflow-y-auto p-2 bg-gray-50 border border-gray-200 rounded-xl flex flex-wrap gap-2">
              {selectedContacts.length === 0 ? (
                <span className="text-sm text-gray-400 p-1 italic">Please select recipients from the list...</span>
              ) : (
                selectedContacts.map(c => (
                  <div key={c.id} className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-sm shadow-sm group">
                    <span className="truncate max-w-[150px]" title={c.email}>{c.name.split(' ')[0]}</span>
                    <button onClick={() => removeRecipient(c.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Outreach Updates & Guidelines"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] transition-all font-medium"
            />
          </div>

          <div className="flex-1 flex flex-col min-h-[300px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
            <div className="flex-1 border border-gray-200 rounded-xl bg-white flex flex-col overflow-hidden focus-within:ring-2 focus-within:ring-[#2d5a3d] transition-all">
              <MenuBar editor={editor} />
              <div className="flex-1 overflow-y-auto [&_.ProseMirror_p]:my-2 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:ml-4 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:ml-4 [&_.ProseMirror_h2]:text-lg [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mt-4 [&_.ProseMirror_h2]:mb-2">
                <EditorContent editor={editor} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              This message will be sent to each recipient individually. A standard header and footer will be added automatically.
            </p>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            onClick={handleSend}
            disabled={sending || selectedIds.size === 0 || !subject.trim() || !editor?.getText().trim()}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-[#1a3d2e] text-white font-semibold rounded-xl hover:bg-[#143324] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Send Email
              </>
            )}
          </button>
        </div>
      </div>
      </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <UsersRound className="w-5 h-5 text-[#2d5a3d]" /> Recipients Directory
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {loadingHistory ? (
                <div className="flex justify-center items-center h-40">
                  <div className="w-8 h-8 border-4 border-[#2d5a3d] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : historyUsers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Mail className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="font-medium text-gray-900">No history found</p>
                  <p className="text-sm">You haven't sent any emails yet.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {historyUsers.map(user => (
                    <button 
                      key={user.email} 
                      onClick={() => setSelectedHistoryUser(user)}
                      className={`w-full text-left p-4 hover:bg-gray-50 rounded-xl transition-colors border ${selectedHistoryUser?.email === user.email ? 'border-[#2d5a3d] bg-green-50/50' : 'border-transparent'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-gray-900 truncate pr-4">{user.name}</p>
                        <span className="text-xs text-gray-500 whitespace-nowrap bg-gray-100 px-2 py-0.5 rounded-full font-semibold">
                          {user.emails.length}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> {user.email}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-[1.2] bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            {selectedHistoryUser ? (
              <>
                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-bold text-lg text-gray-900">{selectedHistoryUser.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> {selectedHistoryUser.email}
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto bg-gray-50 p-6 space-y-6">
                  {selectedHistoryUser.emails.map((email: any, index: number) => (
                    <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h4 className="font-bold text-gray-900 text-base">{email.subject}</h4>
                        <span className="text-xs text-gray-500 font-medium">
                          {new Date(email.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="p-5">
                        <div 
                          className="prose max-w-none text-sm text-gray-700"
                          dangerouslySetInnerHTML={{ __html: email.message }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center">
                <Mail className="w-16 h-16 text-gray-200 mb-4" />
                <p className="font-medium text-gray-600">Select a recipient</p>
                <p className="text-sm mt-1">Click on any contact in the directory to view the entire history of emails sent to them.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
