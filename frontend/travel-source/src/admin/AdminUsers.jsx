// import { useEffect, useState } from "react";
// import styles from "./AdminUsers.module.css";
// import {
//     fetchUsers,
//     updateUserRole,
//     deleteUser,
// } from "../services/api";
// import { getAuthData } from "../utils/auth";

// const AdminUsers = () => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const auth = getAuthData();

//     const loadUsers = async () => {
//         try {
//             const data = await fetchUsers();
//             setUsers(data);
//         } catch (err) {
//             console.error("Failed to load users", err);
//             if (err.message.includes("401") || err.message.includes("Session expired")) {
//                 setError("SESSION_EXPIRED");
//             } else {
//                 setError("Failed to load users.");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         loadUsers();
//     }, []);

//     if (loading) {
//         return <p className={styles.loading}>Loading users...</p>;
//     }

//     if (error === "SESSION_EXPIRED") {
//         return (
//             <div className={styles.container}>
//                 <div className={styles.errorState}>
//                     <h3>Session Expired</h3>
//                     <p>Please log in again to manage users.</p>
//                     <a href="/login" className={styles.loginLink}>Go to Login</a>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className={styles.container}>
//             <h1 className={styles.title}>User Management</h1>

//             <div className={styles.table}>
//                 <div className={styles.header}>
//                     <span>Name</span>
//                     <span>Email</span>
//                     <span>Role</span>
//                     <span>Actions</span>
//                 </div>

//                 {users.map((user) => (
//                     <div key={user.id} className={styles.row}>
//                         <span>{user.username}</span>
//                         <span>{user.email}</span>
//                         <span>
//                             <span
//                                 className={
//                                     user.role === "ADMIN"
//                                         ? styles.adminBadge
//                                         : styles.userBadge
//                                 }
//                             >
//                                 {user.role}
//                             </span>
//                         </span>

//                         <span className={styles.actions}>
//                             {auth?.id !== user.id && (
//                                 <>
//                                     <button
//                                         className={styles.roleBtn}
//                                         onClick={() =>
//                                             updateUserRole(
//                                                 user.id,
//                                                 user.role === "ADMIN" ? "USER" : "ADMIN"
//                                             ).then(loadUsers)
//                                         }
//                                     >
//                                         Make {user.role === "ADMIN" ? "User" : "Admin"}
//                                     </button>

//                                     <button
//                                         className={styles.deleteBtn}
//                                         onClick={() => {
//                                             if (
//                                                 window.confirm(
//                                                     "Are you sure you want to delete this user?"
//                                                 )
//                                             ) {
//                                                 deleteUser(user.id).then(loadUsers);
//                                             }
//                                         }}
//                                     >
//                                         Delete
//                                     </button>
//                                 </>
//                             )}
//                         </span>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default AdminUsers;




