"use client";

import { useEffect, useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  organisation_name: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);

  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    role: "user",
  });

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/admin/users`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setUsers(Array.isArray(d) ? d : d.users || []))
      .finally(() => setLoading(false));
  }, []);

  /* ================= FILTER ================= */
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.organisation_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ================= EDIT ================= */
  const startEdit = (user: User) => {
    setEditUser(user);
    setEditForm({
      name: user.name,
      phone: user.phone || "",
      role: user.role,
    });
  };

  const submitEdit = async () => {
    if (!editUser) return;

    const res = await fetch(
      `${BACKEND_URL}/api/admin/users/${editUser.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      }
    );

    if (res.ok) {
      const data = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? data.user : u))
      );
      setEditUser(null);
    } else {
      alert("Failed to update user");
    }
  };

  return (
    <>
      {/* ================= PAGE ================= */}
      <div className="p-5">
        {/* HEADER */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {filteredUsers.length} users
          </p>

          <input
            type="text"
            placeholder="Search users..."
            className="w-72 rounded-lg border border-slate-300 px-3 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["User", "Email", "Phone", "Organisation", "Role", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-black">
                      {u.name}
                    </td>
                    <td className="px-4 py-3 text-black">{u.email}</td>
                    <td className="px-4 py-3 text-black">
                      {u.phone || "-"}
                    </td>
                    <td className="px-4 py-3 text-black">
                      {u.organisation_name}
                    </td>
                    <td className="px-4 py-3 text-black">{u.role}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setViewUser(u)}
                        className="mr-3 font-medium text-black hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => startEdit(u)}
                        className="font-semibold text-black hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= VIEW MODAL ================= */}
      {viewUser && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={(e) =>
            e.target === e.currentTarget && setViewUser(null)
          }
        >
          <div className="bg-white rounded-xl w-full max-w-md p-5 text-black">
            <h2 className="text-xl font-bold mb-4">User Details</h2>

            <div className="space-y-2 text-sm">
              <p><b>Name:</b> {viewUser.name}</p>
              <p><b>Email:</b> {viewUser.email}</p>
              <p><b>Phone:</b> {viewUser.phone || "-"}</p>
              <p><b>Organisation:</b> {viewUser.organisation_name}</p>
              <p><b>Role:</b> {viewUser.role}</p>
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setViewUser(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editUser && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={(e) =>
            e.target === e.currentTarget && setEditUser(null)
          }
        >
          <div className="bg-white rounded-xl w-full max-w-md p-5 text-black">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full name"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-black"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />

              <input
                type="tel"
                placeholder="Phone number"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-black"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
              />

              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-black"
                value={editForm.role}
                onChange={(e) =>
                  setEditForm({ ...editForm, role: e.target.value })
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setEditUser(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-black"
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                className="px-4 py-2 rounded-lg bg-black text-white font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
