"use client";
import { useState, useEffect } from "react";
import { Shield, Users, Key, Plus, Trash2, X, CheckCircle, XCircle, Eye, EyeOff, Save, UserPlus, Lock, ToggleLeft, ToggleRight } from "lucide-react";

interface AdminUser { _id: string; email: string; name: string; role: string; subRole?: string; disabled: boolean; permissions: string[]; createdAt: string; }

const SUB_ROLES = [
  { id: "data-entry", name: "Data Entry" },
  { id: "nurse", name: "Nurse" },
  { id: "doctor", name: "Doctor" },
  { id: "pharmacy", name: "Pharmacy" },
  { id: "other", name: "Other" },
];
interface Role { _id: string; name: string; permissions: string[]; }

export default function SettingsPage() {
  const [tab, setTab] = useState<"admins"|"roles"|"password">("admins");
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [pages, setPages] = useState<{id:string, label:string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{text:string;type:"success"|"error"}|null>(null);

  // Admin form
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({name:"",email:"",password:"",role:"admin",subRole:"",permissions:[] as string[]});
  const [editingAdmin, setEditingAdmin] = useState<string|null>(null);
  const [editPerms, setEditPerms] = useState<string[]>([]);
  const [editRole, setEditRole] = useState("");
  const [editSubRole, setEditSubRole] = useState("");

  // Role form
  const [showAddRole, setShowAddRole] = useState(false);
  const [newRole, setNewRole] = useState({name:"",permissions:[] as string[]});

  // Password form
  const [pwForm, setPwForm] = useState({adminId:"",newPassword:"",confirmPassword:""});
  const [showPw, setShowPw] = useState(false);

  const flash = (text:string, type:"success"|"error"="success") => { setMsg({text,type}); setTimeout(()=>setMsg(null),3000); };

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [aRes, rRes] = await Promise.all([fetch("/api/admin/users"), fetch("/api/admin/roles")]);
      if (aRes.ok) { const d = await aRes.json(); setAdmins(d.admins||[]); }
      if (rRes.ok) { const d = await rRes.json(); setRoles(d.roles||[]); setPages(d.pages||[]); }
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const createAdmin = async () => {
    if (!newAdmin.name||!newAdmin.email||!newAdmin.password) { flash("Fill all fields","error"); return; }
    const res = await fetch("/api/admin/users",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(newAdmin)});
    if (res.ok) { flash("Admin created"); setShowAddAdmin(false); setNewAdmin({name:"",email:"",password:"",role:"admin",subRole:"",permissions:[]}); fetchAll(); }
    else { const d=await res.json(); flash(d.error||"Failed","error"); }
  };

  const toggleDisable = async (admin:AdminUser) => {
    const res = await fetch("/api/admin/users",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:admin._id,disabled:!admin.disabled})});
    if (res.ok) { flash(admin.disabled?"Admin enabled":"Admin disabled"); fetchAll(); }
    else flash("Failed","error");
  };

  const deleteAdminUser = async (id:string) => {
    if (!confirm("Delete this admin permanently?")) return;
    const res = await fetch("/api/admin/users",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});
    if (res.ok) { flash("Admin deleted"); fetchAll(); } else flash("Failed","error");
  };

  const saveAdminPerms = async (id:string) => {
    const res = await fetch("/api/admin/users",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,permissions:editPerms,role:editRole,subRole:editSubRole||undefined})});
    if (res.ok) { flash("Permissions saved"); setEditingAdmin(null); fetchAll(); } else flash("Failed","error");
  };

  const changePassword = async () => {
    if (!pwForm.adminId) { flash("Select an admin","error"); return; }
    if (!pwForm.newPassword||pwForm.newPassword.length<6) { flash("Password must be at least 6 characters","error"); return; }
    if (pwForm.newPassword!==pwForm.confirmPassword) { flash("Passwords don't match","error"); return; }
    const res = await fetch("/api/admin/users",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:pwForm.adminId,password:pwForm.newPassword})});
    if (res.ok) { flash("Password changed"); setPwForm({adminId:"",newPassword:"",confirmPassword:""}); } else flash("Failed","error");
  };

  const createRole = async () => {
    if (!newRole.name) { flash("Role name is required","error"); return; }
    const res = await fetch("/api/admin/roles",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(newRole)});
    if (res.ok) { flash("Role created"); setShowAddRole(false); setNewRole({name:"",permissions:[]}); fetchAll(); }
    else { const d=await res.json(); flash(d.error||"Failed","error"); }
  };

  const updateRolePerms = async (role:Role, perms:string[]) => {
    const res = await fetch("/api/admin/roles",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:role._id,permissions:perms})});
    if (res.ok) { flash("Role updated"); fetchAll(); } else flash("Failed","error");
  };

  const deleteRoleItem = async (id:string) => {
    if (!confirm("Delete this role?")) return;
    const res = await fetch("/api/admin/roles",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});
    if (res.ok) { flash("Role deleted"); fetchAll(); } else flash("Failed","error");
  };

  const togglePerm = (perms:string[], id:string) => perms.includes(id)?perms.filter(p=>p!==id):[...perms,id];

  const tabs = [{id:"admins" as const,label:"Admin Users",icon:Users},{id:"roles" as const,label:"Roles & Access",icon:Shield},{id:"password" as const,label:"Change Password",icon:Key}];

  if (loading) return <div className="p-8 flex justify-center"><div className="w-10 h-10 border-4 border-[#2d5a3d] border-t-transparent rounded-full animate-spin"/></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {msg && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top ${msg.type==="success"?"bg-green-50 text-green-700 border border-green-200":"bg-red-50 text-red-700 border border-red-200"}`}>
          {msg.type==="success"?<CheckCircle className="w-4 h-4"/>:<XCircle className="w-4 h-4"/>}{msg.text}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage admins, roles, and access control</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-px">
        {tabs.map(t=>{const I=t.icon;return(
          <button key={t.id} onClick={()=>setTab(t.id)} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all ${tab===t.id?"bg-white border border-gray-200 border-b-white text-[#1a3d2e] -mb-px":"text-gray-500 hover:text-gray-700"}`}>
            <I className="w-4 h-4"/>{t.label}
          </button>
        );})}
      </div>

      {/* ─── Admin Users Tab ─── */}
      {tab==="admins" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">{admins.length} admin user{admins.length!==1?"s":""}</p>
            <button onClick={()=>setShowAddAdmin(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1a3d2e] text-white text-sm font-medium rounded-xl hover:bg-[#143324] transition-colors">
              <UserPlus className="w-4 h-4"/>Add Admin
            </button>
          </div>

          {/* Admin list */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
            {admins.map(admin=>(
              <div key={admin._id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${admin.disabled?"bg-gray-400":"bg-[#1a3d2e]"}`}>
                      {admin.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{admin.name}</p>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700">{admin.role}</span>
                        {admin.disabled && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-red-50 text-red-600">Disabled</span>}
                      </div>
                      <p className="text-sm text-gray-500">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>{if(editingAdmin===admin._id){setEditingAdmin(null)}else{setEditingAdmin(admin._id);setEditPerms(admin.permissions||[]);setEditRole(admin.role);setEditSubRole(admin.subRole||"");}}} className="p-2 text-gray-400 hover:text-[#1a3d2e] hover:bg-gray-50 rounded-lg transition-colors" title="Edit permissions">
                      <Shield className="w-4 h-4"/>
                    </button>
                    <button onClick={()=>toggleDisable(admin)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title={admin.disabled?"Enable":"Disable"}>
                      {admin.disabled?<ToggleLeft className="w-4 h-4"/>:<ToggleRight className="w-4 h-4"/>}
                    </button>
                    {admin.role!=="super_admin"&&(
                      <button onClick={()=>deleteAdminUser(admin._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    )}
                  </div>
                </div>
                {/* Inline permissions editor */}
                {editingAdmin===admin._id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</label>
                      <select value={editRole} onChange={e=>setEditRole(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]">
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        {roles.map(r=><option key={r._id} value={r.name}>{r.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sub Role</label>
                      <select value={editSubRole} onChange={e=>setEditSubRole(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]">
                        <option value="">None</option>
                        {SUB_ROLES.map(sr=><option key={sr.id} value={sr.id}>{sr.name}</option>)}
                      </select>
                      {editSubRole && <p className="text-xs text-gray-400 mt-1">Limits patient record page access</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Page Access</label>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {pages.map(p=>(
                          <label key={p.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors">
                            <input type="checkbox" checked={editPerms.includes(p.id)} onChange={()=>setEditPerms(togglePerm(editPerms,p.id))} className="w-4 h-4 text-[#2d5a3d] rounded focus:ring-[#2d5a3d]"/>
                            <span className="text-sm text-gray-700">{p.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <button onClick={()=>saveAdminPerms(admin._id)} className="flex items-center gap-2 px-4 py-2 bg-[#1a3d2e] text-white text-sm font-medium rounded-lg hover:bg-[#143324] transition-colors">
                      <Save className="w-4 h-4"/>Save Changes
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Admin Modal */}
          {showAddAdmin && (
            <>
              <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={()=>setShowAddAdmin(false)}/>
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Add New Admin</h3>
                    <button onClick={()=>setShowAddAdmin(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500"/></button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                      <input value={newAdmin.name} onChange={e=>setNewAdmin({...newAdmin,name:e.target.value})} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]" placeholder="John Doe"/>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                      <input type="email" value={newAdmin.email} onChange={e=>setNewAdmin({...newAdmin,email:e.target.value})} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]" placeholder="admin@example.org"/>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Password</label>
                      <input type="password" value={newAdmin.password} onChange={e=>setNewAdmin({...newAdmin,password:e.target.value})} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]" placeholder="Min 6 characters"/>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Role</label>
                      <select value={newAdmin.role} onChange={e=>setNewAdmin({...newAdmin,role:e.target.value})} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]">
                        <option value="admin">Admin</option>
                        {roles.map(r=><option key={r._id} value={r.name}>{r.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Sub Role</label>
                      <select value={newAdmin.subRole} onChange={e=>setNewAdmin({...newAdmin,subRole:e.target.value})} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]">
                        <option value="">None</option>
                        {SUB_ROLES.map(sr=><option key={sr.id} value={sr.id}>{sr.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Page Access</label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {pages.map(p=>(
                          <label key={p.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                            <input type="checkbox" checked={newAdmin.permissions.includes(p.id)} onChange={()=>setNewAdmin({...newAdmin,permissions:togglePerm(newAdmin.permissions,p.id)})} className="w-4 h-4 text-[#2d5a3d] rounded focus:ring-[#2d5a3d]"/>
                            <span className="text-sm text-gray-700">{p.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={createAdmin} className="w-full py-2.5 bg-[#1a3d2e] text-white font-medium rounded-xl hover:bg-[#143324] transition-colors flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4"/>Create Admin
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ─── Roles & Access Tab ─── */}
      {tab==="roles" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">{roles.length} custom role{roles.length!==1?"s":""}</p>
              <p className="text-xs text-gray-400 mt-0.5">Super Admin always has full access</p>
            </div>
            <button onClick={()=>setShowAddRole(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1a3d2e] text-white text-sm font-medium rounded-xl hover:bg-[#143324] transition-colors">
              <Plus className="w-4 h-4"/>Add Role
            </button>
          </div>

          {/* Built-in roles */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-[#2d5a3d]"/>
              <h3 className="font-semibold text-gray-900">Super Admin</h3>
              <span className="text-xs text-gray-400">(built-in)</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {pages.map(p=>(
                <span key={p.id} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium text-center">{p.label}</span>
              ))}
            </div>
          </div>

          {/* Custom roles */}
          {roles.map(role=>(
            <div key={role._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#2d5a3d]"/>
                  <h3 className="font-semibold text-gray-900">{role.name}</h3>
                </div>
                <button onClick={()=>deleteRoleItem(role._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {pages.map(p=>{
                  const has = role.permissions.includes(p.id);
                  return(
                    <button key={p.id} onClick={()=>updateRolePerms(role,togglePerm(role.permissions,p.id))} className={`px-3 py-1.5 rounded-lg text-xs font-medium text-center transition-all ${has?"bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-600":"bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-700"}`}>
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Add Role Modal */}
          {showAddRole && (
            <>
              <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={()=>setShowAddRole(false)}/>
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Create New Role</h3>
                    <button onClick={()=>setShowAddRole(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500"/></button>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Role Name</label>
                    <input value={newRole.name} onChange={e=>setNewRole({...newRole,name:e.target.value})} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]" placeholder="e.g. Editor, Viewer"/>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Page Access</label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {pages.map(p=>(
                        <label key={p.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                          <input type="checkbox" checked={newRole.permissions.includes(p.id)} onChange={()=>setNewRole({...newRole,permissions:togglePerm(newRole.permissions,p.id)})} className="w-4 h-4 text-[#2d5a3d] rounded focus:ring-[#2d5a3d]"/>
                          <span className="text-sm text-gray-700">{p.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button onClick={createRole} className="w-full py-2.5 bg-[#1a3d2e] text-white font-medium rounded-xl hover:bg-[#143324] transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4"/>Create Role
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ─── Change Password Tab ─── */}
      {tab==="password" && (
        <div className="max-w-md">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#e8f0e8] rounded-xl flex items-center justify-center"><Key className="w-5 h-5 text-[#2d5a3d]"/></div>
              <div>
                <h3 className="font-bold text-gray-900">Change Password</h3>
                <p className="text-xs text-gray-500">Select an admin and set a new password</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Select Admin</label>
              <select value={pwForm.adminId} onChange={e=>setPwForm({...pwForm,adminId:e.target.value})} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]">
                <option value="">Choose admin...</option>
                {admins.map(a=><option key={a._id} value={a._id}>{a.name} ({a.email})</option>)}
              </select>
            </div>
            <div className="relative">
              <label className="text-xs font-semibold text-gray-500 uppercase">New Password</label>
              <input type={showPw?"text":"password"} value={pwForm.newPassword} onChange={e=>setPwForm({...pwForm,newPassword:e.target.value})} className="mt-1 w-full px-3 py-2 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]" placeholder="Min 6 characters"/>
              <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-8 text-gray-400">{showPw?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Confirm Password</label>
              <input type="password" value={pwForm.confirmPassword} onChange={e=>setPwForm({...pwForm,confirmPassword:e.target.value})} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]" placeholder="Re-enter password"/>
            </div>
            <button onClick={changePassword} className="w-full py-2.5 bg-[#1a3d2e] text-white font-medium rounded-xl hover:bg-[#143324] transition-colors flex items-center justify-center gap-2">
              <Save className="w-4 h-4"/>Update Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