import { useEffect, useState } from "react";
import styles from "./AdminUsers.module.css";
import {
    fetchUsers,
    updateUserRole,
    deleteUser,
} from "../services/api";
import { getAuthData } from "../utils/auth";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("all");
    const [actionLoading, setActionLoading] = useState(null);
    const auth = getAuthData();

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await fetchUsers();
            setUsers(data);
        } catch (err) {
            console.error("Failed to load users", err);
            if (err.message.includes("401") || err.message.includes("Session expired")) {
                setError("SESSION_EXPIRED");
            } else {
                setError("Failed to load users. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleRoleUpdate = async (userId, currentRole) => {
        setActionLoading(userId);
        try {
            const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
            await updateUserRole(userId, newRole);
            await loadUsers();
        } catch (err) {
            console.error("Failed to update role:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (window.confirm(`Are you sure you want to delete "${username}"? This action cannot be undone.`)) {
            setActionLoading(`delete-${userId}`);
            try {
                await deleteUser(userId);
                await loadUsers();
            } catch (err) {
                console.error("Failed to delete user:", err);
            } finally {
                setActionLoading(null);
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());

        if (selectedRole === "all") return matchesSearch;
        return matchesSearch && user.role === selectedRole;
    });

    const stats = {
        total: users.length,
        admin: users.filter(u => u.role === "ADMIN").length,
        user: users.filter(u => u.role === "USER").length,
    };

    const roleOptions = [
        { id: "all", label: "All Users", count: stats.total },
        { id: "ADMIN", label: "Admins", count: stats.admin },
        { id: "USER", label: "Users", count: stats.user },
    ];

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p className={styles.loadingText}>Loading users...</p>
            </div>
        );
    }

    if (error === "SESSION_EXPIRED") {
        return (
            <div className={styles.sessionExpired}>
                <div className={styles.sessionContent}>
                    <svg className={styles.sessionIcon} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <h3 className={styles.sessionTitle}>Session Expired</h3>
                    <p className={styles.sessionText}>Your session has expired. Please log in again to manage users.</p>
                    <a href="/login" className={styles.loginButton}>
                        <svg className={styles.loginIcon} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 102 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            {/* Background Overlay */}
            <div className={styles.backgroundOverlay}></div>

            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.pageTitle}>User Management</h1>
                        <p className={styles.pageSubtitle}>
                            Manage user accounts and permissions for Travel Professor
                        </p>
                    </div>

                    <div className={styles.headerActions}>
                        <div className={styles.searchContainer}>
                            <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        <button className={styles.refreshButton} onClick={loadUsers}>
                            <svg className={styles.refreshIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className={styles.statsSection}>
                    {roleOptions.map((role) => (
                        <div
                            key={role.id}
                            className={`${styles.statCard} ${selectedRole === role.id ? styles.statCardActive : ''}`}
                            onClick={() => setSelectedRole(role.id)}
                            style={{
                                '--role-color': role.id === 'ADMIN' ? '#10b981' :
                                    role.id === 'USER' ? '#3b82f6' : '#64748b'
                            }}
                        >
                            <div className={styles.statHeader}>
                                <h3 className={styles.statLabel}>{role.label}</h3>
                                <div className={styles.statIconWrapper}>
                                    {role.id === "ADMIN" && (
                                        <svg className={styles.statIcon} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.94 7.94a1 1 0 11-1.414 1.414 1 1 0 011.414-1.414zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {role.id === "USER" && (
                                        <svg className={styles.statIcon} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {role.id === "all" && (
                                        <svg className={styles.statIcon} viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <div className={styles.statNumber}>{role.count}</div>
                            <div className={styles.statSubtext}>
                                {role.id === "all" ? "Total accounts" :
                                    role.id === "ADMIN" ? "Administrators" : "Regular users"}
                            </div>
                            <div
                                className={styles.statWave}
                                style={{ background: `var(--role-color)10` }}
                            ></div>
                        </div>
                    ))}
                </div>

                {/* Users Table */}
                <div className={styles.tableContainer}>
                    <div className={styles.tableHeader}>
                        <div className={styles.tableTitleSection}>
                            <h3 className={styles.tableTitle}>User Accounts</h3>
                            {searchQuery && (
                                <span className={styles.searchResults}>
                                    Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                        <div className={styles.tableInfo}>
                            <span className={styles.userCount}>
                                {filteredUsers.length} of {users.length} users
                            </span>
                        </div>
                    </div>

                    {error && error !== "SESSION_EXPIRED" && (
                        <div className={styles.errorContainer}>
                            <svg className={styles.errorIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className={styles.errorContent}>
                                <h4 className={styles.errorTitle}>Error Loading Users</h4>
                                <p className={styles.errorText}>{error}</p>
                            </div>
                            <button className={styles.retryButton} onClick={loadUsers}>
                                <svg className={styles.retryIcon} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                </svg>
                                Try Again
                            </button>
                        </div>
                    )}

                    {filteredUsers.length > 0 ? (
                        <div className={styles.tableBody}>
                            <div className={styles.tableHeaderRow}>
                                <div className={styles.tableHeaderCell} style={{ flex: 2 }}>User</div>
                                <div className={styles.tableHeaderCell} style={{ flex: 2 }}>Contact</div>
                                <div className={styles.tableHeaderCell} style={{ flex: 1 }}>Role</div>
                                <div className={styles.tableHeaderCell} style={{ flex: 2 }}>Account Status</div>
                                <div className={styles.tableHeaderCell} style={{ width: '200px' }}>Actions</div>
                            </div>

                            {filteredUsers.map((user) => (
                                <div key={user.id} className={styles.userRow}>
                                    <div className={styles.userCell} style={{ flex: 2 }}>
                                        <div className={styles.userInfo}>
                                            <div className={styles.userAvatar}>
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className={styles.userDetails}>
                                                <h4 className={styles.userName}>{user.username}</h4>
                                                <p className={styles.userId}>ID: {user.id}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.userCell} style={{ flex: 2 }}>
                                        <div className={styles.contactInfo}>
                                            <div className={styles.contactItem}>
                                                <svg className={styles.contactIcon} viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                </svg>
                                                <span className={styles.contactText}>{user.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.userCell} style={{ flex: 1 }}>
                                        <div
                                            className={`${styles.roleBadge} ${user.role === "ADMIN" ? styles.roleAdmin : styles.roleUser
                                                }`}
                                        >
                                            <span className={styles.roleDot}></span>
                                            {user.role === "ADMIN" ? "Administrator" : "User"}
                                        </div>
                                    </div>

                                    <div className={styles.userCell} style={{ flex: 2 }}>
                                        <div className={styles.accountStatus}>
                                            {auth?.id === user.id ? (
                                                <div className={styles.currentUser}>
                                                    <svg className={styles.currentUserIcon} viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>Current User</span>
                                                </div>
                                            ) : (
                                                <div className={styles.statusActive}>
                                                    <svg className={styles.statusIcon} viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>Active</span>
                                                </div>
                                            )}
                                            <div className={styles.createdDate}>
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.userCell} style={{ width: '200px' }}>
                                        <div className={styles.actionButtons}>
                                            {auth?.id !== user.id ? (
                                                <>
                                                    <button
                                                        className={styles.roleButton}
                                                        onClick={() => handleRoleUpdate(user.id, user.role)}
                                                        disabled={actionLoading === user.id}
                                                    >
                                                        {actionLoading === user.id ? (
                                                            <div className={styles.buttonSpinner}></div>
                                                        ) : (
                                                            <svg className={styles.roleIcon} viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                                            </svg>
                                                        )}
                                                        {actionLoading === user.id
                                                            ? "Updating..."
                                                            : `Make ${user.role === "ADMIN" ? "User" : "Admin"}`
                                                        }
                                                    </button>
                                                    <button
                                                        className={styles.deleteButton}
                                                        onClick={() => handleDeleteUser(user.id, user.username)}
                                                        disabled={actionLoading === `delete-${user.id}`}
                                                    >
                                                        {actionLoading === `delete-${user.id}` ? (
                                                            <div className={styles.buttonSpinner}></div>
                                                        ) : (
                                                            <svg className={styles.deleteIcon} viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                        {actionLoading === `delete-${user.id}` ? "Deleting..." : "Delete"}
                                                    </button>
                                                </>
                                            ) : (
                                                <div className={styles.selfActions}>
                                                    <span className={styles.selfText}>You cannot modify your own account</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3 className={styles.emptyTitle}>No Users Found</h3>
                            <p className={styles.emptyText}>
                                {searchQuery || selectedRole !== "all"
                                    ? "No users match your current filters. Try adjusting your search or filters."
                                    : "There are no users in the system yet."}
                            </p>
                            {(searchQuery || selectedRole !== "all") && (
                                <button
                                    className={styles.clearFiltersButton}
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedRole("all");
                                    }}
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;