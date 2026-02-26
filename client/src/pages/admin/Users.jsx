import { useState } from "react";
import {
  useGetAdminUsersQuery,
  useUpdateUserStatusMutation,
} from "@/features/admin/adminApi";
import Loader from "@/components/common/Loader";

const ROLE_COLORS = { admin: "#d966ff", user: "#00f5ff" };

const Users = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetAdminUsersQuery({ search });
  const [updateStatus] = useUpdateUserStatusMutation();
  const rawUsers = data?.data?.items ?? data?.data ?? data?.users;
  const users = Array.isArray(rawUsers) ? rawUsers : [];

  const handleToggleStatus = async (user) => {
    const newStatus = user.isActive === false ? "active" : "banned";
    const label = newStatus === "banned" ? "ban" : "activate";
    if (
      !window.confirm(
        `${label.charAt(0).toUpperCase() + label.slice(1)} user "${user.name}"?`,
      )
    )
      return;
    try {
      // Nếu user đang active (isActive true hoặc undefined) → ban → isActive: false
      // Nếu user đang banned (isActive === false) → activate → isActive: true
      const currentlyActive = user.isActive !== false; // undefined treated as active
      await updateStatus({
        id: user._id,
        isActive: !currentlyActive,
      }).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Failed.");
    }
  };

  return (
    <section style={{ display: "grid", gap: "1.5rem" }}>
      <div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            fontWeight: 900,
            color: "#fff",
            marginBottom: "0.25rem",
          }}
        >
          Users
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.82rem" }}>
          {users.length} registered
        </p>
      </div>

      <div className="glass-card" style={{ padding: "0.85rem 1.1rem" }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--color-text)",
            fontSize: "0.85rem",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        {isLoading ? (
          <Loader message="Loading users..." />
        ) : users.length === 0 ? (
          <p
            style={{
              padding: "2rem",
              color: "var(--color-text-muted)",
              textAlign: "center",
            }}
          >
            No users found.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.83rem",
              }}
            >
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.2)" }}>
                  {["User", "Role", "Status", "Joined", "Actions"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "0.75rem 1rem",
                        fontFamily: "var(--font-display)",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.09em",
                        color: "var(--color-text-muted)",
                        borderBottom: "1px solid rgba(0,245,255,0.1)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isBanned =
                    u.isActive === false || u.status === "banned";
                  return (
                    <tr
                      key={u._id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(0,245,255,0.02)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.65rem",
                          }}
                        >
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              background: "rgba(0,245,255,0.1)",
                              border: "1px solid rgba(0,245,255,0.25)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              color: "var(--color-neon-cyan)",
                              fontSize: "0.85rem",
                            }}
                          >
                            {(u.name || u.email || "U")[0].toUpperCase()}
                          </div>
                          <div>
                            <p
                              style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 600,
                                color: "#e8e8ff",
                                fontSize: "0.82rem",
                              }}
                            >
                              {u.name || "—"}
                            </p>
                            <p
                              style={{
                                color: "var(--color-text-dim)",
                                fontSize: "0.72rem",
                              }}
                            >
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span
                          style={{
                            padding: "0.15rem 0.55rem",
                            borderRadius: "99px",
                            fontSize: "0.68rem",
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            background: `${ROLE_COLORS[u.role] || "#8888aa"}18`,
                            color: ROLE_COLORS[u.role] || "#8888aa",
                            border: `1px solid ${ROLE_COLORS[u.role] || "#8888aa"}44`,
                          }}
                        >
                          {u.role || "user"}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span
                          style={{
                            padding: "0.15rem 0.55rem",
                            borderRadius: "99px",
                            fontSize: "0.68rem",
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            background: isBanned
                              ? "rgba(255,50,50,0.1)"
                              : "rgba(57,255,20,0.08)",
                            color: isBanned ? "#ff5555" : "#39ff14",
                            border: `1px solid ${isBanned ? "rgba(255,50,50,0.3)" : "rgba(57,255,20,0.25)"}`,
                          }}
                        >
                          {isBanned ? "Banned" : "Active"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "0.75rem 1rem",
                          color: "var(--color-text-muted)",
                          fontSize: "0.78rem",
                        }}
                      >
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("vi-VN")
                          : "—"}
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        {u.role !== "admin" && (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u)}
                            style={{
                              padding: "0.3rem 0.65rem",
                              borderRadius: "6px",
                              border: `1px solid ${isBanned ? "rgba(57,255,20,0.3)" : "rgba(255,50,50,0.3)"}`,
                              background: isBanned
                                ? "rgba(57,255,20,0.06)"
                                : "rgba(255,50,50,0.08)",
                              color: isBanned ? "#39ff14" : "#ff5555",
                              cursor: "pointer",
                              fontSize: "0.73rem",
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            {isBanned ? "Activate" : "Ban"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default Users;
